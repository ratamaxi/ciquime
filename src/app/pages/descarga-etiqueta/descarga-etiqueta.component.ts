import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDescargarComponent } from 'src/app/components/tabla-descargar/tabla-descargar.component';

@Component({
  selector: 'app-descarga-etiqueta',
  templateUrl: './descarga-etiqueta.component.html',
  styleUrls: ['./descarga-etiqueta.component.scss'],
  standalone: true,
  imports: [CommonModule, TablaDescargarComponent]
})
export class DescargaEtiquetaComponent {

}
