import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SgaFicha } from 'src/app/interfaces/descargas.interface';
@Component({
  selector: 'app-tabla-peligro',
  templateUrl: './tabla-peligro.component.html',
  styleUrls: ['./tabla-peligro.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TablaPeligroComponent {
  @Input() ficha!: SgaFicha;

  onPrint() {
    // Hook de impresión. Podés reemplazar por window.print() o emitir evento.
    window.print();
  }
}
