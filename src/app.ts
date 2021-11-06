import { createConnection } from "typeorm";
import "reflect-metadata";

import "dotenv/config";

export const start = async () => {
  try {
    const connection = await createConnection();
    console.log("banco de dados conectado com sucesso.");

    process.exit(0);
  } catch (error: unknown) {
    console.log("erro inesperado");
    process.exit(1);
  }
};

void start();
