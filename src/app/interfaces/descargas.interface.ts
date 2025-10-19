import { Estado } from "./registros.interface";

export interface FdsResponse {
  ok: boolean;
  data: FdsDataResponse[]
}

export interface FdsDataResponse {
    materia_id: number,
    nombre_producto: string,
    razonSocial:string,
    FDS_fecha: Date,
    fds: string,
    extraname: string,
    apr_code: string,
    nombre_calidoc: string
}

export interface InsumoDescarga {
  id: string;
  codigoAprobacion?: string;
  idEncrypt?: string;     // <— NUEVO (opcional)
  nombreInterno?: string;
  producto: string;
  fabricante: string;
  fechaFds: string;         // yyyy-mm-dd
  estado: Estado;           // todo lo que viene ahora es 'aprobado' por tu query
  fdsFile?: string;         // nombre de archivo FDS
  calidadDoc?: string | null;
}
