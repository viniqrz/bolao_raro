import { HttpClient } from "../@types/infra/http/HttpClient";
import { Endereco } from "../@types/dtos/api/endereco";
import { CepNaoEncontrado } from "../@types/errors/CepNaoEncontrado";

export class EnderecoClient {
  private API_CEP = `${process.env.BASE_API_CEP}/[CEP]/json/`;
  constructor(private readonly httpClient: HttpClient) {}

  async buscaEnderecoPorCep(cep: string) {
    const url = this.API_CEP.replace("[CEP]", cep);
    const response = await this.httpClient.get<Endereco>(url);
    const endereco = response.data;
    if (!endereco.cep) {
      throw new CepNaoEncontrado();
    }

    return response.data;
  }
}
