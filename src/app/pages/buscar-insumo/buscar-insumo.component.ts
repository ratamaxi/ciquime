import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import {
  AgregarInsumoAUsuario,
  BuscarInsumoResponseItem,
  BuscarInsumoUI
} from 'src/app/interfaces/registros.interface';
import { RegistrosService } from 'src/app/services/registros.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

type SortKey = 'producto' | 'fabricante' | 'revFDS' | 'fechaFDS' | 'empid';

@Component({
  selector: 'app-buscar-insumo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
  templateUrl: './buscar-insumo.component.html',
  styleUrls: ['./buscar-insumo.component.scss'],
})
export class BuscarInsumoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  private idEmpresa: string = localStorage.getItem('id_empresa') ?? '';

  // clave para localStorage
  private readonly STORAGE_KEY = 'buscarInsumoState';

  // filtros
  public filtroNombre = '';
  public filtroFabricante = '';

  // estado
  public loading = false;
  public error: string | null = null;

  // resultados + paginación
  public pageItems: BuscarInsumoUI[] = [];
  public pageSize = 10;
  public page = 1;

  // orden
  public sortKey: SortKey = 'producto';
  public sortDir: 1 | -1 = 1; // 1 asc, -1 desc

  // user
  private currentUserId: number | null = null;

  constructor(
    private registros: RegistrosService,
    private users: UsuarioService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.users.userId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.currentUserId = id;

        // 1) cargo el estado guardado (si existe)
        this.loadState();

        // 2) aseguro que siempre haya página válida
        this.page = this.page || 1;

        // 3) hago la búsqueda inicial con ese estado
        this.buscar();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  // =========================
  //   Estado en localStorage
  // =========================
  private loadState(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;

      const s = JSON.parse(raw);
      this.filtroNombre = s.filtroNombre ?? '';
      this.filtroFabricante = s.filtroFabricante ?? '';
      this.page = s.page ?? 1;
      this.sortKey = s.sortKey ?? 'producto';
      this.sortDir = s.sortDir ?? 1;
    } catch (e) {
      console.error('No se pudo cargar estado de búsqueda', e);
    }
  }

  private saveState(): void {
    const state = {
      filtroNombre: this.filtroNombre,
      filtroFabricante: this.filtroFabricante,
      page: this.page,
      sortKey: this.sortKey,
      sortDir: this.sortDir,
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('No se pudo guardar estado de búsqueda', e);
    }
  }

  // =========================
  //     Búsqueda (2 APIs)
  // =========================
  public buscar(resetPage = false): void {
    if (!this.currentUserId) return;

    if (resetPage) this.page = 1;

    this.loading = true;
    this.error = null;
    this.saveState();

    const offset = (this.page - 1) * this.pageSize;

    const sortDirStr = this.sortDir === 1 ? 'asc' : 'desc';

    const query = {
      insumo: this.filtroNombre.trim(),
      fabricante: this.filtroFabricante.trim(),
      limit: this.pageSize,
      offset,
      sortKey: this.sortKey,
      sortDir: sortDirStr,
    } as const;

    console.log(query)

    // llamo a los dos endpoints en paralelo
    forkJoin({
      disponibles: this.registros.buscarInsumosDisponibles(this.currentUserId, query),
      privados:    this.registros.buscarInsumosPrivados(this.currentUserId, query, this.idEmpresa),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ disponibles, privados }) => {
          console.log(privados)
          const list1 = disponibles ?? [];
          const list2 = privados ?? [];

          // los uno en una sola grilla
          this.pageItems = [...list1, ...list2];

          // si querés reforzar el orden en el front (global sobre ambos arrays)
          this.applySort();

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
    this.page = 1;
    this.saveState();
    this.buscar(true);
  }

  public sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = 1;
    }
    this.page = 1;
    this.saveState();
    this.buscar(true);
  }

  public prev(): void {
    if (this.page > 1 && !this.loading) {
      this.page--;
      this.saveState();
      this.buscar();
    }
  }

  public next(): void {
    if (this.pageItems.length === this.pageSize && !this.loading) {
      this.page++;
      this.saveState();
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

  public irASga(r: BuscarInsumoResponseItem): void {
    this.saveState();
    this.router.navigate(['/panel/sga/detalle'], {
      state: { materiaId: r.id, mostrarCompleto: false },
    });
  }

  public verFDS(r: any): void {
    if (!r?.url) return;
    window.open(r.url, '_blank', 'noopener');
  }

  public agregar(r: BuscarInsumoResponseItem): void {
    Swal.fire({
      title: `Atención`,
      text: `Agregar el insumo ${r.nombre_producto}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.currentUserId == null) return;

        const body: AgregarInsumoAUsuario = {
          materia: r.id.toString(),
          empresa: this.idEmpresa,
          usuario: this.currentUserId.toString(),
        };

        this.registros
          .agregarInsumoUsuario(body)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              // saco el insumo de la página
              this.pageItems = this.pageItems.filter((x) => x.id !== r.id);

              // si quedó vacía y hay páginas previas, retrocedo y recargo
              if (this.pageItems.length === 0 && this.page > 1) {
                this.page--;
                this.buscar();
              }

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
