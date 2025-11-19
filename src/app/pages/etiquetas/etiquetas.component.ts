import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DescargasService } from 'src/app/services/descargas.service';
import Swal from "sweetalert2";

type Tile = {
  id: string;
  title: string;
  icon: 'frasco' | 'bidon' | 'tambor' | 'ibc' | 'cartel';
  group: 'capacidad' | 'formato';
  etiquetaType: string;
};

type EtiquetasNavState = { materiaId?: string | number };

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.scss'],
  standalone: true,
  imports: [CommonModule]
})

export class EtiquetasComponent {
  private materiaId: string = '';

  constructor(
    private readonly descargasService: DescargasService,
    private readonly router: Router
  ) {
    this.materiaId = this.resolveMateriaId();
  }

  // Mocks (podés cambiar títulos/ids a gusto)
  public capacidadTiles: Tile[] = [
    { id: 'cap-0-3l', title: 'Menos de 3 litros', icon: 'frasco', group: 'capacidad', etiquetaType: '3l' },
    { id: 'cap-3-50l', title: 'De 3 a 50 litros', icon: 'bidon', group: 'capacidad', etiquetaType: '50l' },
    { id: 'cap-50-500l', title: 'De 50 a 500 litros', icon: 'tambor', group: 'capacidad', etiquetaType: '500l' },
    { id: 'cap-mas-500l', title: 'Mas de 500 litros', icon: 'ibc', group: 'capacidad', etiquetaType: 'mas500l' },
    { id: 'cap-cartel', title: 'Cartel para instalaciones', icon: 'cartel', group: 'capacidad', etiquetaType: 'cartel' },
  ];

  public formatoTiles: Tile[] = [
    { id: 'fmt-9x6', title: 'Modelo 9x6', icon: 'frasco', group: 'formato', etiquetaType: 'xs' },
    { id: 'fmt-10-5x8', title: 'Modelo 10.5x8', icon: 'bidon', group: 'formato', etiquetaType: 's' },
    { id: 'fmt-15x10-5', title: 'Modelo 15x10.5', icon: 'tambor', group: 'formato', etiquetaType: 'm' },
    { id: 'fmt-20x14-8', title: 'Modelo 20x14.8', icon: 'ibc', group: 'formato', etiquetaType: 'l' },
    { id: 'fmt-21x29', title: 'Modelo 21x29', icon: 'cartel', group: 'formato', etiquetaType: 'xl' },
  ];

  public trackById = (_: number, t: Tile) => t.id;

  public openEtiquetaNormal(type: string) {
    Swal.fire({
      title: `Atención`,
      text: "Recuerde comprobar los datos y el QR antes de imprimir masivamente las etiquetas!",
      icon: 'question',
      showCancelButton: false,
      confirmButtonColor: '#0d6efd',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = this.descargasService.getEtiquetaGenerica(this.materiaId, type);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    })
  }

  private resolveMateriaId(): string {
    const state = this.getNavigationState<EtiquetasNavState>();
    const id = state?.materiaId;
    if (typeof id === 'number') return id.toString();
    if (typeof id === 'string') return id;
    return '';
  }

  private getNavigationState<T>(): T | undefined {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      return nav.extras.state as T;
    }
    if (typeof history !== 'undefined') {
      return history.state as T;
    }
    return undefined;
  }
}
