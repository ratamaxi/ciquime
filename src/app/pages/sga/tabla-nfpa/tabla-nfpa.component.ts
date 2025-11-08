import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { DescargasService } from 'src/app/services/descargas.service';
import { RegistrosService } from 'src/app/services/registros.service';

export interface NfpaTransporteFicha {
  productName: string;   // header.nombre_producto
  supplier: string;      // header.razonSocial
  fuente: string;        // header.fuente
  nfpa: {
    salud: number | string;
    inflamabilidad: number | string;
    reactividad: number | string;
    otros: string;
  };
  transporte: {
    codRiesgo: string;       // transporte.cod_riesgo
    nroOnu: string;          // transporte.nro_onu
    grupoEmbalaje: string;   // transporte.grupo_embalaje
    clasImg: string;         // transporte.clas_img
    guia: string;            // transporte.guia
  };
}

@Component({
  selector: 'app-tabla-nfpa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-nfpa.component.html',
  styleUrls: ['./tabla-nfpa.component.scss']
})
export class TablaNfpaComponent {
  @Input() ficha!: NfpaTransporteFicha;
  @Output() fetClick = new EventEmitter<'A' | 'B'>();
  private materiaId: string = '';


  constructor(private readonly descargasService:DescargasService, private readonly registrosService:RegistrosService, private readonly route: ActivatedRoute){
    //this.descargasService.getPais().subscribe(resp => console.log(resp))
     this.route.paramMap.pipe(take(1)).subscribe(pm => {
      const id = pm.get('id');
      id ? this.materiaId = id : this.materiaId = '';
    });
  }

  get hasTransportClass(): boolean {
    const v = this.ficha?.transporte?.clasImg;
    return !!v && v !== '0' && v.toString().trim() !== '';
  }

  public onOpenFET(): void {
  const url = this.registrosService.getFetUrl(this.materiaId);
  window.open(url, '_blank', 'noopener,noreferrer');
  }

  public openPdfBotonB(): void{
  const url = `${window.location.origin}/assets/img/FIE_MERCOSUR_Parte_2.pdf`;
  window.open(url, '_blank', 'noopener');
  }
}
