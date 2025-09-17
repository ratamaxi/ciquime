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
@Input() ficha: EmergenciaFicha = {
    productName: '1,4-DIOXANO',
    supplier: 'MERCK S.A.',
    mediosApropiados:
      'Rocío de agua, polvo químico seco, CO₂ o espumas.',
    mediosNoApropiados:
      'Chorro de agua directo.',
    incendio:
      'MUY INFLAMABLE: puede encender fácilmente por calor, chispas o llamas. Los vapores pueden formar mezclas explosivas con el aire. Utilice Equipo de Respiración Autónoma (ERA) y ropa de protección para incendios estructurales. Los vapores pueden viajar a una fuente de encendido y regresar en llamas. Rocíe con agua los recipientes para mantenerlos fríos. Enfríe los contenedores con chorros de agua hasta mucho después de que el fuego se haya extinguido. Prevenga que el agua utilizada para el control de incendios o la dilución ingrese a cursos de agua, drenajes o manantiales.',
    derrames:
      'Utilice ERA y ropa de protección para incendios estructurales. Evitar el ingreso a alcantarillas. Contener el producto utilizando arena, vermiculita, tierra o material absorbente inerte y limpiar o lavar completamente la zona contaminada. Recoja el absorbente con pala y colóquelo en un recipiente apropiado rotulado como RESIDUO.',
  };
}
