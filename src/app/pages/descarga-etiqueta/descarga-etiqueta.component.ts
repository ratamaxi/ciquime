import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablaDescargarComponent } from 'src/app/components/tabla-descargar/tabla-descargar.component';
import { FdsDataResponse, FdsResponse } from 'src/app/interfaces/descargas.interface';
import { RegistrosService } from 'src/app/services/registros.service';

@Component({
  selector: 'app-descarga-etiqueta',
  templateUrl: './descarga-etiqueta.component.html',
  styleUrls: ['./descarga-etiqueta.component.scss'],
  standalone: true,
  imports: [CommonModule, TablaDescargarComponent]
})
export class DescargaEtiquetaComponent implements OnInit {
  public materiasPrimas: FdsDataResponse[] = [];

 constructor(
    private registros: RegistrosService
  ){}

  public ngOnInit(): void {
    this.registros.obtenerDataFds().subscribe({
      next: (resp: FdsResponse) => {
        this.materiasPrimas = resp.data ?? []
      }
    })
  }
}
