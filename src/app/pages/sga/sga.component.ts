import { Component } from '@angular/core';
import { SgaFicha, TablaPeligroComponent } from './tabla-peligro/tabla-peligro.component';
import { CommonModule } from '@angular/common';
import { TablaEppComponent, TablaEppFicha } from './tabla-epp/tabla-epp.component';
import { TablaNfpaComponent } from './tabla-nfpa/tabla-nfpa.component';
import { TablaTratamientoComponent } from './tabla-tratamiento/tabla-tratamiento.component';
import { TablaEmergenciaComponent } from './tabla-emergencia/tabla-emergencia.component';
import { TablaAlmacenamientoComponent } from './tabla-almacenamiento/tabla-almacenamiento.component';

@Component({
  selector: 'app-sga',
  templateUrl: './sga.component.html',
  styleUrls: ['./sga.component.scss'],
  standalone: true,
  imports: [TablaPeligroComponent, CommonModule, TablaEppComponent, TablaNfpaComponent, TablaTratamientoComponent, TablaEmergenciaComponent, TablaAlmacenamientoComponent]
})
export class SgaComponent {

  active: 'peligro' | 'epp' | 'nfpa' | 'trat' | 'emerg' | 'alm' = 'peligro';

  tabs = [
    { key: 'peligro', label: 'Peligros por SGA' },
    { key: 'epp',     label: 'EPP y Composición' },
    { key: 'nfpa',    label: 'NFPA y Transporte' },
    { key: 'trat',    label: 'Tratamiento' },
    { key: 'emerg',   label: 'Emergencia' },
    { key: 'alm',     label: 'Almacenamiento' },
  ] as const;

  // Mock para la pestaña EPP
  fichaEpp: TablaEppFicha = {
    productName: '1,4-DIOXANO',
    supplier: 'MERCK S.A.',
    rnpq: '',
    epp: ['gafas','guantes','respirador'],
    componentes: [
      { nombre: '1,4-Dioxano', cas: '123-91-1', porcentaje: '100%' }
    ]
  };

  // Mock para la ficha SGA (podés reemplazar desde API)
  ficha: SgaFicha = {
    productName: '1,4-DIOXANO',
    supplier: 'MERCK S.A.',
    displayVisibility: 'Publico',
    dataSource: 'FDS Proveedor',
    pictograms: ['llama','peligro-salud','exclamacion'],
    signalWord: 'PELIGRO',
    hazardStatements: [
      'H225 - Líquido y vapores muy inflamables.',
      'H319 - Provoca irritación ocular grave.',
      'H335 - Puede irritar las vías respiratorias.',
      'H350 - Puede provocar cáncer.'
    ],
    precautionaryStatements: [
        'P201 - Procurarse las instrucciones antes del uso.',
      'P202 - No manipular antes de haber leído y comprendido todas las instrucciones de seguridad.',
      'P210 - Mantener alejado de fuentes de calor, superficies calientes, chispas, llamas al descubierto y otras fuentes de ignición. No fumar.',
      'P233 - Mantener el recipiente herméticamente cerrado.',
      'P261 - Evitar respirar el polvo, el humo, el gas, la niebla, los vapores o el aerosol.',
      'P264 - Lavarse cuidadosamente tras la manipulación.',
      'P271 - Utilizar sólo al aire libre o en un lugar bien ventilado.',
      'P280 - Usar guantes, ropa y equipo de protección para los ojos y la cara.',
      'P303 + P361 + P353 - EN CASO DE CONTACTO CON LA PIEL(o el pelo): Quitar inmediatamente toda la ropa contaminada.Enjuagar la piel con agua o ducharse.',
      'P304 + P340 - EN CASO DE INHALACIÓN: Transportar a la persona al aire libre y mantenerla en una posición que le facilite la respiración.',
      'P305 + P351 + P338 - EN CASO DE CONTACTO CON LOS OJOS: Enjuagar con agua cuidadosamente durante varios minutos.Quitar las lentes de contacto, cuando estén presentes y pueda hacerse con facilidad.Proseguir con el lavado.',
      'P308 + P313 - EN CASO DE exposición demostrada o supuesta: Consultar a un médico.',
      'P312 - Llamar a un CENTRO DE TOXICOLOGÍA o a un médico si la persona se encuentra mal.',
      'P337 + P313 - SI LA IRRITACIÓN OCULAR PERSISTE: Consultar a un médico.',
      'P370 + P378 - EN CASO DE INCENDIO: Utilizar niebla de agua, espuma AR - AFFF, polvo químico seco o dióxido de carbono(CO2) para la extinción.',
      'P403 + P233 - Almacenar en lugar bien ventilado.Mantener el recipiente herméticamente cerrado.',
      'P405 - Guardar bajo llave.',
    ]
  };
}
