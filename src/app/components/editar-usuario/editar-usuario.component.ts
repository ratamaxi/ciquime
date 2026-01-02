import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from "sweetalert2";
import { SpinnerComponent } from '../spinner/spinner.component';
import { UsuarioApiData, UsuarioFormValue } from 'src/app/interfaces/user.interface';

type EditarUsuarioNavState = { usuarioId?: number | string };

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SpinnerComponent],
})
export class EditarUsuarioComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    alias: [''],
    contrasena: ['', [Validators.minLength(6)]], // opcional: solo validar si se completa
    correo: ['', [Validators.required, Validators.email]],
  });

  public usuario?: UsuarioApiData;
  public loading = false;
  public saving = false;
  public error: string | null = null;
  private id: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly usuarioService: UsuarioService
  ) { }

  public ngOnInit(): void {
    this.id = this.resolveUsuarioId();
    if (!this.id) {
      this.error = 'ID de usuario inválido.';
      return;
    }
    this.cargarUsuario();
  }

  private resolveUsuarioId(): string {
    const state = this.getNavigationState<EditarUsuarioNavState>();
    const id = state?.usuarioId;
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

  private cargarUsuario(): void {
    this.loading = true;
    this.error = null;

    this.usuarioService.getDataUsuario(this.id).subscribe({
      next: (resp: any) => {
        const d: UsuarioApiData | undefined = resp?.data;
        if (!d) {
          this.error = 'No se encontró el usuario.';
          this.loading = false;
          return;
        }

        this.usuario = d;
        this.form.patchValue({
          nombre: d.nombre ?? '',
          alias: d.alias ?? '',
          correo: d.mail ?? '',
          contrasena: ''
        });

        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo cargar el usuario.';
        this.loading = false;
      }
    });
  }

  public guardar(): void {
    if (!this.usuario) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue() as UsuarioFormValue;
    const payload = {
      correo: raw.correo?.trim() ?? '',
      alias: raw.alias?.trim() || null,
      contrasena: raw.contrasena?.trim() || undefined,
    };

    this.saving = true;
    this.error = null;

    this.usuarioService.updateUsuario(this.usuario.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.usuarioService.refresh();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Listo!',
          text: 'Usuario modificado.',
          showConfirmButton: false,
          timer: 2500
        });
        this.router.navigate(['/panel/data-user']);
      },
      error: (e) => {
        console.error(e);
        this.saving = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '¡Ups!',
          text: 'No se pudo guardar el usuario',
          showConfirmButton: false,
          timer: 2500
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/panel/data-user']);
  }
}
