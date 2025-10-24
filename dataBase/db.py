from config import Config
from datetime import datetime, timedelta, date
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, DateTime,
    ForeignKey, Enum, func, Date, cast, extract
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

# =========================
# Conexión y sesión
# =========================
ENGINE = create_engine(
    Config.URL,
    future=True,
    echo=False,
    pool_pre_ping=True,  
)
SessionLocal = sessionmaker(bind=ENGINE, autoflush=False, autocommit=False, expire_on_commit=False)
Base = declarative_base()

# ==========
# Modelos
# ==========
class Region(Base):
    __tablename__ = "region"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region", lazy="selectin")


class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AvisoAdopcion", back_populates="comuna", lazy="selectin")


TipoEnum   = Enum("gato", "perro", name="tipo_enum")
UMEnum     = Enum("a", "m", name="unidad_medida_enum")
MedioEnum  = Enum("whatsapp", "telegram", "x", "instagram", "tiktok", "otra", name="medio_enum")

class AvisoAdopcion(Base):
    __tablename__ = "aviso_adopcion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, nullable=False, server_default=func.now())

    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))

    tipo = Column(TipoEnum, nullable=False)         
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(UMEnum, nullable=False) 

    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text)

    comuna = relationship("Comuna", back_populates="avisos", lazy="joined")
    fotos = relationship("Foto", back_populates="aviso", cascade="all, delete-orphan", lazy="selectin")
    contactos = relationship("ContactarPor", back_populates="aviso", cascade="all, delete-orphan", lazy="selectin")
    comentarios = relationship("Comentario", back_populates="aviso", cascade="all, delete-orphan", lazy="selectin")


class Foto(Base):
    __tablename__ = "foto"

    id = Column(Integer, primary_key=True, autoincrement=True)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), primary_key=True, nullable=False)

    ruta_archivo = Column(String(300), nullable=False)  
    nombre_archivo = Column(String(300), nullable=False)

    aviso = relationship("AvisoAdopcion", back_populates="fotos")


class ContactarPor(Base):
    __tablename__ = "contactar_por"

    id = Column(Integer, primary_key=True, autoincrement=True)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), primary_key=True, nullable=False)

    nombre = Column(MedioEnum, nullable=False)         
    identificador = Column(String(150), nullable=False) 

    aviso = relationship("AvisoAdopcion", back_populates="contactos")

class Comentario(Base):
    __tablename__ = "comentario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)
    texto  = Column(String(300), nullable=False)
    fecha  = Column(DateTime, nullable=False, server_default=func.now())
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)

    aviso = relationship("AvisoAdopcion", back_populates="comentarios")


def get_session():
    return SessionLocal()


# ==========
# Funciones
# ==========
def list_regiones():
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.nombre.asc()).all()
    session.close()
    return regiones


def list_comunas_by_region(region_id):
    session = SessionLocal()
    comunas = (
        session.query(Comuna)
        .filter(Comuna.region_id == region_id)
        .order_by(Comuna.nombre.asc())
        .all()
    )
    session.close()
    return comunas


def get_ultimos_avisos(limit=5):
    session = SessionLocal()
    avisos = (
        session.query(AvisoAdopcion)
        .order_by(AvisoAdopcion.fecha_ingreso.desc())
        .limit(limit)
        .all()
    )
    for a in avisos:
        _ = a.comuna, a.fotos
    session.close()
    return avisos


