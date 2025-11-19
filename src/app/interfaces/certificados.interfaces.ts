export type Estado = 'vigente' | 'vencido';

export interface CertStateRaw {
  usuario_id?: number;
  producto?: string;
  extraname?: string | null;
  nombre_calidoc?: string | null;     // nombre PDF (back)
  nombre_calidoc2?: string | null;     // nombre PDF2 (back)
  fechacalidad?: string;              // fecha (back) -> la usamos como vencimiento del PDF #1
  fechacalidad2?: string;              // fecha (back) -> la usamos como vencimiento del PDF #1
  aviso?: number;                     // 30|60|90
  estado?: Estado;
  diasRestantes?: number;
  fabricante?: string | null;
  razonSocial?: string | null;
}

export interface CertStateUI {
  numeroInterno?: string;
  producto?: string;
  certificado?: string;
  certificado2?: string;
  fechaExpedicion?: string;
  fechaExpiracion?: string;
  estado?: Estado;
  fabricante?: string | null;
  supplier?: string | null;
}

export type CertState = CertStateRaw & CertStateUI;

export interface DocumentoForm {
  nombre: string;
  vencimiento: string; // YYYY-MM-DD
}

export type EstadoCertificado = 'vigente' | 'vencido';

export interface CertificadoResumenItem {
  producto: string;
  certificado: string;
  fechaExpiracion: string;
  estado: EstadoCertificado;
}

export interface CertificadoResumenItemResumen {
  producto: string;
  certificado: string;
  fechaExpiracion: string;
  estado: EstadoCertificado;
}
