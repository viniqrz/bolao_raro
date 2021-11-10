import { ICampeonatoRepository } from "../repositories/ICampeonatoRepository";
import { CampeonatoDTO } from "../@types/dtos/campeonatoDto";
import { Campeonato } from "../models/CampeonatoEntity";
import { APIBrasileirao } from "../clients/brasileirao";
import { RodadaService } from "./RodadaService";
import { RodadaRepository } from "../repositories/RodadaRepository";
import { Rodada } from "../models/RodadaEntity";

import "dotenv/config";
import { getCustomRepository } from "typeorm";
import { TimeRepository } from "../repositories/TimeRepository";
import { TimeService } from "./TimeService";
import { serviceFactory } from "../helpers/serviceFactory";
import { Time } from "../models/TimeEntity";

interface ICampeonatoService {
  create(data: CampeonatoDTO): Promise<Campeonato>;
  updateAllResultsFromApi(): Promise<Rodada[][]>;
}

export class CampeonatoService implements ICampeonatoService {
  constructor(private repository: ICampeonatoRepository) {}

  public async create(data: CampeonatoDTO): Promise<Campeonato> {
    const campeonato = this.campeonatoFactory(data);

    const savedCampeonato = await this.repository.save(campeonato);

    return savedCampeonato;
  }

  public async updateAllResultsFromApi(): Promise<Rodada[][]> {
    const campeonatos = await this.repository.findAll();

    const activeCampeonatos = this.getActiveCampeonatos(campeonatos);

    const rodadas = await Promise.all(
      activeCampeonatos.map((c) => this.updateResultsFromApi(c))
    );

    return rodadas;
  }

  private async updateResultsFromApi(
    campeonato: Campeonato
  ): Promise<Rodada[]> {
    const id = campeonato.idCampeonatoApiExterna;

    const times = await serviceFactory.time().updateAllFromApi(id);
    const rodadas = await serviceFactory.rodada().updateAllFromApi(campeonato);

    return rodadas;
  }

  private getActiveCampeonatos(campeonatos: Campeonato[]) {
    return campeonatos.filter((c) => c.status === "em andamento");
  }

  private campeonatoFactory(data: CampeonatoDTO) {
    const campeonato = new Campeonato();

    campeonato.idCampeonatoApiExterna = data.idCampeonatoApiExterna;
    campeonato.nomePopular = data.nomePopular;
    campeonato.status = data.status;
    campeonato.nome = data.nome;
    campeonato.slug = data.slug;
    campeonato.logo = data.logo;

    return campeonato;
  }
}
