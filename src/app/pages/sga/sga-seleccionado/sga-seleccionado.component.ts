// sga-seleccionado.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlmacenamientoFicha, TablaAlmacenamientoComponent } from '../tabla-almacenamiento/tabla-almacenamiento.component';
import { EmergenciaFicha, TablaEmergenciaComponent } from '../tabla-emergencia/tabla-emergencia.component';
import { TablaEppComponent, TablaEppFicha, EppIcon } from '../tabla-epp/tabla-epp.component';
import { TablaNfpaComponent } from '../tabla-nfpa/tabla-nfpa.component';
import { TablaPeligroComponent } from '../tabla-peligro/tabla-peligro.component';
import { TablaTratamientoComponent, TratamientoFicha } from '../tabla-tratamiento/tabla-tratamiento.component';

import { DescargasService } from 'src/app/services/descargas.service';
import { NfpaTransporteFicha, SgaFicha } from 'src/app/interfaces/descargas.interface';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

type TabKey = 'peligro' | 'epp' | 'nfpa' | 'trat' | 'emerg' | 'alm';
type SgaSeleccionadoNavState = { materiaId?: number | string; mostrarCompleto?: boolean };

@Component({
  selector: 'app-sga-seleccionado',
  templateUrl: './sga-seleccionado.component.html',
  styleUrls: ['./sga-seleccionado.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TablaPeligroComponent,
    TablaEppComponent,
    TablaNfpaComponent,
    TablaTratamientoComponent,
    TablaEmergenciaComponent,
    TablaAlmacenamientoComponent,
    SpinnerComponent
  ]
})
export class SgaSeleccionadoComponent implements OnInit {

  public defaultTabs = [
    { key: 'peligro' as const, label: 'Peligros por SGA' },
    { key: 'epp' as const, label: 'EPP y Composición' },
    { key: 'nfpa' as const, label: 'NFPA y Transporte' },
    { key: 'trat' as const, label: 'Tratamiento' },
    { key: 'emerg' as const, label: 'Emergencia' },
    { key: 'alm' as const, label: 'Almacenamiento' },
  ];
  public active: TabKey = 'peligro';
  public tabs = [...this.defaultTabs];
  public emergenciaData: EmergenciaFicha | null = null;
  public almacenamientoData: AlmacenamientoFicha | null = null;
  public tratamientoData: TratamientoFicha | null = null;
  public nfpaData: NfpaTransporteFicha | null = null;

  public loadingTab = false;
  public errorTab: string | null = null;

  public materiaId = 0;
  public mostrarCompleto = true;

  public fichaPeligro: SgaFicha | null = null;
  public fichaEpp: TablaEppFicha | null = null;

  constructor(
    private router: Router,
    private descargas: DescargasService
  ) {}

  ngOnInit(): void {
   const state = this.getNavigationState<SgaSeleccionadoNavState>();
    const idValue = state?.materiaId;
    const parsed = typeof idValue === 'number' ? idValue : Number(idValue);
    this.materiaId = Number.isFinite(parsed) ? parsed : 0;

    this.mostrarCompleto = state?.mostrarCompleto !== false;
    this.tabs = this.mostrarCompleto
      ? [...this.defaultTabs]
      : [{ key: 'peligro', label: 'Peligros por SGA' }];

    if (!this.materiaId) {
      this.errorTab = 'ID de materia no válido.';
      return;
    }
    this.loadActive();
  }

  setActive(tab: TabKey): void {
    if (this.active === tab) return;
    this.active = tab;
    this.loadActive();
  }

