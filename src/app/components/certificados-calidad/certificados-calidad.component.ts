import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type Estado = 'vigente' | 'vencido';

interface CertificadoCalidad {
  numeroInterno: string;
  producto: string;
  fabricante: string;
  certificado: string;
  fechaExpedicion: string;
  fechaExpiracion: string;
  estado: Estado;
}

@Component({
  selector: 'app-certificados-calidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificados-calidad.component.html',
  styleUrls: ['./certificados-calidad.component.scss'],
})
export class CertificadosCalidadComponent {
  registros: CertificadoCalidad[] = [
    {
      numeroInterno: '0001',
      producto: '1,4-DIOXANO',
      fabricante: 'MERCK S.A.',
      certificado: 'AFVT_RNPUD 05204/78-21-12-2025.pdf',
      fechaExpedicion: '2024-12-21',
      fechaExpiracion: '2025-12-21',
      estado: 'vigente',
    },
    {
      numeroInterno: '0002',
      producto: '1-HEPTANOL',
      fabricante: 'SOMAR ANDINA S.A.',
      certificado: 'AFVT_RNPUD 05205/78-19-11-2025.pdf',
      fechaExpedicion: '2024-11-19',
      fechaExpiracion: '2025-11-19',
      estado: 'vigente',
    },
    {
      numeroInterno: '0003',
      producto: 'Ácido Nítrico 65%',
      fabricante: 'AROMINA DEL SUR S.A.',
      certificado: 'AFVT_RNPUD 05206/78-05-10-2024.pdf',
      fechaExpedicion: '2023-10-05',
      fechaExpiracion: '2024-10-05',
      estado: 'vencido',
    },
    {
      numeroInterno: '0004',
      producto: 'Diisobutil Ftalato',
      fabricante: 'MERCK S.A.',
      certificado: 'AFVT_RNPUD 05207/78-14-08-2025.pdf',
      fechaExpedicion: '2024-08-14',
      fechaExpiracion: '2025-08-14',
      estado: 'vigente',
    },
    {
      numeroInterno: '0005',
      producto: 'Agar de contacto (CASO) + TTC (RF2)',
      fabricante: 'AROMINA DEL SUR S.A.',
      certificado: 'AFVT_RNPUD 05208/78-28-07-2025.pdf',
      fechaExpedicion: '2024-07-28',
      fechaExpiracion: '2025-07-28',
      estado: 'vigente',
    },
    {
      numeroInterno: '0006',
      producto: 'Propylene Glycol',
      fabricante: 'MERCK S.A.',
      certificado: 'AFVT_RNPUD 05209/78-14-02-2025.pdf',
      fechaExpedicion: '2024-02-14',
      fechaExpiracion: '2025-02-14',
      estado: 'vigente',
    },
    {
      numeroInterno: '0007',
      producto: 'Tergazyme® Enzyme Detergent',
      fabricante: 'SOMAR ANDINA S.A.',
      certificado: 'AFVT_RNPUD 05210/78-18-03-2024.pdf',
      fechaExpedicion: '2023-03-18',
      fechaExpiracion: '2024-03-18',
      estado: 'vencido',
    },
    {
      numeroInterno: '0008',
      producto: 'HEPES Free, pH 7.0',
      fabricante: 'MERCK S.A.',
      certificado: 'AFVT_RNPUD 05211/78-01-01-2026.pdf',
      fechaExpedicion: '2025-01-01',
      fechaExpiracion: '2026-01-01',
      estado: 'vigente',
    },
  ];

  page = 1;
  pageSize = 8;

  get totalRegistros(): number {
    return this.registros.length;
  }

  get vigentes(): number {
    return this.registros.filter((r) => r.estado === 'vigente').length;
  }

  get vencidos(): number {
    return this.registros.filter((r) => r.estado === 'vencido').length;
  }

  trackByNumero(_index: number, item: CertificadoCalidad): string {
    return item.numeroInterno;
  }
}
