package Tarea4.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "foto")
public class Foto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "aviso_id", nullable = false)
    private AvisoAdopcion aviso;

    @NotNull
    @Column(name = "ruta_archivo")
    private String rutaArchivo;

    @NotNull
    @Column(name = "nombre_archivo")
    private String nombreArchivo;

    public Foto() {
    }

    public Foto(AvisoAdopcion aviso, String rutaArchivo, String nombreArchivo) {
        this.aviso = aviso;
        this.rutaArchivo = rutaArchivo;
        this.nombreArchivo = nombreArchivo;
    }

    public Long getId() {
        return id;
    }

    public AvisoAdopcion getAviso() {
        return aviso;
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }
}

