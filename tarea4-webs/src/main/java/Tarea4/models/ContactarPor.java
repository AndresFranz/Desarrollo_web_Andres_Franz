package Tarea4.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "contactar_por")
public class ContactarPor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "aviso_id", nullable = false)
    private AvisoAdopcion aviso;

    @NotNull
    private String nombre;   // whatsapp, telegram, etc.

    @NotNull
    private String identificador; // número, user, etc.

    public ContactarPor() {
    }

    public ContactarPor(AvisoAdopcion aviso, String nombre, String identificador) {
        this.aviso = aviso;
        this.nombre = nombre;
        this.identificador = identificador;
    }

    public Long getId() {
        return id;
    }

    public AvisoAdopcion getAviso() {
        return aviso;
    }

    public String getNombre() {
        return nombre;
    }

    public String getIdentificador() {
        return identificador;
    }
}

