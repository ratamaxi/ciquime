import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ActividadItem {
  texto: string;
  fecha?: string;
  destacado?: boolean;
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
  @Input() items: ActividadItem[] = [];
  @Input() showVerMas = false;
  @Output() verMas = new EventEmitter<void>();

  trackByIdx(i: number) { return i; }
}
