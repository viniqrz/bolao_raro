import { PalpiteDTO } from "../../src/@types/dtos/palpiteDto";
import { Aposta } from "../../src/models/ApostaEntity";

import { DUMMY_PARTIDA } from "./partida";
import { DUMMY_RODADA } from "./rodada";

export const DUMMY_PALPITE: PalpiteDTO = {
  partidaId: 1,
  placarMandante: 2,
  placarVisitante: 1,
};

export const DUMMY_APOSTA = new Aposta();

DUMMY_APOSTA.id = 1;
DUMMY_APOSTA.placarMandante = 2;
DUMMY_APOSTA.placarVisitante = 2;
DUMMY_APOSTA.rodada = DUMMY_RODADA;
DUMMY_APOSTA.partida = DUMMY_PARTIDA;
