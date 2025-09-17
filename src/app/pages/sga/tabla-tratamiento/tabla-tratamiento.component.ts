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
  @Input() ficha: TratamientoFicha = {
    productName: '1,4-DIOXANO',
    supplier: 'MERCK S.A.',
    medidasGenerales:
      'Evitar la exposición al producto, tomando las medidas de protección adecuadas. Consultar al médico, llevando la ficha de seguridad.',
    ojos:
      'Enjuagar inmediatamente los ojos con agua durante al menos 15 minutos, manteniendo abiertos los párpados. Si hay lentes de contacto, retirarlas tras 5 minutos y continuar enjuagando. Consultar al médico.',
    piel:
      'Lavar la zona inmediatamente con abundante agua y jabón durante al menos 15 minutos. Retirar la ropa contaminada y lavarla antes de reutilizar.',
    inhalacion:
      'Trasladar a la víctima a un área con aire limpio. Mantenerla en calma. Si no respira, suministrar respiración artificial. Llamar al médico.',
    ingestion:
      'NO INDUCIR EL VÓMITO. Enjuagar la boca con agua. No administrar nada por vía oral a una persona inconsciente. Llamar al médico.',
    notaMedico:
      'Realizar tratamiento sintomático. Para más información, consultar a un Centro Nacional de Intoxicaciones (24 hs).',
  };
}
