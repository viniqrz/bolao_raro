import { ICampeonatoRepository } from "../repositories/ICampeonatoRepository";
import { CampeonatoDTO } from "../@types/dtos/campeonatoDto";
import { Campeonato } from "../models/CampeonatoEntity";
import { APIBrasileirao } from "../clients/brasileirao";
import { RodadaService } from "./RodadaService";
import { RodadaRepository } from "../repositories/RodadaRepository";
import { Rodada } from "../models/RodadaEntity";

import "dotenv/config";

interface ICampeonatoService {
  create(data: CampeonatoDTO): Promise<Campeonato>;
  updateResults(idCampeonatoApiExterna: number): Promise<Rodada[]>;
}

export class CampeonatoService implements ICampeonatoService {
  constructor(private repository: ICampeonatoRepository) {}

  public async create(data: CampeonatoDTO): Promise<Campeonato> {
    const campeonato = this.factory(data);

    const savedCampeonato = await this.repository.save(campeonato);

    return savedCampeonato;
  }

  public async updateAllResults() {
    const campeonatos = await this.repository.findAll();

    const activeCampeonatos = this.getActiveCampeonatos(campeonatos);

    const rodadas = await Promise.all(
      activeCampeonatos.map(({ idCampeonatoApiExterna }) =>
        this.updateResults(idCampeonatoApiExterna)
      )
    );

    return rodadas;
  }

  public async updateResults(
    idCampeonatoApiExterna: number
  ): Promise<Rodada[]> {
    const client = new APIBrasileirao();
    const rodadaRepository = new RodadaRepository();
    const rodadaService = new RodadaService(rodadaRepository, client);

    return await rodadaService.updateAllFromApi(idCampeonatoApiExterna);
  }

  private getActiveCampeonatos(campeonatos: Campeonato[]) {
    return campeonatos.filter(
      (campeonato) => campeonato.status === "em andamento"
    );
  }

  private getRodadaPromises(campeonatos: Campeonato[]) {
    const client = new APIBrasileirao();

    return campeonatos.map(({ idCampeonatoApiExterna }) =>
      client.buscarRodadas(10)
    );
  }

  private factory(data: CampeonatoDTO) {
    const campeonato = new Campeonato();

    campeonato.nome = data.nome;
    campeonato.slug = data.slug;
    campeonato.nomePopular = data.nomePopular;
    campeonato.status = data.status;
    campeonato.logo = data.logo;
    campeonato.idCampeonatoApiExterna = data.idCampeonatoApiExterna;

    return campeonato;
  }
}
