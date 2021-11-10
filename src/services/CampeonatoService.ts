import "dotenv/config";

import { ICampeonatoRepository } from "../repositories/ICampeonatoRepository";
import { CampeonatoDTO } from "../@types/dtos/campeonatoDto";
import { Campeonato } from "../models/CampeonatoEntity";
import { Rodada } from "../models/RodadaEntity";
import { serviceFactory } from "../helpers/serviceFactory";

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
    const rodadas = this.getResultsPromises(activeCampeonatos);

    const savedRodadas = await Promise.all(rodadas);

    return savedRodadas;
  }

  private async updateResultsFromApi(
    campeonato: Campeonato
  ): Promise<Rodada[]> {
    const id = campeonato.idCampeonatoApiExterna;

    const times = await serviceFactory.time().updateAllFromApi(id);
    const rodadas = await serviceFactory.rodada().updateAllFromApi(campeonato);

    return rodadas;
  }

  private getResultsPromises(activeCampeonatos: Campeonato[]) {
    return activeCampeonatos.map((c) => this.updateResultsFromApi(c));
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