  private loadActive(): void {
    if (!this.materiaId) {
      this.errorTab = 'ID de materia no válido.';
      return;
    }

    this.errorTab = null;
    this.loadingTab = true;

    switch (this.active) {
      case 'peligro':
        this.descargas.getSgaPeligros(this.materiaId).subscribe({
          next: (resp) => {
            this.fichaPeligro = this.mapPeligro(resp);
            this.loadingTab = false;
          },
          error: (e) => this.handleErr(e)
        });
        break;

      case 'epp':
        this.descargas.getSgaEpp(this.materiaId).subscribe({
          next: (resp) => {
            this.fichaEpp = this.mapEpp(resp);
            this.loadingTab = false;
          },
          error: (e) => this.handleErr(e)
        });
        break;

      case 'nfpa':
        this.descargas.getSgaNfpa(this.materiaId).subscribe({
          next: (resp) => {
            this.nfpaData = this.mapNfpaTransporte(resp);
            this.loadingTab = false;
          },
          error: (e) => this.handleErr(e)
        });
        break;

      case 'trat':
        this.descargas.getSgaTratamiento(this.materiaId).subscribe({
          next: (resp) => {
            const payload = resp?.data ?? resp;
            this.tratamientoData = this.mapTratamiento(payload);
            this.loadingTab = false;
          },
          error: (e) => this.handleErr(e)
        });
        break;

      case 'emerg':
        this.descargas.getSgaEmergencia(this.materiaId).subscribe({
          next: (resp) => {
            this.emergenciaData = this.mapEmergencia(resp);
            this.loadingTab = false;
          },
          error: (e) => this.handleErr(e)
        });
        break;

      case 'alm':
        this.descargas.getSgaAlmacenamiento(this.materiaId).subscribe({
          next: (resp) => {
            this.almacenamientoData = this.mapAlmacenamiento(resp);
            this.loadingTab = false;
          },
          error: (e) => this.handleErr(e)
        });
        break;
    }
  }

  private handleErr(e: any) {
    console.error(e);
    this.errorTab = 'No se pudo cargar la información.';
    this.loadingTab = false;
  }

  // ---------- MAPEOS ----------

  /** PELIGROS: pasar pictogramas tal cual llegan del back (GHSxx) */
  private mapPeligro(resp: any): SgaFicha {
    const d = resp?.data ?? resp ?? {};
    const h = d.header ?? {};

    const hazardStatements: string[] = Array.isArray(d.frasesH)
      ? d.frasesH.map((f: any) => (f?.espaniol ?? f?.frase ?? '').toString().trim()).filter(Boolean)
      : [];

    const precautionaryStatements: string[] = Array.isArray(d.consejosPrudencia)
      ? d.consejosPrudencia.map((p: any) => (p?.espaniol ?? p?.frase ?? '').toString().trim()).filter(Boolean)
      : [];

    return {
      productName: h.nombre_producto ?? '',
      supplier: h.razonSocial ?? '',
      displayVisibility: 'Publico',
      dataSource: '',
      // ⬇️ SIN traducción: usar los códigos GHS tal cual (ej: "GHS00")
      pictograms: Array.isArray(d.pictogramas) ? d.pictogramas.filter(Boolean) : [],
      signalWord: d.palabra_advertencia ?? '',
      hazardStatements,
      precautionaryStatements,
    };
  }

  /** EPP y composición */
private mapEpp(resp: any): TablaEppFicha {
  const d = resp?.data ?? resp ?? {};
  const h = d.header ?? {};
  const pictRaw = (d.epp?.pictograma ?? '').toString().trim();
  const pict = pictRaw ? pictRaw.toUpperCase() : null;

  const comps = Array.isArray(d.composicion) ? d.composicion : [];

  return {
    productName: h.nombre_producto ?? '',
    supplier: h.razonSocial ?? '',
    rnpq: h.rnpqlist ?? null,
    eppCode: pict,
    eppImg: pict ? this.eppAssetUrl(pict) : null,
    componentes: comps.map((c: any) => ({
      nombre: String(c?.componente ?? '').replace(/\r?\n|\r/g, '').trim(),
      cas: c?.cas ?? '',
      porcentaje: this.formatPorcentaje(c?.porcentaje, c?.porcentaje2),
    })),
  };
}

private eppAssetUrl(letter: string): string {
  const safe = String(letter).replace(/[^A-Z0-9_-]/g, '').toUpperCase();
  return `assets/iconos/${safe}.png`;
}

