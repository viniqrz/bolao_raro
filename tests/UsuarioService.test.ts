import { UsuarioRepository } from "../src/repositories/UsuarioRepository";
import { UsuarioService } from "../src/services/UsuarioService";
import { Usuario } from "../src/models/UsuarioEntity";
import { compare, hash } from "bcrypt";
import { SaveOptions } from "typeorm";

import {
  DUMMY_USER,
  DUMMY_NAME,
  DUMMY_AVATAR,
  DUMMY_EMAIL,
  DUMMY_PASSWORD,
} from "./data/usuario";

describe("UsuarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const credenciais = {
    nome: DUMMY_NAME,
    email: DUMMY_EMAIL,
    senha: DUMMY_PASSWORD,
    avatarUrl: DUMMY_AVATAR,
  };

  describe("01 - Cadastro de Usuário", () => {
    test("Cadastra usuário com sucesso", async () => {
      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(null);

      jest
        .spyOn(UsuarioRepository.prototype, "save")
        .mockResolvedValue(DUMMY_USER);

      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      const result = await usuarioService.create(credenciais);

      expect(result.nome).toBe(DUMMY_NAME);
    });

    test("Rejeita cadastro com email de formato inválido", async () => {
      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      const altCredenciais = { ...credenciais, email: DUMMY_EMAIL.slice(0, 1) };

      await expect(async () => {
        await usuarioService.create(altCredenciais);
      }).rejects.toThrow();
    });

    test("Rejeita cadastro com email já utilizado", async () => {
      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(DUMMY_USER);

      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      await expect(async () => {
        await usuarioService.create(credenciais);
      }).rejects.toThrow();
    });
  });

  describe("02 - Login de Usuário", () => {
    test("Deve logar com sucesso e receber token JWT", async () => {
      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(DUMMY_USER);

      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (compare as jest.Mock) = bcryptCompare;

      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      const result = await usuarioService.authenticate(
        DUMMY_EMAIL,
        DUMMY_PASSWORD
      );

      const { senha, ...USER_WITHOUT_PASSWORD } = DUMMY_USER;

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");

      expect(result.user).toMatchObject(USER_WITHOUT_PASSWORD);
      expect(typeof result.token).toBe("string");
    });

    test("Nao deve logar com email não registrado", async () => {
      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(undefined);

      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      await expect(async () => {
        await usuarioService.authenticate(DUMMY_EMAIL, DUMMY_PASSWORD);
      }).rejects.toThrow();
    });

    test("Nao deve logar com senha incorreta", async () => {
      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(DUMMY_USER);

      const bcryptCompare = jest.fn().mockResolvedValue(false);
      (compare as jest.Mock) = bcryptCompare;

      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      await expect(async () => {
        await usuarioService.authenticate(DUMMY_EMAIL, "wrong-password");
      }).rejects.toThrow();
    });
  });

  describe("03 - Atualização do Cadastro de Usuário", () => {
    test("Deve atualizar senha e nome com email correto", async () => {
      // ---- Test Data
      const NEW_PASSWORD = "new-password";
      const NEW_HASHED_PASSWORD = "hashed-password";
      const NEW_NAME = "new-name";

      const DUMMY_NEW_USER = {
        ...DUMMY_USER,
        senha: NEW_PASSWORD,
        nome: NEW_NAME,
      };

      const { senha, ...USER_WITHOUT_PASSWORD } = DUMMY_NEW_USER;

      // ---- Mocks
      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(DUMMY_USER);

      jest
        .spyOn(UsuarioRepository.prototype, "save")
        .mockImplementationOnce(
          async (entity: Usuario, options?: SaveOptions) => {
            return entity;
          }
        );

      const bcryptCompare = jest.fn().mockResolvedValue(NEW_HASHED_PASSWORD);
      (hash as jest.Mock) = bcryptCompare;

      // ---- Service
      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);
      const result = await usuarioService.update(DUMMY_EMAIL, DUMMY_NEW_USER);

      // ---- Assertions
      expect(result.nome).toBe(NEW_NAME);
      expect(result).toMatchObject(USER_WITHOUT_PASSWORD);
    });

    test("Nao deve atualizar com email incorreto", async () => {
      const WRONG_EMAIL = DUMMY_EMAIL.slice(2, DUMMY_EMAIL.length - 1);

      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(undefined);

      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      await expect(async () => {
        await usuarioService.update(WRONG_EMAIL, credenciais);
      }).rejects.toThrow();
    });
  });

  describe("04 - Inativação do Cadastro de Usuário", () => {
    test("Deve inativar cadastro", async () => {
      // ---- Test Data
      const DUMMY_NEW_USER = {
        ...DUMMY_USER,
        ativo: false,
      };

      const { senha, ...NEW_USER_WITHOUT_PASSWORD } = DUMMY_NEW_USER;

      // ---- Mocks
      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(DUMMY_USER);

      jest
        .spyOn(UsuarioRepository.prototype, "save")
        .mockImplementationOnce(
          async (entity: Usuario, options?: SaveOptions) => {
            return entity;
          }
        );

      // ---- Service
      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);
      const result = await usuarioService.update(DUMMY_EMAIL, DUMMY_NEW_USER);

      // ---- Assertions
      expect(result.ativo).toBeFalsy();
      expect(result).toMatchObject(NEW_USER_WITHOUT_PASSWORD);
    });
  });

  describe("05 - Remoção de Usuário", () => {
    test("Deve deletar o usuário", async () => {
      const { senha, ...USER_WITHOUT_PASSWORD } = DUMMY_USER;

      jest
        .spyOn(UsuarioRepository.prototype, "findByEmail")
        .mockResolvedValue(DUMMY_USER);

      jest
        .spyOn(UsuarioRepository.prototype, "remove")
        .mockResolvedValue(DUMMY_USER);

      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (compare as jest.Mock) = bcryptCompare;

      const repository = new UsuarioRepository();
      const usuarioService = new UsuarioService(repository);

      const result = await usuarioService.delete(DUMMY_USER.email);

      expect(result).toMatchObject(USER_WITHOUT_PASSWORD);
    });
  });
});