def list_avisos_paginado(page=1, per_page=5):
    session = SessionLocal()
    total = session.query(func.count(AvisoAdopcion.id)).scalar() or 0
    total_paginas = max(1, (total + per_page - 1) // per_page)
    page = max(1, min(page, total_paginas))

    avisos = (
        session.query(AvisoAdopcion)
        .order_by(AvisoAdopcion.fecha_ingreso.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    for a in avisos:
        _ = a.comuna, a.fotos
    session.close()
    return avisos, total_paginas


def get_aviso_by_id(aviso_id: int):
    session = SessionLocal()
    aviso = session.query(AvisoAdopcion).filter_by(id=aviso_id).first()
    if aviso:
        _ = aviso.comuna, aviso.fotos, aviso.contactos
    session.close()
    return aviso


def create_aviso(
    comuna_id, sector, nombre, email, celular,
    tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion=None
):
    session = SessionLocal()
    nuevo = AvisoAdopcion(
        comuna_id=comuna_id,
        sector=(sector or "")[:100],
        nombre=nombre[:200],
        email=email[:100],
        celular=(celular or "")[:15] or None,
        tipo=tipo,
        cantidad=int(cantidad),
        edad=int(edad),
        unidad_medida=unidad_medida,
        fecha_entrega=fecha_entrega,
        descripcion=(descripcion or None),
        fecha_ingreso=datetime.utcnow(),
    )
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo) 
    nuevo_id = nuevo.id
    session.close()
    return nuevo_id


def add_contacto(aviso_id, medio, identificador):
    session = SessionLocal()
    c = ContactarPor(
        aviso_id=aviso_id,
        nombre=medio,                     
        identificador=identificador[:150],
    )
    session.add(c)
    session.commit()
    session.refresh(c)
    cid = c.id
    session.close()
    return cid


def add_foto(aviso_id, ruta_archivo, nombre_archivo):
    session = SessionLocal()
    f = Foto(
        aviso_id=aviso_id,
        ruta_archivo=ruta_archivo[:300],  
        nombre_archivo=nombre_archivo[:300]
    )
    session.add(f)
    session.commit()
    session.refresh(f)
    fid = f.id
    session.close()
    return fid

def stats_linea_14dias():
    session = SessionLocal()
    try:
        hoy = datetime.utcnow().date()
        desde = hoy - timedelta(days=13)

        filas = (
            session.query(
                cast(AvisoAdopcion.fecha_ingreso, Date).label("dia"),
                func.count(AvisoAdopcion.id).label("total")
            )
            .filter(cast(AvisoAdopcion.fecha_ingreso, Date) >= desde)
            .group_by("dia")
            .order_by("dia")
            .all()
        )
        mapa = {d: t for d, t in filas}

        serie = []
        for i in range(14):
            d = desde + timedelta(days=i)
            serie.append({"dia": d.strftime("%Y-%m-%d"), "total": int(mapa.get(d, 0))})
        return serie
    finally:
        session.close()

def stats_por_tipo():
    session = SessionLocal()
    try:
        filas = (
            session.query(AvisoAdopcion.tipo, func.count(AvisoAdopcion.id))
            .group_by(AvisoAdopcion.tipo)
            .all()
        )
        m = {t: c for t, c in filas}
        return {"gato": int(m.get("gato", 0)), "perro": int(m.get("perro", 0))}
    finally:
        session.close()

def stats_barras_anio(anio: int | None = None):
    session = SessionLocal()
    try:
        y = anio or datetime.utcnow().year

        filas = (
            session.query(
                extract('month', AvisoAdopcion.fecha_ingreso).label('m'),
                AvisoAdopcion.tipo,
                func.count(AvisoAdopcion.id)
            )
            .filter(extract('year', AvisoAdopcion.fecha_ingreso) == y)
            .group_by('m', AvisoAdopcion.tipo)
            .all()
        )
        mapa = {}
        for m, tipo, cnt in filas:
            mapa[(int(m), tipo)] = int(cnt)

        labels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
        gato  = [mapa.get((i, "gato"), 0)  for i in range(1, 13)]
        perro = [mapa.get((i, "perro"), 0) for i in range(1, 13)]

        return {"anio": y, "labels": labels, "gato": gato, "perro": perro}
    finally:
        session.close()

def list_comentarios(aviso_id: int):
    session = SessionLocal()
    try:
        return (session.query(Comentario)
                .filter_by(aviso_id=aviso_id)
                .order_by(Comentario.fecha.desc())
                .all())
    finally:
        session.close()

def create_comentario(aviso_id: int, nombre: str, texto: str):
    session = SessionLocal()
    try:
        c = Comentario(aviso_id=aviso_id, nombre=nombre[:80], texto=texto[:300])
        session.add(c)
        session.commit()
        session.refresh(c)
        return c.id
    finally:
        session.close()


