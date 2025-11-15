package Tarea4.models;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "aviso_adopcion")
public class AvisoAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "comuna_id", nullable = false)
    private Comuna comuna;

    private String sector;

    @NotNull
    private String nombre;

    @NotNull
    private String email;

    private String celular;

    @NotNull
    private String tipo;

    @NotNull
    private Integer cantidad;

    @NotNull
    private Integer edad;

    @NotNull
    @Column(name = "unidad_medida")
    private String unidadMedida;

    @NotNull
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "aviso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Foto> fotos;

    @OneToMany(mappedBy = "aviso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ContactarPor> contactos;

    @OneToMany(mappedBy = "aviso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "aviso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas;

    public AvisoAdopcion() {
    }

    public AvisoAdopcion(
            LocalDateTime fechaIngreso,
            Comuna comuna,
            String sector,
            String nombre,
            String email,
            String celular,
            String tipo,
            Integer cantidad,
            Integer edad,
            String unidadMedida,
            LocalDateTime fechaEntrega,
            String descripcion
    ) {
        this.fechaIngreso = fechaIngreso;
        this.comuna = comuna;
        this.sector = sector;
        this.nombre = nombre;
        this.email = email;
        this.celular = celular;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.edad = edad;
        this.unidadMedida = unidadMedida;
        this.fechaEntrega = fechaEntrega;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public Comuna getComuna() {
        return comuna;
    }

    public String getSector() {
        return sector;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getCelular() {
        return celular;
    }

    public String getTipo() {
        return tipo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public Integer getEdad() {
        return edad;
    }

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public List<Foto> getFotos() {
        return fotos;
    }

    @Transient
    public String getFotoPrincipal() {
        if (fotos != null && !fotos.isEmpty() && fotos.get(0) != null) {
            return fotos.get(0).getRutaArchivo();
        }
        return null;
    }

    public List<ContactarPor> getContactos() {
        return contactos;
    }

    public List<Comentario> getComentarios() {
        return comentarios;
    }

    public List<Nota> getNotas() {
        return notas;
    }

    @Transient
    public Double getPromedioNota() {
        if (notas == null || notas.isEmpty()) {
            return null;
        }
        double suma = 0;
        for (Nota n : notas) {
            suma += n.getNota();
        }
        return suma / notas.size();
    }
}


