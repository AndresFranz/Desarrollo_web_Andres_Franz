package Tarea4.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "aviso_id", nullable = false)
    private AvisoAdopcion aviso;

    @NotNull
    private Integer nota;

    public Nota() {
    }

    public Nota(AvisoAdopcion aviso, Integer nota) {
        this.aviso = aviso;
        this.nota = nota;
    }

    public Long getId() {
        return id;
    }

    public AvisoAdopcion getAviso() {
        return aviso;
    }

    public Integer getNota() {
        return nota;
    }
}
