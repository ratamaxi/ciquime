import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import Swal from "sweetalert2";

type Tile = {
  id: string;
  title: string;
  icon: 'frasco' | 'bidon' | 'tambor' | 'ibc' | 'cartel';
  group: 'capacidad' | 'formato';
};

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EtiquetasComponent {
 /** Dispara el id del tile seleccionado (si querés navegar o abrir un modal). */
  @Output() select = new EventEmitter<string>();

  // Mocks (podés cambiar títulos/ids a gusto)
  capacidadTiles: Tile[] = [
    { id: 'cap-0-3l',  title: 'Menos de 3 litros',  icon: 'frasco', group: 'capacidad' },
    { id: 'cap-3-50l', title: 'De 3 a 50 litros',   icon: 'bidon',  group: 'capacidad' },
    { id: 'cap-50-500l', title: 'De 50 a 500 litros', icon: 'tambor', group: 'capacidad' },
    { id: 'cap-mas-500l', title: 'Mas de 500 litros', icon: 'ibc',    group: 'capacidad' },
    { id: 'cap-cartel', title: 'Cartel para instalaciones', icon: 'cartel', group: 'capacidad' },
  ];

  formatoTiles: Tile[] = [
    { id: 'fmt-9x6',    title: 'Modelo 9x6',     icon: 'frasco', group: 'formato' },
    { id: 'fmt-10-5x8', title: 'Modelo 10.5x8',  icon: 'bidon',  group: 'formato' },
    { id: 'fmt-15x10-5', title: 'Modelo 15x10.5', icon: 'tambor', group: 'formato' },
    { id: 'fmt-20x14-8', title: 'Modelo 20x14.8', icon: 'ibc',    group: 'formato' },
    { id: 'fmt-21x29',   title: 'Modelo 21x29',   icon: 'cartel', group: 'formato' },
  ];

  onSelect(id: string) {
    this.select.emit(id);
    // Acá podrías hacer: this.router.navigate(['/etiquetas', id])
  }

  trackById = (_: number, t: Tile) => t.id;

  public imprimirEtiquetas():void{
     Swal.fire({
      title: `Atención`,
      text: "Recuerde comprobar los datos y el QR antes de imprimir masivamente las etiquetas!",
      icon: 'question',
      showCancelButton: false,
      confirmButtonColor: '#0d6efd',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })

  }
}
