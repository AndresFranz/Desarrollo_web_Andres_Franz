package Tarea4.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.aviso.id = :avisoId")
    Double promedioPorAviso(@Param("avisoId") Long avisoId);
}

