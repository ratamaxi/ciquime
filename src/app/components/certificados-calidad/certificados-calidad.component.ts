import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DescargasService } from 'src/app/services/descargas.service';

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
  imports: [CommonModule],
  templateUrl: './certificados-calidad.component.html',
  styleUrls: ['./certificados-calidad.component.scss'],
})
export class CertificadosCalidadComponent implements OnInit {
  registros: CertificadoCalidad[] = [];

  // estados UI
  loading = false;
  error: string | null = null;

  // paginación (si luego paginás en tabla)
  public page = 1;
  public pageSize = 8;

  private idUser: string = localStorage.getItem('idUser') ?? '';

  constructor(private readonly descargasService: DescargasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    if (!this.idUser) {
      this.error = 'Usuario no identificado.';
      return;
    }
    this.loading = true;
    this.error = null;

    this.descargasService.getCertificadosCalidad(this.idUser).subscribe({
      next: (resp) => {
        console.log(resp)
        const data: CertificadoApi[] = resp?.data ?? [];
        this.registros = data.map(this.mapApiToUi);
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
    const expedicion = this.parseDateYmd(r.fechacalidad);      // usamos fechacalidad como “expedición”
    const expiracion = this.calcExpFromDiasRestantes(r.diasRestantes);

    return {
      numeroInterno: r.extraname?.trim() || '--',
      producto: r.producto || '',
      fabricante: '-',                          // el API actual no lo envía
      certificado: r.nombre_calidoc || '',
      fechaExpedicion: expedicion,
      fechaExpiracion: expiracion,
      estado: (r.estado === 'vigente' || r.estado === 'vencido') ? r.estado : (r.diasRestantes > 0 ? 'vigente' : 'vencido'),
    };
  };

  /** Normaliza fecha del back a 'YYYY-MM-DD' (para el date pipe después) */
  private parseDateYmd(v: string): string {
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    // ISO yyyy-mm-dd
    return d.toISOString().slice(0, 10);
  }

  /** Calcula fecha de expiración en base a hoy + diasRestantes */
  private calcExpFromDiasRestantes(diasRestantes: number): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(today);
    exp.setDate(today.getDate() + (Number.isFinite(diasRestantes) ? diasRestantes : 0));
    return exp.toISOString().slice(0, 10);
  }

  // KPIs
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
