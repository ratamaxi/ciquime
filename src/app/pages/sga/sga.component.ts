import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BuscarInsumoUI, BuscarInsumoResponseItem } from 'src/app/interfaces/registros.interface';
import { RegistrosService } from 'src/app/services/registros.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DescargasService } from 'src/app/services/descargas.service';
import { RouterModule } from '@angular/router';

type SortKey = 'producto' | 'fabricante' | 'revFDS' | 'fechaFDS' | 'empid';
@Component({
  selector: 'app-sga',
  templateUrl: './sga.component.html',
  styleUrls: ['./sga.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class SgaComponent  implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  // filtros
  filtroNombre = '';
  filtroFabricante = '';

  // estado
  loading = false;
  error: string | null = null;

  // resultados + paginación
  pageItems: any[] = [];
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

  ) { }

  public ngOnInit(): void {
    // Espero el userId y disparo primera carga
    this.users.userId$.subscribe((id) => {
      this.currentUserId = id;
      this.page = 1;
      this.buscar();
    });
  }

  // --- Acciones UI ---
  public buscar(): void {
    if (!this.currentUserId) return;
    this.loading = true;
    this.error = null;

    const offset = (this.page - 1) * this.pageSize;

    this.registros.buscarInsumosDisponibles(this.currentUserId, {
      insumo: this.filtroNombre.trim(),
      fabricante: this.filtroFabricante.trim(),
      limit: this.pageSize,
      offset
    }).subscribe({
      next: (items: any) => {
        this.pageItems = items ?? [];
        this.applySort();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los insumos.';
        this.pageItems = [];
        this.loading = false;
      }
    });
  }

  public limpiar(): void {
    this.filtroNombre = '';
    this.filtroFabricante = '';
    this.page = 1;
    this.buscar();
  }

  public sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = 1;
    }
    this.applySort();
  }

  public prev(): void {
    if (this.page > 1 && !this.loading) {
      this.page--;
      this.buscar();
    }
  }

  public next(): void {
    // si la página vino “llena”, asumo que hay otra página
    if (this.pageItems.length === this.pageSize && !this.loading) {
      this.page++;
      this.buscar();
    }
  }

  private applySort(): void {
    const key = this.sortKey;
    const dir = this.sortDir;

    this.pageItems = [...this.pageItems].sort((a, b) => {
      let va: any = a[key];
      let vb: any = b[key];

      if (key === 'fechaFDS') {
        // ordenar por fecha real
        const da = va ? new Date(va).getTime() : 0;
        const db = vb ? new Date(vb).getTime() : 0;
        return (da - db) * dir;
      }

      va = (va ?? '').toString().toLowerCase();
      vb = (vb ?? '').toString().toLowerCase();
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }

  public get showingFrom(): number {
    return this.pageItems.length === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  public get showingTo(): number {
    return (this.page - 1) * this.pageSize + this.pageItems.length;
  }

  public trackByRow = (_: number, r: BuscarInsumoUI) =>
    `${r.producto}|${r.fabricante}|${r.revFDS}|${r.fechaFDS}`;

  public agregar(r: BuscarInsumoResponseItem) {
    console.log(r)
    Swal.fire({
      title: `Atención`,
      text: `Agregar el insumo ${r.nombre_producto}`,
      icon: 'question',
      showCancelButton: false,
      confirmButtonColor: '#0d6efd',
      confirmButtonText: 'Aceptar'
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
                        timer: 2500
                      });
             },
            error: (e) =>
              Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: '¡Ups!',
                      text: `${e}`,
                      showConfirmButton: false,
                      timer: 2500
                    }),
          });
      }
    })

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
