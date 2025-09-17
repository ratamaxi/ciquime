import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type EstadoRegistro = 'aceptado' | 'rechazado' | 'pendiente';

export interface Registro {
  codigo?: string | null;
  nombreInterno?: string | null;
  producto: string;
  fabricante: string;
  estado: EstadoRegistro;
}

@Component({
  selector: 'app-tabla-home',
  templateUrl: './tabla-home.component.html',
  styleUrls: ['./tabla-home.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TablaHomeComponent {
 /** Título del bloque */
  @Input() titulo = 'Últimos registros aprobados';

  /** Registros a mostrar */
  @Input() registros: Registro[] = [
    // Ejemplo (podés borrar estos mocks)
    { codigo: '', nombreInterno: '', producto: 'Propylene Glycol', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', estado: 'aceptado' },
    { codigo: '', nombreInterno: '', producto: '1,4-DIOXANO', fabricante: 'MERCK S.A.', estado: 'rechazado' },
    { codigo: '', nombreInterno: '', producto: 'HEPES, Free Acid, ULTROL Grade', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', estado: 'pendiente' },
    { codigo: '', nombreInterno: '', producto: 'Agar de contacto CASO + LT - ICR+ (821)', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', estado: 'pendiente' },
    { codigo: '', nombreInterno: '', producto: 'Silica fumed', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', estado: 'aceptado' },
  ];

  /** Evento del botón “Ver Más…” */
  @Output() verMas = new EventEmitter<void>();

  /** Filtro activo (clic en los chips) */
  activeFilter: 'todos' | EstadoRegistro = 'todos';

  /** Registros filtrados según chip seleccionado */
  get filtered(): Registro[] {
    if (this.activeFilter === 'todos') return this.registros ?? [];
    return (this.registros ?? []).filter(r => r.estado === this.activeFilter);
  }

  /** Conteos por estado (para mostrar en chips si querés) */
  get counts() {
    const base = { aceptado: 0, rechazado: 0, pendiente: 0 };
    for (const r of (this.registros ?? [])) base[r.estado]++;
    return base;
  }

  setFilter(f: 'todos' | EstadoRegistro) {
    this.activeFilter = f;
  }

  trackByRow(_i: number, row: Registro) {
    return `${row.codigo ?? ''}-${row.producto}-${row.fabricante}-${row.estado}`;
  }
}
