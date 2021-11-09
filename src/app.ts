import { createConnection, getCustomRepository } from "typeorm";
import "reflect-metadata";

import "dotenv/config";

import { UsuarioService } from "./services/UsuarioService";
import { CampeonatoService } from "./services/CampeonatoService";
import { UsuarioRepository } from "./repositories/UsuarioRepository";
import { CampeonatoRepository } from "./repositories/CampeonatoRepository";

export const start = async () => {
  try {
    const connection = await createConnection();
    console.log("banco de dados conectado com sucesso.");

    // console.log(connection);

    const usuarioRepository = getCustomRepository(UsuarioRepository);
    const campeonatoRepository = getCustomRepository(CampeonatoRepository);

    // console.log(
    //   await new UsuarioService(usuarioRepository).update("sherlock@gmail.com", {
    //     nome: "Sherlock Jr",
    //     email: "sherlock27@gmail.com",
    //     senha: "12345",
    //     avatarUrl: "https://google.com/image",
    //   })
    // );

    console.log(
      await new CampeonatoService(campeonatoRepository).create({
        nome: "Campeonato",
        slug: "campeonato",
        nomePopular: "Campeonato Teste",
        status: "em andamento",
        logo: "https://logoimage.com",
        idCampeonatoApiExterna: 999,
      })
    );

    // console.log(
    //   await new CampeonatoService(campeonatoRepository).updateResults()
    // );

    console.log("done");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

void start();
