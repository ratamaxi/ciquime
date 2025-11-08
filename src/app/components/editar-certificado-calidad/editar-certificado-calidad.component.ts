import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CertificadoCalidad } from 'src/app/interfaces/descargas.interface';

interface DocumentoForm {
  nombre: string;
  vencimiento: string;
}

export const CERTIFICADOS_CALIDAD_MOCK: CertificadoCalidad[] = [
  {
    numeroInterno: '0001',
    numeroOriginal: '0001-2024',
    producto: '1,4-DIOXANO',
    fabricante: 'MERCK S.A.',
    certificado: 'AFVT_RNPUD 05204/78-21-12-2025.pdf',
    fechaExpedicion: '2024-12-21',
    fechaExpiracion: '2025-12-21',
    estado: 'vigente',
    estadoRegistro: 'APROBADO',
    aniosDeposito: 8,
    certificadoPorDocumento: true,
    vencimientoCertificado: '2025-12-21',
    documentos: [
      {
        id: 'doc1',
        nombre: 'AFVT_RNPUD 05204/78-21-12-2025.pdf',
        vencimiento: '2025-12-21',
      },
      {
        id: 'doc2',
        nombre: 'Analisis_1-4_dioxano_v2.pdf',
        vencimiento: null,
      },
    ],
  },
  {
    numeroInterno: '0002',
    numeroOriginal: '0002-2023',
    producto: '1-HEPTANOL',
    fabricante: 'SOMAR ANDINA S.A.',
    certificado: 'AFVT_RNPUD 05205/78-19-11-2025.pdf',
    fechaExpedicion: '2024-11-19',
    fechaExpiracion: '2025-11-19',
    estado: 'vigente',
    estadoRegistro: 'EN PROCESO',
    aniosDeposito: 5,
    certificadoPorDocumento: false,
    vencimientoCertificado: '2025-11-19',
    documentos: [
      {
        id: 'doc1',
        nombre: 'Hoja_control_heptanol.pdf',
        vencimiento: '2025-06-01',
      },
      {
        id: 'doc2',
        nombre: '',
        vencimiento: null,
      },
    ],
  },
  {
    numeroInterno: '0003',
    numeroOriginal: '0003-2022',
    producto: 'Ácido Nítrico 65%',
    fabricante: 'AROMINA DEL SUR S.A.',
    certificado: 'AFVT_RNPUD 05206/78-05-10-2024.pdf',
    fechaExpedicion: '2023-10-05',
    fechaExpiracion: '2024-10-05',
    estado: 'vencido',
    estadoRegistro: 'OBSERVADO',
    aniosDeposito: 9,
    certificadoPorDocumento: true,
    vencimientoCertificado: '2024-10-05',
    documentos: [
      {
        id: 'doc1',
        nombre: 'AFVT_RNPUD_05206-78.pdf',
        vencimiento: '2024-10-05',
      },
      {
        id: 'doc2',
        nombre: 'Plan_accion_nitrico.pdf',
        vencimiento: '2024-11-30',
      },
    ],
  },
  {
    numeroInterno: '0004',
    numeroOriginal: '0004-2024',
    producto: 'Diisobutil Ftalato',
    fabricante: 'MERCK S.A.',
    certificado: 'AFVT_RNPUD 05207/78-14-08-2025.pdf',
    fechaExpedicion: '2024-08-14',
    fechaExpiracion: '2025-08-14',
    estado: 'vigente',
    estadoRegistro: 'APROBADO',
    aniosDeposito: 3,
    certificadoPorDocumento: true,
    vencimientoCertificado: '2025-08-14',
    documentos: [
      {
        id: 'doc1',
        nombre: 'AFVT_RNPUD_05207-78.pdf',
        vencimiento: '2025-08-14',
      },
      {
        id: 'doc2',
        nombre: '',
        vencimiento: null,
      },
    ],
  },
  {
    numeroInterno: '0005',
    numeroOriginal: '0005-2021',
    producto: 'Agar de contacto (CASO) + TTC (RF2)',
    fabricante: 'AROMINA DEL SUR S.A.',
    certificado: 'AFVT_RNPUD 05208/78-28-07-2025.pdf',
    fechaExpedicion: '2024-07-28',
    fechaExpiracion: '2025-07-28',
    estado: 'vigente',
    estadoRegistro: 'APROBADO',
    aniosDeposito: 6,
    certificadoPorDocumento: true,
    vencimientoCertificado: '2025-07-28',
    documentos: [
      {
        id: 'doc1',
        nombre: 'AFVT_RNPUD_05208-78.pdf',
        vencimiento: '2025-07-28',
      },
      {
        id: 'doc2',
        nombre: 'Reporte_microbiologia.pdf',
        vencimiento: '2025-03-30',
      },
    ],
  },
  {
    numeroInterno: '0006',
    numeroOriginal: '0006-2020',
    producto: 'Propylene Glycol',
    fabricante: 'MERCK S.A.',
    certificado: 'AFVT_RNPUD 05209/78-14-02-2025.pdf',
    fechaExpedicion: '2024-02-14',
    fechaExpiracion: '2025-02-14',
    estado: 'vigente',
    estadoRegistro: 'EN PROCESO',
    aniosDeposito: 4,
    certificadoPorDocumento: true,
    vencimientoCertificado: '2025-02-14',
    documentos: [
      {
        id: 'doc1',
        nombre: 'AFVT_RNPUD_05209-78.pdf',
        vencimiento: '2025-02-14',
      },
      {
        id: 'doc2',
        nombre: '',
        vencimiento: null,
      },
    ],
  },
  {
    numeroInterno: '0007',
    numeroOriginal: '0007-2019',
    producto: 'Tergazyme® Enzyme Detergent',
    fabricante: 'SOMAR ANDINA S.A.',
    certificado: 'AFVT_RNPUD 05210/78-18-03-2024.pdf',
    fechaExpedicion: '2023-03-18',
    fechaExpiracion: '2024-03-18',
    estado: 'vencido',
    estadoRegistro: 'OBSERVADO',
    aniosDeposito: 11,
    certificadoPorDocumento: false,
    vencimientoCertificado: '2024-03-18',
    documentos: [
      {
        id: 'doc1',
        nombre: 'AFVT_RNPUD_05210-78.pdf',
        vencimiento: '2024-03-18',
      },
      {
        id: 'doc2',
        nombre: '',
        vencimiento: null,
      },
    ],
  },
  {
    numeroInterno: '0008',
    numeroOriginal: '0008-2024',
    producto: 'HEPES Free, pH 7.0',
    fabricante: 'MERCK S.A.',
    certificado: 'AFVT_RNPUD 05211/78-01-01-2026.pdf',
    fechaExpedicion: '2025-01-01',
    fechaExpiracion: '2026-01-01',
    estado: 'vigente',
    estadoRegistro: 'APROBADO',
    aniosDeposito: 2,
    certificadoPorDocumento: true,
    vencimientoCertificado: '2026-01-01',
    documentos: [
      {
        id: 'doc1',
        nombre: 'AFVT_RNPUD_05211-78.pdf',
        vencimiento: '2026-01-01',
      },
      {
        id: 'doc2',
        nombre: '',
        vencimiento: null,
      },
    ],
  },
];

