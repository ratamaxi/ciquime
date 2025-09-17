import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface NfpaFicha {
  productName: string;
  supplier: string;
  dataSource: string; // ej: "FDS Proveedor"
  transportClass: string; // ej: "3"
  nfpa: {
    salud: number | string;
    inflamabilidad: number | string;
    reactividad: number | string;
    otros: string; // guiones o notas
  };
  transporte: {
    codigoRiesgo: string | number;
    numeroONU: string | number;
    grupoEmbalaje: string;
  };
  fetDocs: Array<{ label: string; href?: string }>; // ej: A, B
}

@Component({
  selector: 'app-tabla-nfpa',
  templateUrl: './tabla-nfpa.component.html',
  styleUrls: ['./tabla-nfpa.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TablaNfpaComponent {
  @Input() ficha: NfpaFicha = {
    productName: '1,4-DIOXANO',
    supplier: 'MERCK S.A.',
    dataSource: 'FDS Proveedor',
    transportClass: '3',
    nfpa: {
      salud: 2,
      inflamabilidad: 3,
      reactividad: 0,
      otros: '-',
    },
    transporte: {
      codigoRiesgo: '33',
      numeroONU: '1165',
      grupoEmbalaje: 'II',
    },
    fetDocs: [{ label: 'A' }, { label: 'B' }],
  };

  onOpenFET(doc: { label: string; href?: string }) {
    if (doc.href) window.open(doc.href, '_blank');
  }
}
