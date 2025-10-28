import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface TratamientoFicha {
  productName: string;
  supplier: string;
  medidasGenerales: string;
  ojos: string;
  piel: string;
  inhalacion: string;
  ingestion: string;
  notaMedico: string;
}

@Component({
  selector: 'app-tabla-tratamiento',
  templateUrl: './tabla-tratamiento.component.html',
  styleUrls: ['./tabla-tratamiento.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TablaTratamientoComponent {
  @Input() ficha!: TratamientoFicha;
}
