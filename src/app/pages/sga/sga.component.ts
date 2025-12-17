import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import {
  BuscarInsumoUI,
  BuscarInsumoResponseItem,
  BuscarInsumoQuery,
} from 'src/app/interfaces/registros.interface';

import { RegistrosService } from 'src/app/services/registros.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DescargasService } from 'src/app/services/descargas.service';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

type SortKey = 'producto' | 'fabricante' | 'revFDS' | 'fechaFDS' | 'empid';

@Component({
  selector: 'app-sga',
  standalone: true,
  templateUrl: './sga.component.html',
  styleUrls: ['./sga.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, SpinnerComponent],
})
export class SgaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // filtros
  filtroNombre = '';
  filtroFabricante = '';

  // estado
  loading = false;
  error: string | null = null;

  // resultados + paginación
  pageItems: BuscarInsumoUI[] = [];
  pageSize = 10;
  page = 1;

  // orden
  sortKey: SortKey = 'producto';
  sortDir: 1 | -1 = 1; // 1 asc, -1 desc

  // user
  private currentUserId: number | null = null;

  constructor(
    private registros: RegistrosService,
    private users: UsuarioService,
    private descargas: DescargasService
  ) {}

  ngOnInit(): void {
    this.users.userId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.currentUserId = id;
        this.page = 1;
        this.buscar(true);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ======================
  // Búsqueda / orden / paginación
  // ======================

  public buscar(resetPage = false): void {
    if (!this.currentUserId) return;

    if (resetPage) {
      this.page = 1;
    }

    this.loading = true;
    this.error = null;

    const offset = (this.page - 1) * this.pageSize;

    const query: BuscarInsumoQuery = {
      insumo: this.filtroNombre.trim(),
      fabricante: this.filtroFabricante.trim(),
      limit: this.pageSize,
      offset,
      sortKey: this.sortKey,
      sortDir: this.sortDir === 1 ? 'asc' : 'desc',
    };

    this.registros
      .buscarInsumosSga(this.currentUserId, query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: BuscarInsumoUI[]) => {
          this.pageItems = items ?? [];
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar los insumos.';
          this.pageItems = [];
          this.loading = false;
        },
      });
  }

  public limpiar(): void {
    this.filtroNombre = '';
    this.filtroFabricante = '';
    this.buscar(true);
  }

  public sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = 1;
    }

    this.buscar(true); // recarga con nuevo ORDER BY
  }

  public prev(): void {
    if (this.page > 1 && !this.loading) {
      this.page--;
      this.buscar();
    }
  }

  public next(): void {
    if (this.pageItems.length === this.pageSize && !this.loading) {
      this.page++;
      this.buscar();
    }
  }

  public get showingFrom(): number {
    return this.pageItems.length === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  public get showingTo(): number {
    return (this.page - 1) * this.pageSize + this.pageItems.length;
  }

  public trackByRow = (_: number, r: BuscarInsumoUI) =>
    `${r.producto}|${r.fabricante}|${r.revFDS}|${r.fechaFDS}`;

  // ======================
  // Agregar insumo
  // ======================

  public agregar(r: BuscarInsumoResponseItem): void {
    Swal.fire({
      title: 'Atención',
      text: `Agregar el insumo ${r.nombre_producto}`,
      icon: 'question',
      showCancelButton: false,
      confirmButtonColor: '#0d6efd',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.currentUserId == null) return;

        this.registros
          .addInsumos(this.currentUserId, r.empid, r.matid)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Listo!',
                text: 'Insumo agregado exitosamente',
                showConfirmButton: false,
                timer: 2500,
              });
            },
            error: (e) =>
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Ups!',
                text: `${e}`,
                showConfirmButton: false,
                timer: 2500,
              }),
          });
      }
    });
  }
}
