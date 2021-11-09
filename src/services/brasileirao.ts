// import Time from "../models/Time";
// import Jogo from "../models/Jogo";
// import Rodada from "../models/Rodada";

// import APIBrasileirao from "../clients/brasileirao";

// import { APITime } from "../@types/api/brasileirao";

// import JSONTimesRepository from "../repositories/JSONTimesRepository";
// import JSONRodadasRepository from "../repositories/JSONrodadasRepository";

// export default class JSONBrasileirao {
//   public async gerarTimes(): Promise<void> {
//     const api = new APIBrasileirao();

//     const tabela = await api.buscarTabela();

//     const times = tabela.map((posicao) => {
//       const {
//         time: { time_id, nome_popular, sigla, escudo },
//       } = posicao;

//       return new Time(time_id, nome_popular, sigla, escudo);
//     });

//     const repository = new JSONTimesRepository();

//     await repository.save(times);

//     console.log("Times gerados com sucesso!");
//   }

//   public async gerarRodadas(): Promise<void> {
//     const repository = new JSONRodadasRepository();
//     const api = new APIBrasileirao();

//     const rodadasIndex = await api.buscarRodadas();

//     const detalhesRodadas = await Promise.all(
//       rodadasIndex.map(({ rodada }) => api.buscarDetalhesRodada(rodada))
//     );

//     const rodadas = detalhesRodadas.map(
//       ({ partidas, rodada: numeroRodada }) => {
//         const jogos = partidas.map(
//           ({
//             time_mandante,
//             time_visitante,
//             data_realizacao_iso,
//             placar_mandante,
//             placar_visitante,
//             placar,
//           }) => {
//             function instanciarTime(api_time: APITime) {
//               return new Time(
//                 api_time.time_id,
//                 api_time.nome_popular,
//                 api_time.sigla,
//                 api_time.escudo
//               );
//             }

//             const mandante = instanciarTime(time_mandante);
//             const visitante = instanciarTime(time_visitante);

//             return new Jogo(
//               mandante,
//               visitante,
//               data_realizacao_iso,
//               placar_mandante,
//               placar_visitante,
//               placar
//             );
//           }
//         );

//         return new Rodada(numeroRodada, jogos);
//       }
//     );

//     await repository.save(rodadas);

//     console.log("Rodadas geradas com sucesso!");
//   }

//   public async getRodada(numeroRodada: number): Promise<Rodada> {
//     // Atualiza placar
//     await this.gerarRodadas();

//     // Busca rodada
//     const repository = new JSONRodadasRepository();

//     const rodada = await repository.findByNumeroRodada(numeroRodada);

//     return rodada;
//   }
// }
