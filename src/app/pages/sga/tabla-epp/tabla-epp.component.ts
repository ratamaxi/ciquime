import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type EppIcon = 'gafas' | 'guantes' | 'respirador' | 'careta' | 'botas' | 'ropa'| 'auditiva';

export interface TablaEppFicha {
  productName: string;
  supplier: string;
  rnpq?: string; // opcional
  epp: any;
  componentes: Array<{ nombre: string; cas: string; porcentaje: string }>;
}

@Component({
  selector: 'app-tabla-epp',
  templateUrl: './tabla-epp.component.html',
  styleUrls: ['./tabla-epp.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TablaEppComponent {

  @Input() ficha: TablaEppFicha = {
    productName: '1,4-DIOXANO',
    supplier: 'MERCK S.A.',
    rnpq: '',
    epp: ['gafas', 'guantes', 'respirador'],
    componentes: [
      { nombre: '1,4-Dioxano', cas: '123-91-1', porcentaje: '100%' },
    ],
  };
}
