import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from "src/app/app-routing.module";

type TipoRegistro = 'nuevo' | 'actualizacion';
type Visualizacion = 'privado' | 'publico';

@Component({
  selector: 'app-registro-insumo',
  templateUrl: './registro-insumo.component.html',
  styleUrls: ['./registro-insumo.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegistroInsumoComponent {

  form: FormGroup;
  fabricantes = [
    'MERCK S.A.',
    'SIGMA ALDRICH DE ARGENTINA S.R.L.',
    'CARLO ERBA',
    'ANALYTICA',
  ];

  nombreArchivo?: string;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      fabricante: ['', Validators.required],
      revisionFds: [''],
      fechaFds: [''], // <input type="date"> se encarga del formato
      archivoFds: [null],
      tipoRegistro: <TipoRegistro>'nuevo',
      visualizacion: <Visualizacion>'privado',
    });
  }

  // Accesores cortos para template
  get f() { return this.form.controls; }
  get invalid() { return this.form.invalid; }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    this.form.patchValue({ archivoFds: file ?? null });
    this.nombreArchivo = file ? file.name : undefined;
  }

  onCancel() {
    // reset conservando valores por defecto
    this.form.reset({
      nombre: '',
      fabricante: '',
      revisionFds: '',
      fechaFds: '',
      archivoFds: null,
      tipoRegistro: 'nuevo',
      visualizacion: 'privado'
    });
    this.nombreArchivo = undefined;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Simulamos payload listo para enviar (FormData si hay archivo)
    const raw = this.form.getRawValue();
    const payload = new FormData();
    payload.append('nombre', raw.nombre);
    payload.append('fabricante', raw.fabricante);
    payload.append('revisionFds', raw.revisionFds ?? '');
    payload.append('fechaFds', raw.fechaFds ?? '');
    payload.append('tipoRegistro', raw.tipoRegistro);
    payload.append('visualizacion', raw.visualizacion);
    if (raw.archivoFds) payload.append('archivoFds', raw.archivoFds);

    // TODO: integrar servicio HTTP
    console.log('[RegistroInsumo] Enviando payload…', Object.fromEntries(payload as any));
    alert('Formulario válido. Ver consola para payload.');
  }

   public  onBack(): void {

  }
}
