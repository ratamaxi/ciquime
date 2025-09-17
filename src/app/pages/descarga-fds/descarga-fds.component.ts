import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TablaDescargarComponent } from 'src/app/components/tabla-descargar/tabla-descargar.component';

@Component({
  selector: 'app-descarga-fds',
  templateUrl: './descarga-fds.component.html',
  styleUrls: ['./descarga-fds.component.scss'],
  standalone: true,
  imports: [CommonModule, TablaDescargarComponent]
})
export class DescargaFdsComponent {

}
