import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type EstadoCertificado = 'vigente' | 'vencido';

export interface CertificadoResumenItem {
  producto: string;
  certificado: string;
  fechaExpiracion: string;
  estado: EstadoCertificado;
}

@Component({
  selector: 'app-certificados-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificados-resumen.component.html',
  styleUrls: ['./certificados-resumen.component.scss'],
})
export class CertificadosResumenComponent {
  /** Título mostrado en la tarjeta */
  @Input() titulo = 'Certificados a vencer';

  /** Listado de certificados */
  @Input() certificados: CertificadoResumenItem[] = [];

  /** Máximo de filas a mostrar (por defecto 4) */
  @Input() limite = 4;

  get resumenVigentes(): number {
    return (this.certificados ?? []).filter((c) => this.esVigente(c)).length;
  }

  get resumenVencidos(): number {
    return (this.certificados ?? []).filter((c) => this.esVencido(c)).length;
  }

  get certificadosFiltrados(): CertificadoResumenItem[] {
    return (this.certificados ?? []).slice(0, this.limite);
  }

  esVigente(c: CertificadoResumenItem): boolean {
    return c.estado.toLowerCase() === 'vigente';
  }

  esVencido(c: CertificadoResumenItem): boolean {
    return c.estado.toLowerCase() === 'vencido';
  }

  trackByCertificado(_index: number, item: CertificadoResumenItem): string {
    return `${item.producto}-${item.certificado}-${item.fechaExpiracion}`;
  }
}
