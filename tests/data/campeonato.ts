import * as faker from "faker";

import { CampeonatoDTO } from "../../src/@types/dtos/campeonatoDto";
import { Campeonato } from "../../src/models/CampeonatoEntity";

// ------------------ CAMPEONATO DATA ------------------------- //
const DUMMY_NAME = "Campeonato Teste";
const DUMMY_SLUG = "campeonato-teste";
const DUMMY_POPULAR_NAME = "Tripa Oska Cup";
const DUMMY_STATUS = "em andamento";
const DUMMY_LOGO = faker.image.sports(120, 120);
const DUMMY_API_ID = Math.round(Math.random() * 100);

export const DUMMY_DATA: CampeonatoDTO = {
  nome: DUMMY_NAME,
  slug: DUMMY_SLUG,
  nomePopular: DUMMY_POPULAR_NAME,
  status: DUMMY_STATUS,
  logo: DUMMY_LOGO,
  idCampeonatoApiExterna: DUMMY_API_ID,
};

export const DUMMY_CAMPEONATO = new Campeonato();

const campeonatoKeys = Object.keys(DUMMY_DATA);
campeonatoKeys.forEach((k) => {
  DUMMY_CAMPEONATO[k] = DUMMY_DATA[k] as Array<keyof typeof DUMMY_DATA>;
});
