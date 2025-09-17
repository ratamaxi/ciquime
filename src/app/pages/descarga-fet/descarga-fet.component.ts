import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDescargarComponent } from 'src/app/components/tabla-descargar/tabla-descargar.component';

@Component({
  selector: 'app-descarga-fet',
  templateUrl: './descarga-fet.component.html',
  styleUrls: ['./descarga-fet.component.scss'],
    standalone: true,
    imports: [CommonModule, TablaDescargarComponent]
})
export class DescargaFetComponent {

}
