package com.miApp.fitTrack.controller;

import com.miApp.fitTrack.interfaceService.IRegistroActividadService;
import com.miApp.fitTrack.model.RegistroActividad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/actividad")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ControllerRegistroActividad {
    
    @Autowired
    private IRegistroActividadService iRegistroActividadService;

    @GetMapping("/listar")
    public List<RegistroActividad> listarRegistroActividad() {
        List<RegistroActividad> actividad = iRegistroActividadService.listarRegistroActividad();
        return actividad;
    }

    @GetMapping("/listar/{id}")
    public Optional<RegistroActividad> listarRegistroActividadId(@PathVariable int id) {
        Optional<RegistroActividad> actividad = iRegistroActividadService.listIdRegistroActividad(id);
        return actividad;
    }

    @PostMapping("/crear")
    public int crearRegistroActividad(@RequestBody RegistroActividad rol) {
        int newRegistroActividad = iRegistroActividadService.saveRegistroActividad(rol);
        return newRegistroActividad;
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarRegistroActividad(@PathVariable int id) {
        iRegistroActividadService.deleteRegistroActividad(id);
        return ResponseEntity.ok("RegistroActividad eliminada exitosamente");
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<String> actualizarRegistroActividad(@PathVariable int id, @RequestBody RegistroActividad actividad) {
        Boolean existingRegistroActividad = iRegistroActividadService.actualizarRegistroActividad(id, actividad);

        if (existingRegistroActividad) {
            return ResponseEntity.ok("RegistroActividad actualizada exitosamente");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
