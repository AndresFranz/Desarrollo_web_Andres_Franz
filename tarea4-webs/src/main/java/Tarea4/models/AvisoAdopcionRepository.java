package Tarea4.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AvisoAdopcionRepository extends JpaRepository<AvisoAdopcion, Long> {
    List<AvisoAdopcion> findTop5ByOrderByFechaIngresoDesc();
}

