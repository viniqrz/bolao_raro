import { ICampeonatoRepository } from "../repositories/ICampeonatoRepository";
import { CampeonatoDTO } from "../@types/dtos/campeonatoDto";
import { Campeonato } from "../models/CampeonatoEntity";
import { APIBrasileirao } from "../clients/brasileirao";

import "dotenv/config";

interface ICampeonatoService {
  create(data: CampeonatoDTO): Promise<Campeonato>;
  updateResults(): any;
}

export class CampeonatoService implements ICampeonatoService {
  constructor(private repository: ICampeonatoRepository) {}

  public async create(data: CampeonatoDTO): Promise<Campeonato> {
    const campeonato = this.factory(data);

    const savedCampeonato = await this.repository.save(campeonato);

    return savedCampeonato;
  }

  public async updateResults() {
    const campeonatos = await this.repository.findAll();

    const activeCampeonatos = this.getActiveCampeonatos(campeonatos);
    const rodadaPromises = this.getRodadaPromises(activeCampeonatos);

    const rodadas = await Promise.all(rodadaPromises);

    // @todo
    // rodadas.forEach()

    return rodadas;
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
