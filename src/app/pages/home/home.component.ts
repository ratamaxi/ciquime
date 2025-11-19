import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActividadesItemComponent } from 'src/app/components/actividades-item/actividades-item.component';
import { CertificadosResumenComponent } from 'src/app/components/certificados-resumen/certificados-resumen.component';
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
export class HomeComponent {}
