import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { RegistrosService } from 'src/app/services/registros.service';
import { UsuarioService } from 'src/app/services/usuario.service';

type TipoRegistro = 'nuevo' | 'actualizacion';
type Visualizacion = 'privado' | 'publico';

@Component({
  selector: 'app-registro-insumo',
  templateUrl: './registro-insumo.component.html',
  styleUrls: ['./registro-insumo.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [RegistrosService]
})
export class RegistroInsumoComponent implements OnInit {

  public form: FormGroup;
  public fabricantes :Array<{ id: number, nombre: string }> = [];
  public nombreArchivo?: string;
  public loading = false;

  private currentUserId: number | null = null;
  private empresaId: string | null = localStorage.getItem('id_empresa');
  private usuarioId: string | null = localStorage.getItem('idUser');

  constructor(
    private fb: FormBuilder,
    private registros: RegistrosService,
    private usuarios: UsuarioService,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      fabricante: [null, Validators.required],
      revisionFds: [''],
      fechaFds: [''],
      archivoFds: [null, Validators.required],
      tipoRegistro: <TipoRegistro>'nuevo',
      visualizacion: <Visualizacion>'privado',
    });
  }

  public ngOnInit(): void {
    // User ID desde tu servicio
    this.usuarios.userId$.subscribe(id => this.currentUserId = id ?? null);

    // 1) Intento con localStorage
    const empStr = localStorage.getItem('id_empresa');
    this.empresaId = empStr ? empStr : null;

    // 2) Si sigue null, intento decodificando el JWT
    if (this.empresaId == null) this.setEmpresaFromToken();

    this.usuarios.getEmpresas().subscribe(list => {
      this.fabricantes = list.map((e: any) => ({ id: e.id, nombre: e.noemp }));
    });
  }

  get f() { return this.form.controls; }
  get invalid() { return this.form.invalid; }

  public onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.form.patchValue({ archivoFds: file });
    this.nombreArchivo = file ? file.name : undefined;
  }

  public onCancel() {
    // reset conservando valores por defecto
    this.form.reset({
      nombre: '',
      fabricante: null,
      revisionFds: '',
      fechaFds: '',
      archivoFds: null,
      tipoRegistro: 'nuevo',
      visualizacion: 'privado'
    });
    this.nombreArchivo = undefined;
  }

public onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Completá los campos requeridos y adjuntá el PDF.' });
    return;
  }

  if (this.currentUserId == null) {
    Swal.fire({ icon: 'error', title: 'Sesión', text: 'No se encontró el usuario autenticado.' });
    return;
  }

  const raw = this.form.getRawValue();

  // Validación de fabricante
  const fabricanteId = Number(raw.fabricante);
  if (!Number.isFinite(fabricanteId) || fabricanteId <= 0) {
    Swal.fire({ icon: 'error', title: 'Fabricante', text: 'Seleccioná un fabricante válido.' });
    return;
  }

  // Debe venir un PDF
  const pdf: File | null = raw.archivoFds;
  if (!pdf) {
    Swal.fire({ icon: 'warning', title: 'PDF obligatorio', text: 'Adjuntá el documento FDS (PDF).' });
    return;
  }

  // Normalizaciones
  const revFDS = String(raw.revisionFds || '').replace(',', '.');
  const visual = raw.visualizacion === 'publico' ? '1' : '0'; // 1 público / 0 privado

  // Armamos FormData (¡no setear Content-Type!)
  const fd = new FormData();
  fd.append('archivoFds', pdf, pdf.name);
  fd.append('id_empresa', String(this.empresaId));
  fd.append('id_usuario', String(this.currentUserId)); // también va en la URL
  fd.append('nombre', raw.nombre);
  fd.append('fabricante', String(fabricanteId));
  fd.append('revisionFDS', revFDS);
  fd.append('fechaFDS', raw.fechaFds || '');           // admite DD/MM/YYYY
  fd.append('visual', visual);                         // '1' | '0'
  if (raw.sector) fd.append('sector', raw.sector);
  fd.append('procesado', '0');
  fd.append('api', '1');
  if (raw.tipoRegistro) fd.append('tipoRegistro', raw.tipoRegistro);
  // Observación/comentario opcional para el campo "registro" (AD)
  if (raw.comentario) fd.append('AD', raw.comentario);

  this.loading = true;

  this.registros
    .crearInsumo(this.currentUserId, fd)  // <-- ahora envía FormData
    .subscribe({
      next: (resp: any) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Insumo registrado',
          text: 'El insumo fue guardado correctamente.',
          timer: 2200,
          showConfirmButton: false
        });
        this.onCancel();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.message || 'No se pudo registrar el insumo.'
        });
      }
    });
}

  public onBack(): void {
    // navegar o cerrar modal si corresponde
  }

  // -------- Helpers --------
  /** Intenta obtener id_empresa del JWT guardado en localStorage('token'). */
  private setEmpresaFromToken(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = this.decodeJwt(token);
      // probamos diferentes nombres por compatibilidad
      const eid = payload?.id_empresa ?? payload?.id_empresa ?? payload?.empresaId;
      if (eid != null) this.empresaId = eid;
    } catch {
      // ignora errores de decodificación
    }
  }

  /** Decodifica (sin verificar) un JWT y devuelve el payload. */
  private decodeJwt(token: string): any {
    const [, payload] = token.split('.');
    return JSON.parse(
      decodeURIComponent(
        atob(payload)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
  }
}
