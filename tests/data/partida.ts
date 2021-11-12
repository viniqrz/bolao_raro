import {
  DUMMY_TEAM_1_DATA,
  DUMMY_TEAM_1,
  DUMMY_TEAM_2_DATA,
  DUMMY_TEAM_2,
} from "./time";

import { APIPartida } from "../../src/@types/dtos/api/brasileirao";
import { Partida } from "../../src/models/PartidaEntity";

const DUMMY_MATCH_ID = 121212;
const DUMMY_MATCH_STATUS = "encerrada";
const DUMMY_PLACAR_MANDANTE = 1;
const DUMMY_PLACAR_VISITANTE = 2;
const DUMMY_DATA_ISO = new Date();
const DUMMY_PLACAR = "Mandante 1x2 Visitante";
const DUMMY_MATCH_SLUG = "mandante-visitante";

export const DUMMY_PARTIDA_DATA: APIPartida = {
  partida_id: DUMMY_MATCH_ID,
  status: DUMMY_MATCH_STATUS,
  placar_mandante: DUMMY_PLACAR_MANDANTE,
  placar_visitante: DUMMY_PLACAR_VISITANTE,
  data_realizacao_iso: DUMMY_DATA_ISO,
  placar: DUMMY_PLACAR,
  slug: DUMMY_MATCH_SLUG,
  time_mandante: DUMMY_TEAM_1_DATA,
  time_visitante: DUMMY_TEAM_2_DATA,
};

export const DUMMY_PARTIDA = new Partida();

DUMMY_PARTIDA.id = DUMMY_MATCH_ID;
DUMMY_PARTIDA.status = DUMMY_MATCH_STATUS;
DUMMY_PARTIDA.placarMandante = DUMMY_PLACAR_MANDANTE;
DUMMY_PARTIDA.placarVisitante = DUMMY_PLACAR_VISITANTE;
DUMMY_PARTIDA.dataRealizacao = DUMMY_DATA_ISO;
DUMMY_PARTIDA.placar = DUMMY_PLACAR;
DUMMY_PARTIDA.slug = DUMMY_MATCH_SLUG;
DUMMY_PARTIDA.mandante = DUMMY_TEAM_1;
DUMMY_PARTIDA.visitante = DUMMY_TEAM_2;
