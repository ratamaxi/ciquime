import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { ApiInsumo, ApiProducto, ApiResp, EditarInsumoRequest, Estado, SectorInsumoResponse, SectorInsumoResponseData } from 'src/app/interfaces/registros.interface';
import { FixUtf8Pipe } from 'src/app/pipe/string.pipe';
import Swal from "sweetalert2";
import { RegistrosService } from 'src/app/services/registros.service';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

type EditarInsumoNavState = { materiaId?: string | number };

@Component({
  selector: 'app-editar-insumo',
  templateUrl: './editar-insumo.component.html',
  styleUrls: ['./editar-insumo.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FixUtf8Pipe, RouterModule, SpinnerComponent],
})
export class EditarInsumoComponent implements OnInit {
  public form: FormGroup;
  public saving = false;
  public loading = false;
  public errorMsg = '';
  public editarCampos: boolean = false
  public sectores: SectorInsumoResponseData[] = [];
  public valoracionesApi = ['A', 'B', 'C', 'D'];
  private empresaId: string = localStorage.getItem('id_empresa') ?? '';
  private idUser: string = localStorage.getItem('idUser') ?? '';
  private materiaId: string = '';

  constructor(
    private fb: FormBuilder,
    private registros: RegistrosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombreOriginal: [{ value: '', disabled: false }],
      fabricante: [{ value: '', disabled: false }],
      nombreInterno: ['', [Validators.required, Validators.minLength(2)]],
      sector: [''],
      rnpq: [false],
      lote: [''],
      presentacion: [''],
      valoracionApi: [''],
      notasUsuario: [''],
      ipel: [1, [Validators.min(1), Validators.max(5)]],
      codigoAprobacion: [''],
      codigoConsejo: [''],
      notasAdmin: [''],
      estado: ['pendiente' as Estado, [Validators.required]],
    });
    this.registros.obtenerDataSectorInsumo(this.empresaId).pipe(take(1)).subscribe({
      next: (resp: SectorInsumoResponse) => {
        this.sectores = resp.data
      },
      error: () => this.sectores = []
    });
    this.materiaId = this.resolveMateriaId();
  }

  ngOnInit() {
    if (!this.materiaId || !this.empresaId || !this.idUser) {
      this.errorMsg = 'Faltan identificadores para cargar el insumo.';
      return;
    }

    this.loading = true;
    this.registros
      .obtenerDataEditarUsuario(this.materiaId, this.empresaId, this.idUser)
      .subscribe({
        next: (resp: ApiResp) => {
          if (!resp?.ok) {
            this.errorMsg = resp?.msj || 'No se pudo obtener la información del insumo.';
            return;
          }
          this.patchFromApi(resp);
          this.lockReadOnlyFields(); // ← deshabilitamos los campos pedidos
        },
        error: (err) => {
          console.error('obtenerDataEditarUsuario error:', err);
          this.errorMsg = err?.message || 'Error al consultar los datos.';
        },
        complete: () => (this.loading = false),
      });
  }

  // ---------- helpers de mapeo ----------
  private mapEstadoApiToForm(estadoApi?: string): Estado {
    const e = (estadoApi || '').toLowerCase();
    if (e.includes('APROB')) return 'APROBADO';
    if (e.includes('RECHAZ')) return 'RECHAZADO';
    return 'PENDIENTE';
  }

  private siNoToBool(v?: string | boolean | null): boolean {
    if (typeof v === 'boolean') return v;
    return String(v || '').toUpperCase() === 'SI';
  }

  private normValoracionApi(v?: string | null): string {
    const val = (v || '').toUpperCase();
    return this.valoracionesApi.includes(val) ? val : '';
  }

  private patchFromApi(resp: ApiResp) {
    const ins = resp.insumo || ({} as ApiInsumo);
    const prod = resp.producto || ({} as ApiProducto);

    this.form.patchValue({
      nombreOriginal: prod.nombre_producto ?? '',
      fabricante: prod.fabricante ?? '',
      nombreInterno: ins.extraname ?? '',
      sector: ins.sector ?? '',
      rnpq: this.siNoToBool(prod.RNPQ),
      lote: ins.lote ?? '',
      presentacion: ins.presentacion ?? '',
      valoracionApi: this.normValoracionApi(ins.api ?? ''),
      notasUsuario: ins.nota ?? '',
      codigoAprobacion: ins.apr_code ?? '',
      codigoConsejo: ins.nombre_calidoc ?? '',
      notasAdmin: ins.nota_adm ?? '',
      estado: this.mapEstadoApiToForm(ins.estado),
    });
  }

  /** Deshabilita los campos: Valoración API, RNPQ, iPel y Estado */
  private lockReadOnlyFields() {
    this.f['valoracionApi'].disable({ emitEvent: false });
    this.f['rnpq'].disable({ emitEvent: false });
    this.f['ipel'].disable({ emitEvent: false });
    this.f['estado'].disable({ emitEvent: false });
  }

  // ---------- getters y setters UI ----------
  public get f() {
    return this.form.controls;
  }

  public setRNPQ(val: boolean) {
    if (this.f['rnpq'].disabled) return; // guard
    this.form.patchValue({ rnpq: val });
  }

  public setIPel(n: number) {
    if (this.f['ipel'].disabled) return; // guard
    this.form.patchValue({ ipel: n });
  }

  public abrirHojaSGA() {
    console.log('Abrir Hoja de Clasificación SGA');
  }

  public abrirConsejo() {
    console.log('Abrir Consejo de Aprobación');
  }

  public onCancel() {
    this.form.markAsPristine();
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const v = this.form.getRawValue(); // incluye deshabilitados
    const payload = {
      matempresa: this.materiaId,
      empresa_id: this.empresaId,
      usuario_id: this.idUser,
      extraname: v.nombreInterno,
      sector: v.sector,
      lote: v.lote,
      presentacion: v.presentacion,
      api: v.valoracionApi || null,
      nota: v.notasUsuario,
      apr_code: v.codigoAprobacion,
      nombre_calidoc: v.codigoConsejo,
      nota_adm: v.notasAdmin,
      estado: (v.estado as Estado).toUpperCase(),
    };
    setTimeout(() => (this.saving = false), 600);
  }

  public get isDisabled(): boolean {
    return true
  }

  public editarInsumo(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const v = this.form.getRawValue(); // incluye deshabilitados
    const toNull = (x: any) => {
      const s = (x ?? '').toString().trim();
      return s.length ? s : null;
    };

    // ⚠️ materia_id llega desde el state de navegación
    const body: EditarInsumoRequest = {
      materia_id: this.materiaId,
      extraname: toNull(v.nombreInterno),
      presentacion: toNull(v.presentacion),
      sector: toNull(v.sector),
      lote: toNull(v.lote),
      nota: toNull(v.notasUsuario),
    };

    this.registros.modificarInsumo(body).pipe(take(1)).subscribe({
      next: () => {
        this.saving = false;
        this.form.markAsPristine();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Listo!',
          text: 'Inusmo modificado correctamente',
          showConfirmButton: false,
          timer: 2500
        });
        this.router.navigate(['/panel/ver-insumo'])
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error al guardar los cambios.';
        console.error('modificarInsumo error:', err);
      }
    });
  }

  private resolveMateriaId(): string {
    const state = this.getNavigationState<EditarInsumoNavState>();
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
