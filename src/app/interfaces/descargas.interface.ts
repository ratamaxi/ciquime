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

export interface SgaPeligroApi {
  ok: boolean;
  data: {
    header: {
      nombre_producto: string;
      razonSocial: string;
      iPel: number;
      iPelDescripcion: string;
    };
    pictogramas: string[];            // ej: ["GHS00", "GHS02"]
    palabra_advertencia: string;      // ej: "PELIGRO" o "SIN PALABRA DE ADVERTENCIA"
    frasesH: Array<{ frase: string; espaniol: string }>;
    consejosPrudencia: Array<{ frase: string; espaniol: string }>;
  };
}

export interface TratamientoFicha {
  productName?: string;
  titulo: string;            // viene como "tratamiento"
  medidasGenerales: string;  // medidas_generales
  contactoOjos: string;      // contacto_ojos
  contactoPiel: string;      // contacto_piel
  inhalacion: string;        // inhalacion
  ingestion: string;         // ingestion
  notaMedico: string;        // nota_medico
}

export interface EmergenciaFicha {
  productName?: string;       // opcional
  supplier?: string;          // opcional
  mediosApropiados: string;
  mediosNoApropiados: string;
  incendio: string;
  derrames: string;
}

export interface AlmacenamientoFicha {
  productName: string;
  supplier: string;
  tipoProducto: string;
  caracteristicasDeposito: string;
  condicionesOperacion: string;
  disposicionesParticulares: string;
  disposicionesAlmacenamiento: string;
  incompatibleCon: string[];
}

export interface NfpaTransporteFicha {
  productName: string;   // header.nombre_producto
  supplier: string;      // header.razonSocial
  fuente: string;        // header.fuente
  nfpa: {
    salud: number | string;
    inflamabilidad: number | string;
    reactividad: number | string;
    otros: string;
  };
  transporte: {
    codRiesgo: string;       // transporte.cod_riesgo
    nroOnu: string;          // transporte.nro_onu
    grupoEmbalaje: string;   // transporte.grupo_embalaje
    clasImg: string;         // transporte.clas_img
    guia: string;            // transporte.guia
  };
}

// Ejemplo (ajustá si ya lo definiste en otro archivo)
export type EppIcon = 'gafas' | 'guantes' | 'respirador' | 'proteccion_auditiva' | 'proteccion_facial' | 'ropa' | 'botas';

export interface TablaEppFicha {
  productName: string;
  supplier: string;
  rnpq: string | null;
  epp: EppIcon[];
  componentes: Array<{ nombre: string; cas: string; porcentaje: string }>;
}

// Lo que devuelve tu back para Peligros
export interface SgaPeligroApi {
  ok: boolean;
  data: {
    header: {
      nombre_producto: string;
      razonSocial: string;
      iPel: number;
      iPelDescripcion: string;
    };
    pictogramas: string[];            // ej: ["GHS07", "GHS02"]
    palabra_advertencia: string;      // ej: "ATENCION"
    frasesH: Array<{ frase: string; espaniol: string }>;
    consejosPrudencia: Array<{ frase: string; espaniol: string }>;
  };
}

// Lo que espera el hijo <app-tabla-peligro>
export interface SgaFicha {
  productName: string;
  supplier: string;
  displayVisibility: string;      // no viene del back (dejalo vacío)
  dataSource: string;              // no viene del back (dejalo vacío)
  pictograms: string[];            // nombres UI: 'llama' | 'exclamacion' | 'peligro-salud'
  signalWord: string;
  hazardStatements: string[];      // textos en español
  precautionaryStatements: string[]; // textos en español
}

export type EstadoCertificado = 'vigente' | 'vencido';

export type EstadoRegistroCertificado = 'APROBADO' | 'EN PROCESO' | 'OBSERVADO';

export interface DocumentoCalidad {
  id: string;
  nombre: string;
  vencimiento: string | null;
}

export interface CertificadoCalidad {
  numeroInterno: string;
  producto: string;
  fabricante: string;
  certificado: string;
  fechaExpedicion: string;
  fechaExpiracion: string;
  estado: EstadoCertificado;
  numeroOriginal?: string;
  estadoRegistro?: EstadoRegistroCertificado;
  aniosDeposito?: number;
  certificadoPorDocumento?: boolean;
  vencimientoCertificado?: string | null;
  documentos?: DocumentoCalidad[];
}

