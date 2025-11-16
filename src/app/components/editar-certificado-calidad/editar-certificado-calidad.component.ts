import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

type Estado = 'vigente' | 'vencido';

interface CertState {
  usuario_id?: number;
  producto?: string;                  // <- PARA EL BADGE
  extraname?: string | null;          // número original (si lo tienen así)
  nombre_calidoc?: string | null;
  fechacalidad?: string;              // fecha de expedición (legacy)
  aviso?: number;
  estado?: Estado;
  diasRestantes?: number;
  fabricante?: string | null;         // si tu back lo agrega después
}

interface DocumentoForm {
  nombre: string;
  vencimiento: string;
}

@Component({
  selector: 'app-editar-certificado-calidad',
  standalone: true,
  templateUrl: './editar-certificado-calidad.component.html',
  styleUrls: ['./editar-certificado-calidad.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class EditarCertificadoCalidadComponent implements OnInit {

  public ready = false;
  public badgeText = '';
  public numeroOriginal = '--';
  public fabricante = '-';

  public form: FormGroup = this.fb.group({
    certificadoPorDocumento: [null, Validators.required],
    vencimientoCertificado: ['', Validators.required],
    doc1Vencimiento: [''],
    doc2Vencimiento: [''],
  });

  public documentos: DocumentoForm[] = [
    { nombre: '', vencimiento: '' },
    { nombre: '', vencimiento: '' },
  ];

  private certState?: CertState;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

public ngOnInit(): void {
  const st = history.state?.cert as any | undefined;

  const numeroParam = this.route.snapshot.paramMap.get('numero');

  this.numeroOriginal =
    (numeroParam ?? st?.numeroInterno ?? st?.extraname ?? '--').toString();

  this.fabricante = (st?.fabricante ?? st?.proveedor ?? '-').toString();

  this.badgeText = (st?.producto ?? '').toString().trim();
  if (!this.badgeText) {
    this.router.navigate(['/panel/certificados-calidad']);
    return;
  }

  this.form.patchValue({
    certificadoPorDocumento: true,
    vencimientoCertificado: this.toYyyyMmDd(st?.fechacalidad) || '',
    doc1Vencimiento: '',
    doc2Vencimiento: '',
  });

  this.ready = true;
}


  // ---------- Handlers UI ----------
  public actualizarDocumento(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.documentos[index].nombre = file ? file.name : '';
  }

  public cancelar(): void {
    this.router.navigate(['/panel/certificados-calidad']);
  }

  public guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      doc1Vencimiento,
      doc2Vencimiento,
      ...rest
    } = this.form.getRawValue();

    const documentos = this.documentos.map((d, i) => ({
      ...d,
      vencimiento: i === 0 ? doc1Vencimiento : doc2Vencimiento,
    }));

    // Armá el payload final según tu back
    const payload = {
      producto: this.certState?.producto ?? '',
      numeroOriginal: this.numeroOriginal,
      fabricante: this.fabricante,
      ...rest,
      documentos,
    };

    console.info('Guardar certificado de calidad', payload);
    // acá pegás al backend y luego:
    this.router.navigate(['/panel/certificados-calidad']);
  }

  // ---------- Utils ----------
  private toYyyyMmDd(v?: string): string | null {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }
}
