
export interface UserData {
  alias: string;
  contrato: string;
  establecimiento_id: number;
  fabid: number;
  id_empresa: number;
  id_usuario: number;
  nombre: string;
  plan: string;
  rank: number;
  razonSocial: string;
  region: string;
  rol_id: number;
  vnro: any;
}

export interface EmpresaTercero {
  id: number;
  noemp: string;
}

export interface UsuarioApiData {
  id: number;
  nombre: string;
  mail: string;
  alias: string | null;
}

export interface UsuarioFormValue {
  nombre: string;
  alias: string;
  contrasena: string;
  correo: string;
}

