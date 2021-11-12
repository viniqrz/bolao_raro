import * as faker from "faker";

import { Usuario } from "../../src/models/UsuarioEntity";

export const DUMMY_NAME = faker.name.firstName();
export const DUMMY_EMAIL = faker.internet.email();
export const DUMMY_AVATAR = faker.internet.avatar();
export const DUMMY_PASSWORD = faker.internet.password();

export const DUMMY_USER = new Usuario();

DUMMY_USER.nome = DUMMY_NAME;
DUMMY_USER.email = DUMMY_EMAIL;
DUMMY_USER.id = 1212121212121212;
DUMMY_USER.senha = DUMMY_PASSWORD;
DUMMY_USER.avatarUrl = DUMMY_AVATAR;
