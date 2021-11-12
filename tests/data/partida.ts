import { DUMMY_TEAM_1_DATA, DUMMY_TEAM_2_DATA } from "./time";
import { APIPartida } from "../../src/@types/api/brasileirao";
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

const partidaKeys = Object.keys(DUMMY_PARTIDA_DATA);

export const DUMMY_PARTIDA = new Partida();

partidaKeys.forEach((k) => {
  DUMMY_PARTIDA[k] = DUMMY_PARTIDA_DATA[k] as Array<
    keyof typeof DUMMY_PARTIDA_DATA
  >;
});
