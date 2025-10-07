from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from datetime import datetime
from werkzeug.utils import secure_filename
import os

from dataBase.db import (
    list_regiones,
    list_comunas_by_region,
    get_ultimos_avisos,
    list_avisos_paginado,
    create_aviso,
    add_contacto,
    add_foto,
)

# =======================
# Configuración de Flask
# =======================
app = Flask(__name__)
app.config["SECRET_KEY"] = "s3cr3t_k3y"  

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTS = {"png", "jpg", "jpeg", "gif", "webp"}


def _es_extension_permitida(nombre_archivo: str) -> bool:
    if "." not in nombre_archivo:
        return False
    ext = nombre_archivo.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTS


# ============
# Rutas
# ============

@app.route("/")
def index():
    avisos = get_ultimos_avisos(limit=5)

    avisos_con_foto = []
    for a in avisos:
        foto_url = None
        try:
            if a.fotos and len(a.fotos) > 0:
                foto_url = url_for("static", filename=a.fotos[0].ruta_archivo)
        except Exception:
            foto_url = None
        a.foto_url = foto_url
        avisos_con_foto.append(a)

    return render_template("index.html", avisos=avisos_con_foto)


@app.route("/listado")
def listado():
    try:
        page = int(request.args.get("page", 1))
    except ValueError:
        page = 1

    per_page = 5
    avisos, total_paginas = list_avisos_paginado(page=page, per_page=per_page)

    return render_template(
        "listado.html",
        avisos=avisos,
        page=page,
        total_paginas=total_paginas,
    )


@app.route("/agregar", methods=["GET", "POST"])
def agregar():
    if request.method == "GET":
        regiones = list_regiones()
        return render_template("agregar.html", regiones=regiones)

    form = request.form
    files = request.files

    try:
        region_id = int(form.get("region", "").strip())
        comuna_id = int(form.get("comuna", "").strip())
        nombre = form.get("nombre", "").strip()
        email = form.get("email", "").strip()
        tipo = form.get("tipo", "").strip() 
        cantidad = int(form.get("cantidad", "0"))
        edad = int(form.get("edad", "0"))
        unidad_medida = form.get("unidadEdad", "").strip()
        fecha_entrega_str = form.get("fechaEntrega", "").strip()
        fecha_entrega = datetime.strptime(fecha_entrega_str, "%Y-%m-%dT%H:%M")

    except Exception:
        flash("Datos inválidos.", "error")
        return redirect(url_for("agregar"))

    sector = form.get("sector", "").strip()
    celular = form.get("celular", "").strip() or None
    descripcion = form.get("descripcion", "").strip() or None


    aviso_id = create_aviso(
        comuna_id=comuna_id,
        sector=sector,
        nombre=nombre,
        email=email,
        celular=celular,
        tipo=tipo,
        cantidad=cantidad,
        edad=edad,
        unidad_medida=unidad_medida,
        fecha_entrega=fecha_entrega,
        descripcion=descripcion,
    )

    medio = form.get("contactar", "").strip() 
    contacto_id = form.get("contactoID", "").strip()
    if medio and contacto_id:
        try:
            add_contacto(aviso_id, medio, contacto_id)
        except Exception:
            pass

    fotos_subidas = request.files.getlist("foto")

    subidas_ok = 0
    for f in fotos_subidas:
        if not f or f.filename == "":
            continue
        if not _es_extension_permitida(f.filename):
            continue
        filename = secure_filename(f.filename)
        ts = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename_final = f"{ts}_{filename}"
        ruta_abs = os.path.join(UPLOAD_DIR, filename_final)
        f.save(ruta_abs)

        ruta_rel_static = os.path.join("uploads", filename_final).replace("\\", "/")
        try:
            add_foto(aviso_id, ruta_rel_static, filename_final)
            subidas_ok += 1
        except Exception:
            pass

    if subidas_ok == 0:
        flash("El aviso se creó, pero no se pudo guardar ninguna foto (formato no permitido).", "error")
        return redirect(url_for("index")) 

    flash("¡Aviso creado exitosamente!", "success")
    return redirect(url_for("index"))


@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.get("/api/comunas")
def api_comunas():
    region_id = request.args.get("region_id", type=int)
    if not region_id:
        return jsonify({"comunas": []})
    comunas = list_comunas_by_region(region_id)  
    return jsonify({"comunas": [{"id": c.id, "nombre": c.nombre} for c in comunas]})


if __name__ == "__main__":
    app.run(debug=True)
