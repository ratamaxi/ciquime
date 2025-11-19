import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DescargasService } from 'src/app/services/descargas.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { environment } from 'src/environments/environment';
import { CertificadoCalidad, CertificadoApi } from 'src/app/interfaces/actividades.interface';



@Component({
  selector: 'app-certificados-calidad',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './certificados-calidad.component.html',
  styleUrls: ['./certificados-calidad.component.scss'],
})
export class CertificadosCalidadComponent implements OnInit {
  private readonly base_url_pdf = environment.base_url_pdf;

  public registros: CertificadoCalidad[] = [];
  public filtered: CertificadoCalidad[] = [];
  public displayed: CertificadoCalidad[] = [];
  public loading = false;
  public error: string | null = null;
  public query: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public pageSizeOpts: number[] = [10, 25, 50, 100];

  private idUser: string = localStorage.getItem('idUser') ?? '';

  constructor(private readonly descargasService: DescargasService) { }

  public ngOnInit(): void {
    this.cargar();
  }

  // --------- Acciones UI (PDF) ----------
  public openCertificado(registro: CertificadoCalidad, cual: 1 | 2 = 1): void {
    const file =
      cual === 1
        ? (registro.certificado || '').trim()
        : (registro.certificado2 || '').trim();

    if (!file) return;
    const url = `${this.base_url_pdf}/${encodeURIComponent(file)}`;
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
    const expedicion = this.parseDateYmd(r.fechacalidad);
    const expiracion = this.parseDateYmd(r.fechacalidad2);
    return {
      numeroInterno: r.extraname?.trim() || '--',
      producto: r.producto || '',
      fabricante: '-',
      certificado: r.nombre_calidoc || '',
      certificado2: r.nombre_calidoc2 || '',
      materia_id: r.materia_id,
      fechaExpedicion: expedicion,
      fechaExpedicion2: expiracion,
      fechaExpiracion: expiracion,
      estado:
        r.estado === 'vigente' || r.estado === 'vencido'
          ? r.estado
          : r.diasRestantes > 0
            ? 'vigente'
            : 'vencido',
      usuario_id: r.usuario_id,
      nombre_calidoc: r.nombre_calidoc,
      nombre_calidoc2: r.nombre_calidoc2,
      fechacalidad: r.fechacalidad,
      fechacalidad2: r.fechacalidad2,
      aviso: r.aviso,
      diasRestantes: r.diasRestantes,
    };
  };

  /** Normaliza fecha del back a 'YYYY-MM-DD' (para el date pipe después) */
  private parseDateYmd(v: string): string {
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  // --------- Búsqueda + paginado ----------
  public onQueryChange(v: string): void {
    this.query = v;
    this.applyFilters();
  }

  public onChangePageSize(v: number): void {
    this.pageSize = Number(v) || 10;
    this.page = 1;
    this.applyPagination();
  }

  public prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.applyPagination();
    }
  }

  public nextPage(): void {
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
  public get totalPages(): number {
    return Math.max(1, Math.ceil((this.filtered?.length || 0) / this.pageSize));
  }

  public get showingFrom(): number {
    if (!this.filtered?.length) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  public get showingTo(): number {
    return Math.min(this.filtered?.length || 0, this.page * this.pageSize);
  }

  // KPIs (sobre registros totales cargados)
  public get totalRegistros(): number {
    return this.registros.length;
  }
  public get vigentes(): number {
    return this.registros.filter((r) => r.estado === 'vigente').length;
  }
  public get vencidos(): number {
    return this.registros.filter((r) => r.estado === 'vencido').length;
  }

  public trackByNumero(_index: number, item: CertificadoCalidad): string {
    return `${item.numeroInterno}|${item.producto}|${item.certificado}`;
  }
}