  /** “a-b%” o solo “b%” si a = 0 (igual que PHP) */
  private formatPorcentaje(p1: any, p2: any): string {
    const a = Number(p1);
    const b = Number(p2);
    if (!isFinite(a) || !isFinite(b)) {
      return [p1, p2].filter(v => v !== undefined && v !== null && v !== '').join(' - ');
    }
    if (a === 0) return `${b}%`;
    return `${a}% - ${b}%`;
  }

  /** Tratamiento (tab) */
  private mapTratamiento(d: any): TratamientoFicha {
    return {
      productName: d?.productName ?? d?.nombre_producto ?? '',
      supplier: d?.supplier ?? d?.razonSocial ?? '',
      medidasGenerales: d?.medidas_generales ?? '',
      ojos: d?.contacto_ojos ?? '',
      piel: d?.contacto_piel ?? '',
      inhalacion: d?.inhalacion ?? '',
      ingestion: d?.ingestion ?? '',
      notaMedico: d?.nota_medico ?? ''
    };
  }

  /** Emergencia (tab) */
  private mapEmergencia(resp: any): EmergenciaFicha {
    const d = resp?.data ?? resp ?? {};
    const header = d.header ?? resp?.header ?? {};
    return {
      productName: header.nombre_producto ?? header.productName ?? '',
      supplier: header.razonSocial ?? header.supplier ?? '',
      mediosApropiados: d.medios_extincion_apropiados ?? d.apropiados ?? '',
      mediosNoApropiados: d.medios_extincion_no_apropiados ?? d.no_apropiados ?? '',
      incendio: d.incendio ?? '',
      derrames: d.derrames ?? d.derrame ?? ''
    };
  }

  /** Almacenamiento (tab) */
  private mapAlmacenamiento(resp: any): AlmacenamientoFicha {
    const d = resp?.data ?? resp ?? {};
    return {
      productName: d.producto ?? d.nombre_producto ?? '',
      supplier: d.fabricante ?? d.razonSocial ?? '',
      tipoProducto: d.tipo_producto ?? '',
      caracteristicasDeposito: d.caracteristicas_deposito ?? '',
      condicionesOperacion: d.condiciones_operacion ?? '',
      disposicionesParticulares: d.disposiciones_particulares ?? '',
      disposicionesAlmacenamiento: d.disposiciones_almacenamiento ?? '',
      incompatibleCon: Array.isArray(d.incompatible_con)
        ? d.incompatible_con
        : this.splitList(d.incompatible_con),
    };
  }

  /** 'a, b, c' -> ['a','b','c'] ; null/undefined -> [] */
  private splitList(v: any): string[] {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return String(v).split(',').map(s => s.trim()).filter(Boolean);
  }

  get activeLabel(): string {
    return this.tabs.find(t => t.key === this.active)?.label ?? '';
  }

private mapNfpaTransporte(resp: any): NfpaTransporteFicha {
    const d = resp?.data ?? resp ?? {};
    const h = d.header ?? {};
    const n = d.nfpa ?? {};
    const t = d.transporte ?? {};

    return {
      productName: h.nombre_producto ?? '',
      supplier: h.razonSocial ?? '',
      fuente: h.fuente ?? '',

      nfpa: {
        salud: n.salud ?? 'NP',
        inflamabilidad: n.inflamabilidad ?? 'NP',
        reactividad: n.reactividad ?? 'NP',
        otros: n.otros ?? '-',
      },

      transporte: {
        codRiesgo: t.cod_riesgo ?? 'NP',
        nroOnu: t.nro_onu ?? 'NP',
        grupoEmbalaje: t.grupo_embalaje ?? 'NP',
        // 👇 traemos tal cual del back y lo normalizamos a string
        clasImg: String(t.clas_img ?? '0'),
        guia: t.guia ?? '',
      },
    };
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
