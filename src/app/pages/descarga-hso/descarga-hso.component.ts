import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDescargarComponent } from 'src/app/components/tabla-descargar/tabla-descargar.component';

@Component({
  selector: 'app-descarga-hso',
  templateUrl: './descarga-hso.component.html',
  styleUrls: ['./descarga-hso.component.scss'],
    standalone: true,
    imports: [CommonModule, TablaDescargarComponent]
})
export class DescargaHsoComponent {

}
