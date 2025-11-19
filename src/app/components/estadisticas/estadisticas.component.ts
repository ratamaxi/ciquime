import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { Clave, EstadisticasInsumosData } from 'src/app/interfaces/registros.interface';
import { RegistrosService } from 'src/app/services/registros.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [RegistrosService]
})
export class EstadisticasComponent implements OnInit{
  @Input() titulo = 'Estadísticas de insumos';
  public data: EstadisticasInsumosData = { aprobados: 0, pendientes: 0, rechazados: 0 };

  /**
   * Qué filas muestran barra de progreso.
   * Por defecto: solo Aprobados y Pendientes (como en tu mock).
   * Si querés todas: ['aprobados','pendientes','rechazados']
   */
  @Input() mostrarBarras: Clave[] = ['aprobados', 'pendientes'];

  constructor(private registroService: RegistrosService, private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.userId$
      .pipe(
        take(1), // si solo querés cargar una vez
        switchMap((userId) => this.registroService.obtenerEstadisticaInsumo(userId))
      )
      .pipe(take(1))
      .subscribe((resp: EstadisticasInsumosData) => ( this.data = resp));
  }

  get total(): number {
  const { aprobados, pendientes, rechazados } = this.data || { aprobados: 0, pendientes: 0, rechazados: 0 };
  return (aprobados || 0) + (pendientes || 0) + (rechazados || 0);
}

  public pct(k: Clave): number {
  const t = this.total || 0;
  const v = (this.data?.[k] ?? 0);
  if (!t || t <= 0) return 0;
  const p = Math.round((v / t) * 100);
  return Math.max(0, Math.min(100, p));
}

  public tieneBarra(k: Clave) {
  return this.mostrarBarras.includes(k);
}
}
