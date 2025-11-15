package Tarea4.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "comentario")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nombre;

    @NotNull
    @Column(name = "texto")
    private String texto;

    @NotNull
    private LocalDateTime fecha;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "aviso_id", nullable = false)
    private AvisoAdopcion aviso;

    public Comentario() {
    }

    public Comentario(String nombre, String texto, LocalDateTime fecha, AvisoAdopcion aviso) {
        this.nombre = nombre;
        this.texto = texto;
        this.fecha = fecha;
        this.aviso = aviso;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTexto() {
        return texto;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public AvisoAdopcion getAviso() {
        return aviso;
    }
}

