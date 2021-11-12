import * as faker from "faker";

import { APITime, APIPosicaoTabela } from "../../src/@types/api/brasileirao";
import { Time } from "../../src/models/TimeEntity";

// ------------------ TEAM DATA ------------------------- //
const DUMMY_TEAM_1_ID = 1;
const DUMMY_TEAM_1_NAME = "Mandante";
const DUMMY_TEAM_1_SIGLA = "MDT";
const DUMMY_TEAM_1_ESCUDO = faker.image.sports(120, 120);

const DUMMY_TEAM_2_ID = 2;
const DUMMY_TEAM_2_NAME = "Visitante";
const DUMMY_TEAM_2_SIGLA = "VST";
const DUMMY_TEAM_2_ESCUDO = faker.image.sports(120, 120);

export const DUMMY_TEAM_1_DATA: APITime = {
  time_id: DUMMY_TEAM_1_ID,
  nome_popular: DUMMY_TEAM_1_NAME,
  sigla: DUMMY_TEAM_1_SIGLA,
  escudo: DUMMY_TEAM_1_ESCUDO,
};

export const DUMMY_TEAM_2_DATA: APITime = {
  time_id: DUMMY_TEAM_2_ID,
  nome_popular: DUMMY_TEAM_2_NAME,
  sigla: DUMMY_TEAM_2_SIGLA,
  escudo: DUMMY_TEAM_2_ESCUDO,
};

export const DUMMY_API_POSICAO_1: APIPosicaoTabela = {
  time: DUMMY_TEAM_1_DATA,
};

export const DUMMY_API_POSICAO_2: APIPosicaoTabela = {
  time: DUMMY_TEAM_2_DATA,
};

export const DUMMY_TEAM_1 = new Time();
export const DUMMY_TEAM_2 = new Time();

Object.keys(DUMMY_TEAM_1_DATA).forEach((k) => {
  if (k === "nome_popular") {
    DUMMY_TEAM_1.nome = DUMMY_TEAM_1_DATA[k];
  } else {
    DUMMY_TEAM_1[k] = DUMMY_TEAM_1_DATA[k] as Array<keyof typeof DUMMY_TEAM_1>;
  }
});

Object.keys(DUMMY_TEAM_2_DATA).forEach((k) => {
  if (k === "nome_popular") {
    DUMMY_TEAM_2.nome = DUMMY_TEAM_2_DATA[k];
  } else {
    DUMMY_TEAM_2[k] = DUMMY_TEAM_2_DATA[k] as Array<keyof typeof DUMMY_TEAM_1>;
  }
});
