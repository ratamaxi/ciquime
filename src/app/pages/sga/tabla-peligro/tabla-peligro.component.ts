import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SgaFicha } from 'src/app/interfaces/descargas.interface';

@Component({
  selector: 'app-tabla-peligro',
  standalone: true,
  templateUrl: './tabla-peligro.component.html',
  styleUrls: ['./tabla-peligro.component.scss'],
  imports: [CommonModule]
})
export class TablaPeligroComponent {
  @Input() ficha!: SgaFicha;

  getPictogramUrl(code: string): string {
    return `assets/iconos/${code}.png`; // todos son PNG
  }

  // trackBy que usa el propio código como identidad
  trackByCode(_index: number, code: string): string {
    return code;
  }

  onPrint() {
    window.print();
  }
}
