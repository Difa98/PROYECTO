package com.miApp.fitTrack.repository;

import com.miApp.fitTrack.model.DiaSemana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositoryDiaSemana extends JpaRepository<DiaSemana, Integer> {

}
