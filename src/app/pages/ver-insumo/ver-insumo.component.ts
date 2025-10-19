import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Estado, Insumo } from 'src/app/interfaces/registros.interface';
import { RegistrosService } from 'src/app/services/registros.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-insumo',
  templateUrl: './ver-insumo.component.html',
  styleUrls: ['./ver-insumo.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class VerInsumoComponent implements OnInit, OnDestroy {
  public readonly Math = Math;
  public activeTab: Estado = 'APROBADO';
  private destroy$: Subject<void> = new Subject();
  private empresaId: string | null = localStorage.getItem('id_empresa');

  // Búsqueda y paginado
  public query = '';
  public pageSize = 10;
  public page = 1;
  private currentUserId: number | null = null;

  // Ordenamiento
  public sortKey: keyof Insumo | 'fechaFds' = 'producto';
  public sortDir: 1 | -1 = 1;

  // Mock de insumos (meté los reales cuando tengas API)
  private all: Insumo[] = [];

  // Derivados
  get filtered(): Insumo[] {
    const q = this.query.trim().toLowerCase();
    return this.all
      .filter(i => i.estado === this.activeTab)
      .filter(i =>
        !q ||
        i.producto.toLowerCase().includes(q) ||
        i.fabricante.toLowerCase().includes(q) ||
        (i.nombreInterno ?? '').toLowerCase().includes(q) ||
        (i.codigoAprobacion ?? '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const va = (a[this.sortKey] ?? '').toString().toLowerCase();
        const vb = (b[this.sortKey] ?? '').toString().toLowerCase();
        return va < vb ? -1 * this.sortDir : va > vb ? 1 * this.sortDir : 0;
      });
  }

  get total(): number { return this.filtered.length; }

  get pageData(): Insumo[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  constructor(
    private registros: RegistrosService,
    private users: UsuarioService
  ) { }

  public ngOnInit(): void {
    // Espero el userId y disparo primera carga
    this.users.userId$.subscribe((id) => {
      this.currentUserId = id;
      this.page = 1;
      this.fetchData();
    });
  }

  private fetchData() {
    if (!this.currentUserId) return;
    this.registros.getInsumosParaEditar(this.activeTab, this.currentUserId).subscribe({
      next: (rows: Insumo[]) => {
        this.all = [];
        this.all = rows;
        this.page = 1;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => { }
    });
  }

  public setTab(tab: Estado) {
    this.activeTab = tab;
    this.fetchData();
    this.page = 1;
    this.query = '';
  }

  toggleSort(key: keyof Insumo | 'fechaFds') {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = 1;
    }
  }

  next() {
    if (this.page * this.pageSize < this.total) this.page++;
  }
  prev() {
    if (this.page > 1) this.page--;
  }

  // ====== Acciones con SweetAlert2 ======

  async editar(i: Insumo) {
    await Swal.fire({
      icon: 'info',
      title: 'Editar',
      text: `Editar: ${i.producto}`
    });
  }

  async verSGA(i: Insumo) {
    await Swal.fire({
      icon: 'info',
      title: 'SGA',
      text: `SGA de: ${i.producto}`
    });
  }

  async verHSO(i: Insumo) {
    await Swal.fire({
      icon: 'info',
      title: 'Hoja de Seguridad',
      text: `HSO de: ${i.producto}`
    });
  }

  async verFDS(i: Insumo) {
    await Swal.fire({
      icon: 'info',
      title: 'Ficha de Datos de Seguridad',
      text: `FDS de: ${i.producto}`
    });
  }

  async imprimirEtiqueta(i: Insumo) {
    await Swal.fire({
      icon: 'info',
      title: 'Imprimir etiqueta',
      text: `Etiqueta de: ${i.producto}`
    });
  }

  async auditar(i: Insumo) {
    await Swal.fire({
      icon: 'info',
      title: 'Auditar',
      text: `Auditar: ${i.producto}`
    });
  }

  async eliminar(i: Insumo) {
    const { isConfirmed } = await Swal.fire({
      title: `¿Eliminar "${i.producto}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
    });

    if (isConfirmed) {
      this.all = this.all.filter(x => x.id !== i.id);
      this.page = 1;
      const body = {
        matempresa: i.id,
        empresa_id: this.empresaId,
        usuario_id: this.currentUserId,
      }
      if (this.currentUserId) this.registros.eliminarInsumo(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: `"${i.producto}" fue eliminado.`
            });
          },
          error: () => {
              Swal.fire({
              icon: 'error',
              title: 'Ups!',
              text: `No se pudo contretar la tarea`
            });
          }
        })
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
