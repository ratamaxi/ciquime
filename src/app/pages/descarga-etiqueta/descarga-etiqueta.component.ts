import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { TablaDescargarComponent } from 'src/app/components/tabla-descargar/tabla-descargar.component';
import { FdsDataResponse, FdsResponse } from 'src/app/interfaces/descargas.interface';
import { RegistrosService } from 'src/app/services/registros.service';
import { UserData, UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-descarga-etiqueta',
  templateUrl: './descarga-etiqueta.component.html',
  styleUrls: ['./descarga-etiqueta.component.scss'],
  standalone: true,
  imports: [CommonModule, TablaDescargarComponent]
})
export class DescargaEtiquetaComponent implements OnInit {
  public materiasPrimas: FdsDataResponse[] = [];
  public usuarioData: number = 0;

  constructor(
    private registros: RegistrosService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.usuarioService.user$.pipe(
      take(1),
      switchMap((u: UserData) => this.registros.obtenerDataFds(u.id_usuario))
    )
      .subscribe({
        next: (resp: FdsResponse) => {
          this.materiasPrimas = resp.data ?? [];
        },
        error: (err) => {
          console.error('Error cargando materias primas', err);
        }
      });
  }

}
