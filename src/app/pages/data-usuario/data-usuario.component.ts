import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-usuario',
  templateUrl: './data-usuario.component.html',
  styleUrls: ['./data-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DataUsuarioComponent {

  public busqueda: string = '';

  public filtrarUsuarios():void{}
  public editUser():void{}

  public mockUsuario = [
    {
    user: 'Usuario2',
    email: 'dgotelli@yahoo.com',
  },
  {
    user: 'Usuario2',
    email: 'dgotelli@yahoo.com',
  },
  {
    user: 'Usuario2',
    email: 'dgotelli@yahoo.com',
  }
]

}
