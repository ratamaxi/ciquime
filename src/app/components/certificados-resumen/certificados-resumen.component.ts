import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { take } from 'rxjs';
import { RegistrosService } from 'src/app/services/registros.service';
import { AppRoutingModule } from "src/app/app-routing.module";
import { RouterModule } from '@angular/router';

type EstadoCertificado = 'vigente' | 'vencido';

export interface CertificadoResumenItem {
  producto: string;
  certificado: string;
  fechaExpiracion: string;
  estado: EstadoCertificado;
}

@Component({
  selector: 'app-certificados-resumen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './certificados-resumen.component.html',
  styleUrls: ['./certificados-resumen.component.scss'],
})
export class CertificadosResumenComponent {
  public titulo = 'Certificados a vencer';
  /** Listado de certificados */
  public certificados: CertificadoResumenItem[] = [];

  constructor(private readonly registrosService: RegistrosService){
    this.registrosService.obtenerCertificadoAVencer().pipe(take(1)).subscribe({
      next: (resp: {ok: boolean, data:  CertificadoResumenItem[]}) => {
        this.certificados = resp.data}
    })
  }
  get total(): number {
    return this.certificados?.length ?? 0;
  }

  get vigentes(): number {
    return (this.certificados ?? []).filter(
      (c) => c.estado.toLowerCase() === 'vigente'
    ).length;
  }

  get vencidos(): number {
    return (this.certificados ?? []).filter(
      (c) => c.estado.toLowerCase() === 'vencido'
    ).length;
  }

  get pctVigentes(): number {
    return this.total === 0 ? 0 : Math.round((this.vigentes / this.total) * 100);
  }

  get pctVencidos(): number {
    return this.total === 0 ? 0 : Math.round((this.vencidos / this.total) * 100);
  }

  /** Ancho de la barra de progreso (string con %) */
  widthPct(pct: number): string {
    return `${pct}%`;
  }
}
