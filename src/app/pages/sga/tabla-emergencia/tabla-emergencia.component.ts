import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface EmergenciaFicha {
  productName: string;
  supplier: string;

  // Sección BRIGADA
  mediosApropiados: string;        // Medios de Extinción Apropiados
  mediosNoApropiados: string;      // Medios de Extinción NO Apropiados
  incendio: string;                // Indicaciones para Incendio
  derrames: string;                // Indicaciones para Derrames
}

@Component({
  selector: 'app-tabla-emergencia',
  templateUrl: './tabla-emergencia.component.html',
  styleUrls: ['./tabla-emergencia.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TablaEmergenciaComponent {
  @Input() ficha!: EmergenciaFicha;

}
