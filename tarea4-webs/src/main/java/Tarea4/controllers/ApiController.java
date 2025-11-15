package Tarea4.controllers;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Tarea4.models.AvisoAdopcion;
import Tarea4.models.AvisoAdopcionRepository;
import Tarea4.models.Nota;
import Tarea4.models.NotaRepository;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final AvisoAdopcionRepository avisoRepo;
    private final NotaRepository notaRepo;

    public ApiController(AvisoAdopcionRepository avisoRepo, NotaRepository notaRepo) {
        this.avisoRepo = avisoRepo;
        this.notaRepo = notaRepo;
    }

    @PostMapping("/evaluar/{id}")
    public ResponseEntity<?> evaluarAviso(
            @PathVariable Long id,
            @RequestParam Integer nota
    ) {
        if (nota == null || nota < 1 || nota > 7) {
            return ResponseEntity.badRequest().body("La nota debe estar entre 1 y 7.");
        }

        Optional<AvisoAdopcion> avisoOpt = avisoRepo.findById(id);

        if (avisoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AvisoAdopcion aviso = avisoOpt.get();

        Nota nueva = new Nota(aviso, nota);
        notaRepo.save(nueva);

        Double promedio = notaRepo.promedioPorAviso(id);

        return ResponseEntity.ok(
                Map.of(
                        "id", id,
                        "notaIngresada", nota,
                        "promedio", promedio
                )
        );
    }
}
