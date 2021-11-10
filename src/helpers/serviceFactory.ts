import { getCustomRepository } from "typeorm";

import { CampeonatoRepository } from "../repositories/CampeonatoRepository";
import { CampeonatoService } from "../services/CampeonatoService";

import { TimeRepository } from "../repositories/TimeRepository";
import { TimeService } from "../services/TimeService";

import { RodadaRepository } from "../repositories/RodadaRepository";
import { RodadaService } from "../services/RodadaService";

import { PartidaRepository } from "../repositories/PartidaRepository";
import { PartidaService } from "../services/PartidaService";

import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { UsuarioService } from "../services/UsuarioService";

import { APIBrasileirao } from "../clients/brasileirao";

const serviceFactory = {
  client: new APIBrasileirao(),

  usuario(): UsuarioService {
    const usuarioRepository = getCustomRepository(UsuarioRepository);
    const usuarioService = new UsuarioService(usuarioRepository);

    return usuarioService;
  },

  campeonato(): CampeonatoService {
    const repository = getCustomRepository(CampeonatoRepository);
    const campeonatoService = new CampeonatoService(repository);

    return campeonatoService;
  },

  time(): TimeService {
    const timeRepository = getCustomRepository(TimeRepository);
    const timeService = new TimeService(timeRepository, this.client);

    return timeService;
  },

  rodada(): RodadaService {
    const rodadaRepository = getCustomRepository(RodadaRepository);
    const rodadaService = new RodadaService(rodadaRepository, this.client);

    return rodadaService;
  },

  partida(): PartidaService {
    const partidaRepository = getCustomRepository(PartidaRepository);
    const partidaService = new PartidaService(partidaRepository);

    return partidaService;
  },
};

export { serviceFactory };
