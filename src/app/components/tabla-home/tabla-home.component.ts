import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { RegistrosService } from 'src/app/services/registros.service';
import { UsuarioService } from 'src/app/services/usuario.service';

export type EstadoRegistro = 'APROBADO' | 'RECHAZADO' | 'PENDIENTE' | 'ELIMINADO';

export interface Registro {
  actualizado: Date;
  id: string;
  codigo?: string | null;
  nombreInterno?: string | null;
  nombre_producto: string;
  nomb_empresa: string;
  estado: EstadoRegistro;
}

@Component({
  selector: 'app-tabla-home',
  templateUrl: './tabla-home.component.html',
  styleUrls: ['./tabla-home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [RegistrosService] // ← este puede quedarse si querés una instancia propia del service de registros
})
export class TablaHomeComponent {
  @Input() titulo = 'Últimos registros aprobados';
  @Output() verMas = new EventEmitter<void>();

  registros: Registro[] = [];
  activeFilter: 'todos' | EstadoRegistro = 'todos';
  readonly MAX_TO_SHOW = 5;

  constructor(
    private registroService: RegistrosService,
    private usuarioService: UsuarioService
  ) {
    // Espera al userId y recién pide los registros
    this.usuarioService.userId$
      .pipe(
        take(1), // si solo querés cargar una vez
        switchMap((userId) => this.registroService.obtenerRegistroData(userId))
      )
      .subscribe((resp) => (this.registros = resp));
  }

  get filtered(): Registro[] {
    if (this.activeFilter === 'todos') return this.registros ?? [];
    return (this.registros ?? []).filter((r) => r.estado === this.activeFilter);
  }

  get counts() {
    const base = { APROBADO: 0, RECHAZADO: 0, PENDIENTE: 0, ELIMINADO: 0 };
    for (const r of this.registros ?? []) base[r.estado]++;
    return base;
  }

  get hasMore(): boolean {
    return this.filtered.length > this.MAX_TO_SHOW;
  }

  setFilter(f: 'todos' | EstadoRegistro) {
    this.activeFilter = f;
  }

  trackByRow(_i: number, row: Registro) {
    return `${row.codigo ?? ''}-${row.nombre_producto}-${row.nomb_empresa}-${row.estado}`;
  }
}
