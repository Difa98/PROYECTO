package com.miApp.fitTrack.services;

import com.miApp.fitTrack.interfaceService.IDiaSemanaService;
import com.miApp.fitTrack.model.DiaSemana;
import com.miApp.fitTrack.repository.RepositoryDiaSemana;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceDiaSemana implements IDiaSemanaService {

    @Autowired
    private RepositoryDiaSemana repositoryDiaSemana;

    @Override
    public List<DiaSemana> listarDiaSemana(){return (List<DiaSemana>) repositoryDiaSemana.findAll();}

    @Override
    public Optional<DiaSemana> listIdDiaSemana(int id){ return repositoryDiaSemana.findById(id);}

    @Override
    public int saveDiaSemana(DiaSemana dia) {
        int res = 0;
        DiaSemana diaSaved = repositoryDiaSemana.save(dia);
        if (diaSaved != null) {
            res = 1;
        }
        return res;
    }

    @Override
    public boolean actualizarDiaSemana(int id, DiaSemana dia) {
        Optional<DiaSemana> existingDiaSemana = repositoryDiaSemana.findById(id);
        if (existingDiaSemana.isPresent()) {
            DiaSemana updatedDiaSemana = existingDiaSemana.get();

            updatedDiaSemana.setNombre(dia.getNombre());

            repositoryDiaSemana.save(updatedDiaSemana);
            return true;
        } else {
            return false;
        }
    }


    @Override
    public void deleteDiaSemana(int id){repositoryDiaSemana.deleteById(id);}
    
}
