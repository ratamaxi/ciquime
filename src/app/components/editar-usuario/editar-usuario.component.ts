import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from "sweetalert2";

interface UsuarioApiData {
  id: number;
  nombre: string;
  mail: string;
  alias: string | null;
}

interface UsuarioFormValue {
  nombre: string;
  alias: string;
  contrasena: string;
  correo: string;
}

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class EditarUsuarioComponent implements OnInit {
  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    alias: [''],
    contrasena: ['', [Validators.minLength(6)]], // opcional: solo validar si se completa
    correo: ['', [Validators.required, Validators.email]],
  });

  // El usuario cargado (para el encabezado)
  usuario?: UsuarioApiData;

  // Estados UI
  loading = false;
  saving = false;
  error: string | null = null;

  // id de la ruta
  private id!: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.id) {
      this.error = 'ID de usuario inválido.';
      return;
    }
    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    this.loading = true;
    this.error = null;

    // Tu backend: GET /api/descargas/info/usuario/:id
    this.usuarioService.getDataUsuario(this.id).subscribe({
      next: (resp: any) => {
        const d: UsuarioApiData | undefined = resp?.data;
        if (!d) {
          this.error = 'No se encontró el usuario.';
          this.loading = false;
          return;
        }

        this.usuario = d;
        // Parchar el form con los nombres adecuados
        this.form.patchValue({
          nombre: d.nombre ?? '',
          alias: d.alias ?? '',
          correo: d.mail ?? '',
          contrasena: '' // vacío por seguridad
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

    // Validación básica
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue() as UsuarioFormValue;

    // Armamos payload para el backend
    const payload = {
      correo: raw.correo?.trim() ?? '',
      alias: raw.alias?.trim() || null,            // si está vacío -> null
      contrasena: raw.contrasena?.trim() || undefined, // si está vacío -> no se envía
    };

    this.saving = true;
    this.error = null;

    this.usuarioService.updateUsuario(this.usuario.id, payload).subscribe({
      next: () => {
        this.saving = false;
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
