import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type EstadoInsumo = 'aprobado' | 'pendiente' | 'rechazado';

@Component({
  selector: 'app-editar-insumo',
  templateUrl: './editar-insumo.component.html',
  styleUrls: ['./editar-insumo.component.scss'],
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule]
})
export class EditarInsumoComponent {
form: FormGroup;
  saving = false;

  // catálogos mock
  sectores = ['Producción', 'Laboratorio', 'Depósito', 'Calidad'];
  valoracionesApi = ['A', 'B', 'C', 'D'];

  constructor(private fb: FormBuilder) {
    // mock de carga de registro
    const mock = {
      nombreOriginal: 'ETER DE PETROLEO',
      fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.',
      nombreInterno: '',
      sector: '',
      rnpq: false,
      lote: '',
      presentacion: '',
      valoracionApi: '',
      notasUsuario: '',
      ipel: 1,
      codigoAprobacion: '',
      codigoConsejo: '',
      notasAdmin: '',
      estado: 'aprobado' as EstadoInsumo,
    };

    this.form = this.fb.group({
      nombreOriginal: [{ value: mock.nombreOriginal, disabled: false }],
      fabricante: [{ value: mock.fabricante, disabled: false }],
      nombreInterno: [mock.nombreInterno, [Validators.required, Validators.minLength(2)]],
      sector: [mock.sector],
      rnpq: [mock.rnpq],
      lote: [mock.lote],
      presentacion: [mock.presentacion],
      valoracionApi: [mock.valoracionApi],
      notasUsuario: [mock.notasUsuario],
      ipel: [mock.ipel, [Validators.min(1), Validators.max(5)]],
      codigoAprobacion: [mock.codigoAprobacion],
      codigoConsejo: [mock.codigoConsejo],
      notasAdmin: [mock.notasAdmin],
      estado: [mock.estado, [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  setRNPQ(val: boolean) {
    this.form.patchValue({ rnpq: val });
  }

  setIPel(n: number) {
    this.form.patchValue({ ipel: n });
  }

  abrirHojaSGA() {
    // Stub: acá abrirías modal / navegación
    console.log('Abrir Hoja de Clasificación SGA');
  }

  abrirConsejo() {
    // Stub: acá abrirías modal / navegación
    console.log('Abrir Consejo de Aprobación');
  }

  onCancel() {
    // Stub: volver o limpiar
    console.log('Cancelar edición');
    this.form.markAsPristine();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = this.form.getRawValue(); // incluye readonly
    // Realizar request...
    console.log('Guardar', payload);

    // Simulación de guardado
    setTimeout(() => {
      this.saving = false;
      // notificación / navegación
    }, 800);
  }
}
