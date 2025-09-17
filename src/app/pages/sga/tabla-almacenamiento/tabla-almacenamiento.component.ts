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
@Input() ficha: AlmacenamientoFicha = {
    productName: '1,4-DIOXANO',
    supplier: 'MERCK S.A.',

    tipoProducto: 'Líquidos Inflamables',
    caracteristicasDeposito:
      'Los almacenamientos de inflamables constituirán un sector o área independiente a cualquier otra actividad. ' +
      'Los almacenamientos de recipientes móviles que contengan productos clasificados como inflamables se podrán almacenar ' +
      'en almacenamientos cerrados, abiertos, armarios de seguridad para inflamables o contenedores modulares.',
    condicionesOperacion:
      'La capacidad mínima de cada cubeto se calculará teniendo en cuenta solo los recipientes que viertan en él.',
    disposicionesParticulares:
      'El almacenamiento deberá disponer de un sistema de extinción fijo contra incendios de acuerdo a la correspondiente norma aplicable.',
    disposicionesAlmacenamiento:
      'Se elegirá el agente extintor más adecuado al tipo de fuego existente, debiendo cumplir con las prescripciones establecidas ' +
      'en la normativa que le sea de aplicación y de las fichas de datos de seguridad del fabricante.',
    incompatibleCon:
      'Sustancias Pirofóricas, Sustancias que experimentan calentamiento espontáneo, Sustancias que Reaccionan Espontáneamente, ' +
      'Oxidantes y Peróxidos Orgánicos',
  };
}
