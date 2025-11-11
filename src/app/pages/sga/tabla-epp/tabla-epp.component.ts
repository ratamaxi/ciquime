import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type EppIcon = 'gafas' | 'guantes' | 'respirador' | 'careta' | 'botas' | 'ropa'| 'auditiva';

export interface TablaEppFicha {
  productName: string;
  supplier: string;
  rnpq?: string | null;
  eppCode?: string | null;
  eppImg?: string | null;
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

  @Input() ficha!: TablaEppFicha;

}
