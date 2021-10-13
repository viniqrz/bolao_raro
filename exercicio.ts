// EXEMPLO DE USO => logar um usuário, salvar suas apostas e imprimir um log confirmando a aposta feita
// log será uma lista de cada aposta no formato abaixo

import crypto from "crypto";

import Usuario from "./src/models/Usuario";
import Time from "./src/models/Time";
import Jogo from "./src/models/Jogo";
import Rodada from "./src/models/Rodada";
import ApostaRodada from "./src/models/ApostaRodada";
import ApostaJogo, { Palpite } from "./src/models/ApostaJogo";

import JSONApostaRodadasRepository from "./src/repositories/JSONApostaRodadasRepository";
import JSONRodadasRepository from "./src/repositories/JSONRodadasRepository";
import JSONTimesRepository from "./src/repositories/JSONTimesRepository";
import JSONUsuariosRepository from "./src/repositories/JSONUsuariosRepository";

// NOME_TIME_MANDANTE GOLS_MANDANTE x GOLS_VISITANTE NOME_TIME_VISITANTE
const usuariosRepository = new JSONUsuariosRepository();
const timesRepository = new JSONTimesRepository();
const rodadaRepository = new JSONRodadasRepository();
const apostaRodadaRepository = new JSONApostaRodadasRepository();

type Login = {
  email: string;
  senha: string;
};

function hash(senha: string): string {
  const secret = "secret_bem_incomum_da_galera_montar_tabelas";
  return crypto.createHmac("sha256", secret).update(senha).digest("hex");
}

function getRodadaByPalpites(
  usuario: Usuario,
  rodada: Rodada,
  palpites: Palpite[]
): ApostaRodada {
  // @todo implementar a construção da ApostaRodada de maneira adequada /
  // exercicios da semana 2 teve um exemplo na revisão feita na semana 3)

  const apostasJogo = palpites.map(
    ({ jogoId, golsMandante, golsVisitante }) => {
      const jogo = Jogo.getLista().find((j) => j.getId() === jogoId);

      return new ApostaJogo(usuario, jogo, golsMandante, golsVisitante);
    }
  );

  return new ApostaRodada(usuario, rodada, apostasJogo);
}

function getMensagemAposta(apostaRodada: ApostaRodada): string {
  // NOME_TIME_MANDANTE GOLS_MANDANTE x GOLS_VISITANTE NOME_TIME_VISITANTE
  // retornar conforme o formato detalhado acima, separando cada jogo com uma nova linha

  // console.log(apostaRodada.getApostasJogos()[0].getJogo());

  return apostaRodada
    .getApostasJogos()
    .map((apostaJogo) => {
      const mandante = apostaJogo.getJogo().getMandante().getNome();
      const visitante = apostaJogo.getJogo().getVisitante().getNome();

      apostaJogo.atualizaPontuacao();

      const golsMandante = apostaJogo.getGolsMandante();
      const golsVisitante = apostaJogo.getGolsVisitante();

      const placarMandante = `${mandante} ${golsMandante}`;
      const placarVisitante = `${visitante} ${golsVisitante}`;

      const leftPad = Array(25 - placarMandante.length).join(" ");
      const rightPad = Array(25 - placarVisitante.length).join(" ");

      return `${mandante} ${leftPad} ${golsMandante} X ${golsVisitante} ${rightPad} ${visitante}\n`;
    })
    .join("");
}

async function teste(login: Login, numeroRodada: number, palpites: Palpite[]) {
  // login
  const usuario = await usuariosRepository.findByEmail(login.email);

  if (usuario.getSenha() !== hash(login.senha)) {
    throw "Login invalido";
  }

  // lista os jogos de uma rodada especifica
  const rodada = await rodadaRepository.findByNumeroRodada(numeroRodada);

  // listar times para fazer join com os dados das rodadas
  const times = await timesRepository.findAll();

  // constroí objeto com as apostas do jogador.
  const apostaRodada = getRodadaByPalpites(usuario, rodada, palpites);
  await apostaRodadaRepository.save(apostaRodada);

  console.log(getMensagemAposta(apostaRodada));
}

// cria rodada 19
void timesRepository.findAll().then((times) => {
  const mandantes = times.slice(0, 10);
  const visitantes = times.slice(10, times.length);

  const jogos = mandantes.map(
    (_m, i) =>
      new Jogo(
        mandantes[i],
        visitantes[i],
        new Date(new Date().getTime() + 10 * 86400000)
      )
  );

  const rodada19 = new Rodada(19, jogos);

  void rodadaRepository.save([rodada19]);
});

// apostar nos jogos de um rodada especifica
const palpites: Palpite[] = Array(10)
  .fill("")
  .map((_, i) => ({
    jogoId: i,
    golsMandante: 2,
    golsVisitante: 1,
  }));

teste({ email: "coleta@rarolabs.com.br", senha: "123456" }, 19, palpites)
  .then(() => console.log("Finalizado com sucesso"))
  .catch((error) => console.log("Ocorreu um erro", error));
