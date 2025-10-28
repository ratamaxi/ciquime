import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActividadesItemComponent, ActividadItem } from 'src/app/components/actividades-item/actividades-item.component';
import { CertificadoResumenItem, CertificadosResumenComponent } from 'src/app/components/certificados-resumen/certificados-resumen.component';
import { EstadisticasComponent } from 'src/app/components/estadisticas/estadisticas.component';
import { StatusCardComponent } from 'src/app/components/status-card/status-card.component';
import { TablaHomeComponent } from 'src/app/components/tabla-home/tabla-home.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports:[CommonModule, StatusCardComponent, TablaHomeComponent, EstadisticasComponent, ActividadesItemComponent, CertificadosResumenComponent]
})
export class HomeComponent {

    misActividades: ActividadItem[] = [
    { texto: 'Cambio de normas YPF',                 fecha: '04/09/2025', destacado: true },
    { texto: 'Rechazo normativa',                    fecha: '03/09/2025' },
    { texto: 'Cambio de estado, Pendiente',          fecha: '02/09/2025' },
    { texto: 'Aceptación norma',                     fecha: '01/09/2025' },
    { texto: 'Edición de insumo: 1,4-DIOXANO',       fecha: '31/08/2025' },
    { texto: 'Carga de documento FDS',               fecha: '30/08/2025' },
    { texto: 'Actualización de fabricante: MERCK',   fecha: '29/08/2025' },
    { texto: 'Nuevo insumo creado: Propylene Glycol',fecha: '28/08/2025' }
  ];

   certificadosResumen: CertificadoResumenItem[] = [
    {
      producto: '1,4-DIOXANO',
      certificado: 'AFVT_RNPUD 05204/78-21-12-2025.pdf',
      fechaExpiracion: '2025-12-21',
      estado: 'vigente'
    },
    {
      producto: '1-HEPTANOL',
      certificado: 'AFVT_RNPUD 05205/78-19-11-2025.pdf',
      fechaExpiracion: '2025-11-19',
      estado: 'vigente'
    },
    {
      producto: 'Ácido Nítrico 65%',
      certificado: 'AFVT_RNPUD 05206/78-05-10-2024.pdf',
      fechaExpiracion: '2024-10-05',
      estado: 'vencido'
    },
    {
      producto: 'Propylene Glycol',
      certificado: 'AFVT_RNPUD 05207/78-14-02-2025.pdf',
      fechaExpiracion: '2025-02-14',
      estado: 'vigente'
    }
  ];


}