@Component({
  selector: 'app-editar-certificado-calidad',
  standalone: true,
  templateUrl: './editar-certificado-calidad.component.html',
  styleUrls: ['./editar-certificado-calidad.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class EditarCertificadoCalidadComponent implements OnInit {
  form: FormGroup = this.fb.group({
    numeroOriginal: ['', Validators.required],
    fabricante: ['', Validators.required],
    estadoRegistro: ['', Validators.required],
    aniosDeposito: [null, Validators.required],
    certificadoPorDocumento: [null, Validators.required],
    vencimientoCertificado: ['', Validators.required],
    doc1Vencimiento: [''],
    doc2Vencimiento: [''],
  });

  registro?: CertificadoCalidad;
  documentos: DocumentoForm[] = [
    { nombre: '', vencimiento: '' },
    { nombre: '', vencimiento: '' },
  ];

  readonly estados = ['APROBADO', 'EN PROCESO', 'OBSERVADO'];
  readonly aniosDeposito = Array.from({ length: 15 }, (_, i) => i + 1);

  private numeroInterno?: string;
  indiceLista?: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const numero = this.route.snapshot.paramMap.get('numero');
    const indiceParam = this.route.snapshot.paramMap.get('indice');
    this.numeroInterno = numero ?? undefined;
    this.indiceLista = indiceParam !== null && !Number.isNaN(Number(indiceParam)) ? Number(indiceParam) : undefined;

    const registro = numero ? CERTIFICADOS_CALIDAD_MOCK.find((item) => item.numeroInterno === numero) : undefined;

    if (!numero || !registro) {
      return;
    }

    this.registro = registro;

    this.documentos = [
      {
        nombre: registro.documentos?.[0]?.nombre ?? '',
        vencimiento: registro.documentos?.[0]?.vencimiento ?? '',
      },
      {
        nombre: registro.documentos?.[1]?.nombre ?? '',
        vencimiento: registro.documentos?.[1]?.vencimiento ?? '',
      },
    ];

    this.form.patchValue({
      numeroOriginal: registro.numeroOriginal ?? registro.numeroInterno,
      fabricante: registro.fabricante,
      estadoRegistro: registro.estadoRegistro ?? 'APROBADO',
      aniosDeposito: registro.aniosDeposito ?? 1,
      certificadoPorDocumento: registro.certificadoPorDocumento ?? false,
      vencimientoCertificado: registro.vencimientoCertificado ?? registro.fechaExpiracion,
      doc1Vencimiento: this.documentos[0].vencimiento,
      doc2Vencimiento: this.documentos[1].vencimiento,
    });
  }

  get titulo(): string {
    return this.registro ? `Editar registro | ${this.registro.producto}` : 'Editar registro';
  }

  get indiceLegible(): number | undefined {
    if (this.indiceLista === undefined) {
      return undefined;
    }

    return this.indiceLista + 1;
  }

  actualizarDocumento(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.documentos[index].nombre = file ? file.name : '';
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { doc1Vencimiento, doc2Vencimiento, ...resto } = this.form.getRawValue();
    const documentos = this.documentos.map((doc, index) => ({
      ...doc,
      vencimiento: index === 0 ? doc1Vencimiento : doc2Vencimiento,
    }));

    const payload = {
      numeroInterno: this.numeroInterno,
      ...resto,
      documentos,
    };

    console.info('Guardar certificado de calidad', payload);
    this.router.navigate(['/panel/certificados-calidad']);
  }

  cancelar(): void {
    this.router.navigate(['/panel/certificados-calidad']);
  }
}
