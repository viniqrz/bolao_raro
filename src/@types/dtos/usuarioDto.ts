export type UsuarioDTO = {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  avatarUrl: string;
  ativo?: boolean;
};

export type UsuarioCriadoDTO = {
  id?: number;
  nome: string;
  email: string;
  avatarUrl: string;
  ativo?: boolean;
};

export type UsuarioWithoutPassword = {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  avatarUrl: string;
  ativo?: boolean;
};

export type AlterarUsuarioDTO = {
  id?: number;
  nome?: string;
  email: string;
  senha?: string;
  avatarUrl?: string;
  ativo?: boolean;
};

export type UsuarioLogadoDTO = {
  user: UsuarioCriadoDTO;
  token: string;
};
