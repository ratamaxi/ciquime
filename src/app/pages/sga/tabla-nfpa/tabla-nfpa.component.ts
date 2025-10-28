import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NfpaTransporteFicha } from 'src/app/interfaces/descargas.interface';

export interface NfpaFicha {
  productName: string;
  supplier: string;
  dataSource: string; // ej: "FDS Proveedor"
  transportClass: string; // ej: "3"
  nfpa: {
    salud: number | string;
    inflamabilidad: number | string;
    reactividad: number | string;
    otros: string; // guiones o notas
  };
  transporte: {
    codigoRiesgo: string | number;
    numeroONU: string | number;
    grupoEmbalaje: string;
  };
  fetDocs: Array<{ label: string; href?: string }>; // ej: A, B
}

@Component({
  selector: 'app-tabla-nfpa',
  templateUrl: './tabla-nfpa.component.html',
  styleUrls: ['./tabla-nfpa.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TablaNfpaComponent {
  @Input() ficha!: NfpaTransporteFicha;

  // Si querés mostrar “sin clase” cuando clasImg sea '0'
  get hasTransportClass(): boolean {
    return !!this.ficha?.transporte?.clasImg && this.ficha.transporte.clasImg !== '0';
  }

}
