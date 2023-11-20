package com.miApp.fitTrack.interfaceService;

import com.miApp.fitTrack.model.ZonaCuerpo;

import java.util.List;
import java.util.Optional;

public interface IZonaCuerpoService {

    public List<ZonaCuerpo> listarZonaCuerpo();
    public Optional<ZonaCuerpo> listIdZonaCuerpo(int id);
    public int saveZonaCuerpo (ZonaCuerpo zona);

    boolean actualizarZonaCuerpo(int id, ZonaCuerpo zona);
    public void deleteZonaCuerpo(int id);
}
