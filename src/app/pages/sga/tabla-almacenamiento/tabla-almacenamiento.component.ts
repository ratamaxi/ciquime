import { Component, Input } from '@angular/core';

export interface AlmacenamientoFicha {
  productName: string;
  supplier: string;

  tipoProducto: string;
  caracteristicasDeposito: string;
  condicionesOperacion: string;
  disposicionesParticulares: string;
  disposicionesAlmacenamiento: string;
  incompatibleCon: string;
}

@Component({
  selector: 'app-tabla-almacenamiento',
  templateUrl: './tabla-almacenamiento.component.html',
  styleUrls: ['./tabla-almacenamiento.component.scss'],
  standalone: true
})
export class TablaAlmacenamientoComponent {
@Input() ficha!: AlmacenamientoFicha
}
