package Tarea4.controllers;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import Tarea4.models.AvisoAdopcion;
import Tarea4.models.AvisoAdopcionRepository;

@Controller
public class AppController {

    private final AvisoAdopcionRepository avisoRepo;

    public AppController(AvisoAdopcionRepository avisoRepo) {
        this.avisoRepo = avisoRepo;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<AvisoAdopcion> avisos = avisoRepo.findTop5ByOrderByFechaIngresoDesc();
        model.addAttribute("avisos", avisos);
        return "index";
    }

    @GetMapping("/listado")
    public String listado(
            @RequestParam(name = "page", defaultValue = "1") int page,
            Model model
    ) {
        int pageSize = 5;
        if (page < 1) {
            page = 1;
        }

        PageRequest pageable = PageRequest.of(
                page - 1,
                pageSize,
                Sort.by("fechaIngreso").descending()
        );

        Page<AvisoAdopcion> pagina = avisoRepo.findAll(pageable);

        model.addAttribute("avisos", pagina.getContent());
        model.addAttribute("page", page);
        model.addAttribute("totalPaginas", pagina.getTotalPages());

        return "listado";
    }
}


