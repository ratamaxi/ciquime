import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DescargasService } from 'src/app/services/descargas.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { environment } from 'src/environments/environment';
import { CertificadoCalidad, CertificadoApi } from 'src/app/interfaces/actividades.interface';
import { CertificadoPorVencer } from 'src/app/interfaces/certificados.interfaces';



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
  public showExpiringModal = false;
  public expiringPage = 1;
  public expiringPageSize = 10;

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


  // --------- Certificados por vencer ----------
  public get certificadosPorVencer(): CertificadoPorVencer[] {
    const hoy = this.startOfDay(new Date());
    const msPorDia = 1000 * 60 * 60 * 24;

    return this.registros.flatMap((registro, idx) => {
      const baseId = this.trackByNumero(idx, registro);
      const items = [
        this.buildExpiringItem({
          registro,
          fecha: registro.fechacalidad,
          certificado: registro.certificado,
          itemId: `${baseId}|cert1`,
          hoy,
          msPorDia,
        }),
        this.buildExpiringItem({
          registro,
          fecha: registro.fechacalidad2,
          certificado: registro.certificado2 || registro.certificado,
          itemId: `${baseId}|cert2`,
          hoy,
          msPorDia,
        }),
      ];

      return items.filter((item): item is CertificadoPorVencer => !!item);
    });
  }

  public get certificadosPorVencerPaginated(): CertificadoPorVencer[] {
    const start = (this.expiringPage - 1) * this.expiringPageSize;
    const end = start + this.expiringPageSize;
    return this.certificadosPorVencer.slice(start, end);
  }

  public get expiringTotalPages(): number {
    return Math.max(1, Math.ceil(this.certificadosPorVencer.length / this.expiringPageSize));
  }

  public get expiringShowingFrom(): number {
    if (!this.certificadosPorVencer.length) return 0;
    return (this.expiringPage - 1) * this.expiringPageSize + 1;
  }

  public get expiringShowingTo(): number {
    return Math.min(
      this.certificadosPorVencer.length,
      this.expiringPage * this.expiringPageSize,
    );
  }

  public trackByExpiring(_index: number, item: CertificadoPorVencer): string {
    return item.id;
  }

  public openExpiringModal(): void {
    this.showExpiringModal = true;
    this.expiringPage = 1;
  }

  public closeExpiringModal(): void {
    this.showExpiringModal = false;
  }

  public prevExpiringPage(): void {
    if (this.expiringPage > 1) {
      this.expiringPage--;
    }
  }

  public nextExpiringPage(): void {
    if (this.expiringPage < this.expiringTotalPages) {
      this.expiringPage++;
    }
  }

  private buildExpiringItem({
    registro,
    fecha,
    certificado,
    itemId,
    hoy,
    msPorDia,
  }: {
    registro: CertificadoCalidad;
    fecha: string | null;
    certificado: string | null;
    itemId: string;
    hoy: Date;
    msPorDia: number;
  }): CertificadoPorVencer | null {
    const fechaExpiracion = this.toDate(fecha);
    if (!fechaExpiracion) return null;

    const fechaNormalizada = this.startOfDay(fechaExpiracion);
    const diffDias = Math.ceil((fechaNormalizada.getTime() - hoy.getTime()) / msPorDia);
    if (diffDias > registro.aviso) return null;

    const certificadoLabel = certificado?.trim() || '-';

    return {
      id: itemId,
      producto: registro.producto,
      certificado: certificadoLabel,
      fechaExpiracion: fechaNormalizada.toISOString().slice(0, 10),
      estado: diffDias < 0 ? 'vencido' : 'vigente',
      estadoTexto: diffDias < 0 ? 'Vencido' : `Vence en ${diffDias} días`,
    } as CertificadoPorVencer;
  }

  private startOfDay(date: Date): Date {
    const clone = new Date(date);
    clone.setHours(0, 0, 0, 0);
    return clone;
  }

  private toDate(value: string | null): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}
