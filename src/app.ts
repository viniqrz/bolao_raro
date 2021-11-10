import "reflect-metadata";
import "dotenv/config";

import { createConnection } from "typeorm";

import { serviceFactory } from "./helpers/serviceFactory";

export const start = async () => {
  try {
    const connection = await createConnection();
    console.log("banco de dados conectado com sucesso.");

    // console.log(connection);

    // console.log(
    //   await new UsuarioService(usuarioRepository).update("sherlock@gmail.com", {
    //     nome: "Sherlock Jr",
    //     email: "sherlock27@gmail.com",
    //     senha: "12345",
    //     avatarUrl: "https://google.com/image",
    //   })
    // );

    // console.log(
    //   await new CampeonatoService(campeonatoRepository).create({
    //     nome: "Campeonato",
    //     slug: "campeonato",
    //     nomePopular: "Campeonato Teste",
    //     status: "em andamento",
    //     logo: "https://logoimage.com",
    //     idCampeonatoApiExterna: 999,
    //   })
    // );

    // const client = new APIBrasileirao();

    // console.log(
    //   await new TimeService(timeRepository, client).updateAllFromApi(10)
    // );

    // console.log(
    //   await new CampeonatoService(campeonatoRepository).updateAllResults()
    // );

    // await new CampeonatoService(campeonatoRepository).updateAllResults();

    // console.log(
    //   await new CampeonatoService(campeonatoRepository).updateResults()
    // );

    await serviceFactory.campeonato().updateAllResultsFromApi();

    console.log("done");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

void start();
