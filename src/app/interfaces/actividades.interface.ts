export interface ActividadItem {
  texto: string;
  fecha?: string;
  destacado?: boolean;
}

type Estado = 'vigente' | 'vencido';

export interface CertificadoApi {
  usuario_id: number;
  producto: string;
  materia_id:number;
  extraname: string | null;
  fabricante: string;
  nombre_calidoc: string | null;
  nombre_calidoc2: string | null;
  fechacalidad: string;
  fechacalidad2: string;
  aviso: number;
  estado: Estado;
  diasRestantes: number;
}

export interface CertificadoCalidad {
  numeroInterno: string;
  producto: string;
  fabricante: string;
  certificado: string;
  certificado2: string;
  fechaExpedicion: string;
  fechaExpedicion2: string;
  materia_id:number;
  fechaExpiracion: string;
  estado: Estado;
  usuario_id: number;
  nombre_calidoc: string | null;
  nombre_calidoc2: string | null;
  fechacalidad: string;
  fechacalidad2: string;
  aviso: number;
  diasRestantes: number;
}

type EstadoCertificado = 'vigente' | 'vencido';

export interface CertificadoResumenItem {
  producto: string;
  certificado: string;
  fechaExpiracion: string;
  estado: EstadoCertificado;
}
