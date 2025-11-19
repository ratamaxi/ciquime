import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CertState, DocumentoForm } from 'src/app/interfaces/certificados.interfaces';
import { DescargasService, EditarCertPayload } from 'src/app/services/descargas.service';

@Component({
  selector: 'app-editar-certificado-calidad',
  standalone: true,
  templateUrl: './editar-certificado-calidad.component.html',
  styleUrls: ['./editar-certificado-calidad.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class EditarCertificadoCalidadComponent implements OnInit {

  // UI
  public ready = false;
  public badgeText = '';
  public numeroOriginal = '--';
  public fabricante = '-';

  public form: FormGroup = this.fb.group({
    certificadoPorDocumento: [true, Validators.required],
    avisoEn: [30, Validators.required],
    doc1Vencimiento: [''],
    doc2Vencimiento: [''],
  });

  public documentos: DocumentoForm[] = [
    { nombre: '', vencimiento: '' },
    { nombre: '', vencimiento: '' },
  ];

  private certState?: CertState;
  private materiaId = 0;
  private usuarioId = Number(localStorage.getItem('idUser') || 0);
  private fileDoc1: File | null = null;
  private fileDoc2: File | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly descargasService: DescargasService,
  ) { }

  public ngOnInit(): void {
    // viene desde la lista con: [state]="{ cert: registro }"
    const st = (history.state?.cert as any) ?? undefined;

    // >>> si viene materia_id en el state, úsalo:
    this.materiaId = Number(st?.materia_id || 0);

    // Si no hay nada útil (por ejemplo, refrescaron la página), volvemos a la lista
    if (!st || (!st.producto && !st.numeroInterno && !st.extraname)) {
      this.router.navigate(['/panel/certificados-calidad']);
      return;
    }
    this.certState = st;

    // Producto en el badge
    this.badgeText = (st.producto ?? '').toString().trim();

    // Número Original: soporte crudo y UI
    this.numeroOriginal =
      (st.extraname ??
        st.numeroInterno ??
        '--')?.toString();

    this.fabricante =
      (st.fabricante ??
        st.razonSocial ??
        st.supplier ??
        '-')?.toString();

    this.documentos[0].nombre = (st.nombre_calidoc ?? st.certificado ?? '') || '';
    this.documentos[1].nombre = (st.nombre_calidoc2 ?? st.certificado2 ?? '') || '';

    const vencDoc1 =
      this.toYyyyMmDd(st.fechacalidad) ??
      this.toYyyyMmDd(st.fechaExpedicion) ??
      this.toYyyyMmDd(st.fechaExpiracion) ??
      '';
  const vencDoc2 =
  this.toYyyyMmDd(st.fechacalidad2) ??
  this.toYyyyMmDd(st.fechaExpiracion) ??
  '';

    const aviso = this.normAviso(st.aviso);
    this.form.patchValue({
      certificadoPorDocumento: true,
      avisoEn: aviso,
      doc1Vencimiento: vencDoc1,
      doc2Vencimiento: vencDoc2,
    });

    this.ready = true;
  }

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

    const { certificadoPorDocumento, avisoEn, doc1Vencimiento, doc2Vencimiento } =
      this.form.getRawValue();

    const payload: EditarCertPayload = {
      materiaId: this.materiaId,
      usuarioId: this.usuarioId,
      cali: !!certificadoPorDocumento,
      avisoEn: Number(avisoEn) as 30 | 60 | 90,
      doc1Vencimiento: doc1Vencimiento || '',
      doc2Vencimiento: doc2Vencimiento || '',
      oldNombreCalidoc: this.documentos[0].nombre || '',
      oldNombreCalidoc2: this.documentos[1].nombre || '',
      doc1: this.fileDoc1,
      doc2: this.fileDoc2,
    };

    this.descargasService.editarCertificadosCalidad(payload).subscribe({
      next: () => {
        this.router.navigate(['/panel/certificados-calidad']);
      },
      error: (e) => {
        console.error('Error al guardar', e);
      },
    });
  }

  // --------- Utils ---------
  private toYyyyMmDd(v?: string | null): string | null {
    if (!v) return null;

    // 1) Si ya viene en YYYY-MM-DD o YYYY/MM/DD
    const iso = v.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
    if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

    // 2) Limpio sufijos tipo "(hora estándar de Argentina)"
    const cleaned = v.replace(/\s*\(.+\)$/, '').trim();

    // 3) Intento parseo directo
    let d = new Date(cleaned);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);

    // 4) dd/mm/yyyy o dd-mm-yyyy
    const dmy = cleaned.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (dmy) {
      const dd = Number(dmy[1]), mm = Number(dmy[2]) - 1, yyyy = Number(dmy[3]);
      d = new Date(yyyy, mm, dd);
      if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }

    // 5) Formatos con mes en texto: "Sep 03 2022", "03 Sep 2022", etc.
    const mmm = cleaned.match(/([A-Za-z]{3,})\s+(\d{1,2}),?\s+(\d{4})|(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
    if (mmm) {
      const months: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      const monTxt = (mmm[1] || mmm[5] || '').slice(0, 3).toLowerCase();
      const mon = months[monTxt];
      const day = Number(mmm[2] || mmm[4]);
      const year = Number(mmm[3] || mmm[6]);
      if (mon !== undefined) {
        d = new Date(year, mon, day);
        if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      }
    }
    return null;
  }

  public onFileSelected(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (index === 0) {
      this.fileDoc1 = file;
      this.documentos[0].nombre = file ? file.name : this.documentos[0].nombre;
    } else {
      this.fileDoc2 = file;
      this.documentos[1].nombre = file ? file.name : this.documentos[1].nombre;
    }
  }

  private normAviso(v?: number): 30 | 60 | 90 {
    const n = Number(v);
    if (n === 60) return 60;
    if (n === 90) return 90;
    return 30;
  }
}
