import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DescargasService } from 'src/app/services/descargas.service';
import { SpinnerComponent } from '../spinner/spinner.component';

type Estado = 'vigente' | 'vencido';

interface CertificadoApi {
  usuario_id: number;
  producto: string;
  extraname: string | null;
  nombre_calidoc: string | null;
  fechacalidad: string;
  aviso: number;
  estado: Estado;
  diasRestantes: number;
}

interface CertificadoCalidad {
  numeroInterno: string;
  producto: string;
  fabricante: string;
  certificado: string;
  fechaExpedicion: string;
  fechaExpiracion: string;
  estado: Estado;
}

@Component({
  selector: 'app-certificados-calidad',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './certificados-calidad.component.html',
  styleUrls: ['./certificados-calidad.component.scss'],
})
export class CertificadosCalidadComponent implements OnInit {
  // Datos base
  registros: CertificadoCalidad[] = [];

  // Derivados para la UI
  public filtered: CertificadoCalidad[] = [];
  public displayed: CertificadoCalidad[] = [];

  // estados UI
  loading = false;
  error: string | null = null;

  // búsqueda y paginación
  public query = '';
  public page = 1;
  public pageSize = 10;
  public pageSizeOpts = [10, 25, 50, 100];

  private idUser: string = localStorage.getItem('idUser') ?? '';

  constructor(private readonly descargasService: DescargasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  // --------- Acciones UI (PDF) ----------
  public openCertificado(registro: CertificadoCalidad): void {
    const file = (registro?.certificado || '').trim();
    if (!file) return;

    const base = 'https://ciquime.com.ar/PDF/doc_calidad';
    const url  = `${base}/${encodeURIComponent(file)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // --------- Carga de datos ----------
  private cargar(): void {
    if (!this.idUser) {
      this.error = 'Usuario no identificado.';
      return;
    }
    this.loading = true;
    this.error = null;

    this.descargasService.getCertificadosCalidad(this.idUser).subscribe({
      next: (resp) => {
        const data: CertificadoApi[] = resp?.data ?? [];
        this.registros = data.map(this.mapApiToUi);

        // Inicializar filtros/paginación
        this.applyFilters();

        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudieron cargar los certificados.';
        this.loading = false;
      },
    });
  }

  /** Mapea el item del backend al modelo de UI */
  private mapApiToUi = (r: CertificadoApi): CertificadoCalidad => {
    const expedicion = this.parseDateYmd(r.fechacalidad); // -> Fecha Expedición
    // Si tu backend NO trae una segunda fecha, mostramos '-'
    const expiracion = ''; // <- quedará '-' en la vista

    return {
      numeroInterno: r.extraname?.trim() || '--',
      producto: r.producto || '',
      fabricante: '-', // el API actual no lo envía
      certificado: r.nombre_calidoc || '',
      fechaExpedicion: expedicion,
      fechaExpiracion: expiracion,
      estado:
        r.estado === 'vigente' || r.estado === 'vencido'
          ? r.estado
          : r.diasRestantes > 0
          ? 'vigente'
          : 'vencido',
    };
  };

  /** Normaliza fecha del back a 'YYYY-MM-DD' (para el date pipe después) */
  private parseDateYmd(v: string): string {
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  // --------- Búsqueda + paginado ----------
  onQueryChange(v: string): void {
    this.query = v;
    this.applyFilters();
  }

  onChangePageSize(v: number): void {
    this.pageSize = Number(v) || 10;
    this.page = 1;
    this.applyPagination();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.applyPagination();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.applyPagination();
    }
  }

  private applyFilters(): void {
    const q = this.query.trim().toLowerCase();

    this.filtered = !q
      ? [...this.registros]
      : this.registros.filter((r) => {
          const hay = [
            r.numeroInterno,
            r.producto,
            r.fabricante,
            r.certificado,
          ]
            .join(' ')
            .toLowerCase();
          return hay.includes(q);
        });

    this.page = 1;
    this.applyPagination();
  }

  private applyPagination(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayed = this.filtered.slice(start, end);
  }

  // --------- Getters para la vista ----------
  get totalPages(): number {
    return Math.max(1, Math.ceil((this.filtered?.length || 0) / this.pageSize));
  }

  get showingFrom(): number {
    if (!this.filtered?.length) return 0;
    return (this.page - 1) * this.pageSize + 1;
    }

  get showingTo(): number {
    return Math.min(this.filtered?.length || 0, this.page * this.pageSize);
  }

  // KPIs (sobre registros totales cargados)
  get totalRegistros(): number {
    return this.registros.length;
  }
  get vigentes(): number {
    return this.registros.filter((r) => r.estado === 'vigente').length;
  }
  get vencidos(): number {
    return this.registros.filter((r) => r.estado === 'vencido').length;
  }

  public trackByNumero(_index: number, item: CertificadoCalidad): string {
    return `${item.numeroInterno}|${item.producto}|${item.certificado}`;
  }
}
