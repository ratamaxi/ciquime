import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { RegistrosService } from 'src/app/services/registros.service';
import { AppRoutingModule } from "src/app/app-routing.module";
import { RouterModule } from '@angular/router';
import { CertificadoResumenItemResumen } from 'src/app/interfaces/certificados.interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-certificados-resumen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './certificados-resumen.component.html',
  styleUrls: ['./certificados-resumen.component.scss'],
})
export class CertificadosResumenComponent implements OnInit{
  public titulo = 'Certificados a vencer';
  /** Listado de certificados */
  public certificados: CertificadoResumenItemResumen[] = [];

  constructor(private readonly registrosService: RegistrosService, private usuarioService: UsuarioService){}

    ngOnInit(): void {
      this.usuarioService.userId$
        .pipe(
          take(1), // si solo querés cargar una vez
          switchMap((userId) => this.registrosService.obtenerCertificadoAVencer(userId))
        )
        .pipe(take(1))
        .subscribe((resp: {ok: boolean, data:  CertificadoResumenItemResumen[]}) => ( this.certificados = resp.data));
    }

  get total(): number {
    return this.certificados?.length ?? 0;
  }

  public get vigentes(): number {
    return (this.certificados ?? []).filter(
      (c) => c.estado.toLowerCase() === 'vigente'
    ).length;
  }

  public get vencidos(): number {
    return (this.certificados ?? []).filter(
      (c) => c.estado.toLowerCase() === 'vencido'
    ).length;
  }

  public get pctVigentes(): number {
    return this.total === 0 ? 0 : Math.round((this.vigentes / this.total) * 100);
  }

  public get pctVencidos(): number {
    return this.total === 0 ? 0 : Math.round((this.vencidos / this.total) * 100);
  }

  /** Ancho de la barra de progreso (string con %) */
  public widthPct(pct: number): string {
    return `${pct}%`;
  }
}
