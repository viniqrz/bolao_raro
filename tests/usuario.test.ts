import JSONUsuariosRepository from "../src/repositories/JSONUsuariosRepository";
import UsuarioService from "../src/services/usuario-service";
import Usuario from "../src/models/Usuario";

const DUMMY_NAME = "fulano";
const DUMMY_EMAIL = "fulano@gmail.com";
const DUMMY_PASSWORD = "12345";

describe("UsuarioService layer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("01 - Cadastro de Usuário", () => {
    test("Cadastra usuário e recebe hash da senha", async () => {
      jest
        .spyOn(JSONUsuariosRepository.prototype, "findByEmail")
        .mockResolvedValue(null);

      jest
        .spyOn(JSONUsuariosRepository.prototype, "save")
        .mockResolvedValue(null);

      const usuarioService = new UsuarioService();

      const credenciais = {
        nome: DUMMY_NAME,
        email: DUMMY_EMAIL,
        senha: DUMMY_PASSWORD,
      };

      const result = await usuarioService.create(credenciais);

      expect(result.getSenha().length).toBe(60);
    });

    test("Rejeita cadastro com email de formato inválido", async () => {
      const usuarioService = new UsuarioService();

      const credenciais = {
        nome: DUMMY_NAME,
        email: DUMMY_EMAIL.slice(0, 1),
        senha: DUMMY_PASSWORD,
      };

      await expect(async () => {
        await usuarioService.create(credenciais);
      }).rejects.toThrow();
    });

    test("Rejeita cadastro com email já utilizado", async () => {
      jest
        .spyOn(JSONUsuariosRepository.prototype, "findByEmail")
        .mockResolvedValue(
          new Usuario(DUMMY_NAME, DUMMY_EMAIL, DUMMY_PASSWORD, false)
        );

      const usuarioService = new UsuarioService();

      const credenciais = {
        nome: DUMMY_NAME,
        email: DUMMY_EMAIL,
        senha: DUMMY_PASSWORD,
      };

      await expect(async () => {
        await usuarioService.create(credenciais);
      }).rejects.toThrow();
    });
  });

  describe("02 - Login de Usuário", () => {
    test("Nao deve logar com email incorreto", async () => {
      jest
        .spyOn(JSONUsuariosRepository.prototype, "findByEmail")
        .mockResolvedValue(undefined);

      const usuarioService = new UsuarioService();

      await expect(async () => {
        await usuarioService.login(DUMMY_EMAIL, DUMMY_PASSWORD);
      }).rejects.toThrow();
    });

    test("Nao deve logar com senha incorreta", async () => {
      const usuario = new Usuario(
        DUMMY_NAME,
        DUMMY_EMAIL,
        DUMMY_PASSWORD,
        false
      );

      jest
        .spyOn(JSONUsuariosRepository.prototype, "findByEmail")
        .mockResolvedValue(usuario);

      const usuarioService = new UsuarioService();

      await expect(async () => {
        await usuarioService.login(DUMMY_EMAIL, "wrongpassword");
      }).rejects.toThrow();
    });
  });

  describe("03 - Atualização do Cadastro de Usuário", () => {
    test("Nao deve atualizar com email incorreto", async () => {
      jest
        .spyOn(JSONUsuariosRepository.prototype, "findByEmail")
        .mockResolvedValue(undefined);

      const usuarioService = new UsuarioService();

      const credenciais = {
        nome: DUMMY_NAME,
        email: DUMMY_EMAIL.slice(2, DUMMY_EMAIL.length - 1),
        senha: DUMMY_PASSWORD,
      };

      await expect(async () => {
        await usuarioService.update(credenciais);
      }).rejects.toThrow();
    });
  });

  describe("04 - Inativação do Cadastro de Usuário", () => {
    test("Deve inativar o usuário sem deleta-lo", async () => {
      const usuarioAtivo = new Usuario(
        DUMMY_NAME,
        DUMMY_EMAIL,
        DUMMY_PASSWORD,
        true
      );

      jest
        .spyOn(JSONUsuariosRepository.prototype, "findByEmail")
        .mockResolvedValue(usuarioAtivo);

      jest
        .spyOn(JSONUsuariosRepository.prototype, "update")
        .mockResolvedValue(null);

      const usuarioService = new UsuarioService();

      const novoCadastro = await usuarioService.inactivate(
        DUMMY_EMAIL,
        DUMMY_PASSWORD
      );

      expect(novoCadastro.getInativo()).toBe(true);
    });
  });
});
