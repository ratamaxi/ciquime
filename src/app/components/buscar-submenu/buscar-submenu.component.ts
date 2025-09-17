import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SubmenuItem {
  label: string;
  link: string;
  icon: string;
  iconActive: string
}

@Component({
  selector: 'app-buscar-submenu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buscar-submenu.component.html',
  styleUrls: ['./buscar-submenu.component.scss'],
})
export class BuscarSubmenuComponent {
  public items: SubmenuItem[] = [
    { label: 'Buscar',            link: '/panel/buscar-insumos', icon: '../../../assets/img/papelBlanco.png',     iconActive: '../../../assets/img/papelByN.png' },
    { label: 'Crear',             link: '/panel/registro-insumo', icon: '../../../assets/img/papelSumarBlanco.png', iconActive: '../../../assets/img/papelSumarByN.png' },
    { label: 'Ver/Editar',        link: '/panel/ver-insumo',       icon: '../../../assets/img/quimicaBlanco.png',   iconActive: '../../../assets/img/quimicaByN.png' },
    { label: 'Descargar HSO',     link: '/panel/descarga-hso',             icon: '../../../assets/img/archivoBlanco.png',   iconActive: '../../../assets/img/archivoByN.png' },
    { label: 'Descargar FET',     link: '/panel/descarga-fet',       icon: '../../../assets/img/archivoBlanco.png',   iconActive: '../../../assets/img/archivoByN.png' },
    { label: 'Descargar FDS',     link: '/panel/descarga-fds',       icon: '../../../assets/img/archivoBlanco.png',   iconActive: '../../../assets/img/archivoByN.png' },
    { label: 'Imprimir Etiqueta', link: '/panel/descarga-etiqueta',        icon: '../../../assets/img/etiquetaBlanco.png',  iconActive: '../../../assets/img/etiquetaByN.png' },
    { label: 'Consulta SGA',      link: '/panel/sga',              icon: '../../../assets/img/consultaBlanco.png',  iconActive: '../../../assets/img/consultaByN.png' },
  ];

  public iconFor(item: SubmenuItem, active: boolean) {
    return active && item.iconActive ? item.iconActive : item.icon;
  }
}


