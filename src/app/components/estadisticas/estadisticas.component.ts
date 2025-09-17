import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface EstadisticasInsumosData {
  aprobados: number;
  pendientes: number;
  rechazados: number;
}

type Clave = keyof EstadisticasInsumosData;

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EstadisticasComponent {
/** Título de la card */
  @Input() titulo = 'Estadísticas de insumos';

  /** Datos de conteo */
  @Input() data: EstadisticasInsumosData = { aprobados: 0, pendientes: 0, rechazados: 0 };

  /**
   * Qué filas muestran barra de progreso.
   * Por defecto: solo Aprobados y Pendientes (como en tu mock).
   * Si querés todas: ['aprobados','pendientes','rechazados']
   */
  @Input() mostrarBarras: Clave[] = ['aprobados', 'pendientes'];

  get total(): number {
    const { aprobados, pendientes, rechazados } = this.data || { aprobados: 0, pendientes: 0, rechazados: 0 };
    return (aprobados || 0) + (pendientes || 0) + (rechazados || 0);
  }

  /** Porcentaje entero seguro (0–100) */
  pct(k: Clave): number {
    const t = this.total || 0;
    const v = (this.data?.[k] ?? 0);
    if (!t || t <= 0) return 0;
    const p = Math.round((v / t) * 100);
    return Math.max(0, Math.min(100, p));
  }

  tieneBarra(k: Clave) {
    return this.mostrarBarras.includes(k);
  }
}
