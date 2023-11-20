package com.miApp.fitTrack.repository;

import com.miApp.fitTrack.model.ZonaCuerpo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositoryZonaCuerpo extends JpaRepository<ZonaCuerpo, Integer> {
}
