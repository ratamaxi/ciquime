export interface EstadisticasInsumosData {
  aprobados: number;
  pendientes: number;
  rechazados: number;
}

export interface BuscarInsumoQuery {
insumo?: string;
  fabricante?: string;
  limit?: number;
  offset?: number;
  sortKey?: 'producto' | 'fabricante' | 'revFDS' | 'fechaFDS' | 'empid';
  sortDir?: 'asc' | 'desc';
}

export interface BuscarInsumoResponseItem {
  Nfile_name: string;
  id: number;
  matid: number;
  empid: number;
  nombre_producto: string;
  fabricante: string;
  revisionFDS: string;
  fecha_insert: string; // ISO
  fdsUrl?: string;      // opcional desde el back
}

/** UI = todos los campos del back + alias requeridos para la vista */
export interface BuscarInsumoUI extends BuscarInsumoResponseItem {
  producto: string;
  revFDS: string;
  fechaFDS: string;
}

export interface InsertResponse {
  ok: boolean;
  msj: string;
  insertedCount?: number;
  firstInsertId?: number;
  id_empresa?: number;
  usuario_id?: number;
  materia_ids?: number[];
  detail?: string;
}

export interface CrearSgaResp {
  ok: boolean;
  id: number;
  name_fds: string;
  dir_fds: string;
}

export interface CrearInsumoResp {
  ok: boolean;
  id: number;
  name_fds: string;
  dir_fds: string;
}

export interface Insumo {
  id: string;
  codigoAprobacion?: string;
  nombreInterno?: string;
  producto: string;
  nombreCalidoc?: string;
  fds?:string,
  fabricante: string;
  fechaFds: string; // ISO (yyyy-mm-dd) para simplificar
  estado: Estado;
}

export type Estado = 'APROBADO' | 'RECHAZADO' | 'PENDIENTE';

export interface ApiInsumo {
  extraname: string;
  presentacion: string;
  requiere: string;
  nombre_calidoc: string;
  fechacalidad: string | null;
  aviso: number | null;
  sector: string;
  lote: string;
  estado: string; // APROBADO | PENDIENTE | RECHAZADO
  nota: string;
  nota_adm: string;
  apr_code: string;
  api: string | null; // "A" | "B" | "C" | "D" | "0" | null
  actualizado: string;
}

export interface ApiProducto {
  nombre_producto: string;
  RNPQ: 'SI' | 'NO';
  fabricante: string;
}

export interface ApiResp {
  ok: boolean;
  msj: string;
  insumo: ApiInsumo;
  producto: ApiProducto | null;
  keys: { matempresa: string; empresa_id: string; usuario_id: string };
}

export interface SectorInsumoResponse {
  ok: boolean,
  data: SectorInsumoResponseData[]
}

export interface SectorInsumoResponseData {
  emps: string
}

export interface EditarInsumoRequest {
    materia_id: string,
    extraname: string,
    presentacion: string,
    sector: string,
    lote: string,
    nota: string,
}

export interface AgregarInsumoAUsuario {
      materia: string,
      empresa: string,
      usuario: string
}

export interface EstadisticasInsumosData {
  aprobados: number;
  pendientes: number;
  rechazados: number;
}

export type Clave = keyof EstadisticasInsumosData;

export interface IpelResponse {
  ok: boolean;
  rango_p: number | null;
  descripcion_p: string | null;
  src: string;
  frases: string[];
}
