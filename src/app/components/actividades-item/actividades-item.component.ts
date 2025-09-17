import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ActividadItem {
  texto: string;
  fecha?: string;      // opcional, por si querés mostrar fecha
  destacado?: boolean; // opcional, para resaltar una fila
}


@Component({
  selector: 'app-actividades-item',
  templateUrl: './actividades-item.component.html',
  styleUrls: ['./actividades-item.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class ActividadesItemComponent {
  @Input() titulo = 'Últimas actividades';
  @Input() items: ActividadItem[] = [
    { texto: 'Cambio de normas YPF' },
    { texto: 'Rechazo normativa' },
    { texto: 'Cambio de estado, Pendiente' },
    { texto: 'Cambio de estado, Pendiente' },
    { texto: 'Aceptacion norma' },
    { texto: 'Cambio de normas YPF' },
  ];

  /** Si querés un botón "Ver más..." al pie */
  @Input() showVerMas = false;
  @Output() verMas = new EventEmitter<void>();

  trackByIdx(i: number) { return i; }
}
