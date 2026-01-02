import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AlmacenamientoFicha,
  TablaAlmacenamientoComponent
} from '../tabla-almacenamiento/tabla-almacenamiento.component';
import {
  EmergenciaFicha,
  TablaEmergenciaComponent
} from '../tabla-emergencia/tabla-emergencia.component';
import {
  TablaEppComponent,
  TablaEppFicha,
  EppIcon
} from '../tabla-epp/tabla-epp.component';
import { TablaNfpaComponent } from '../tabla-nfpa/tabla-nfpa.component';
import { TablaPeligroComponent } from '../tabla-peligro/tabla-peligro.component';
import {
  TablaTratamientoComponent,
  TratamientoFicha
} from '../tabla-tratamiento/tabla-tratamiento.component';

import { DescargasService } from 'src/app/services/descargas.service';
import {
  NfpaTransporteFicha,
  SgaFicha
} from 'src/app/interfaces/descargas.interface';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { catchError, forkJoin, of } from 'rxjs';
import { RegistrosService } from 'src/app/services/registros.service';

type TabKey = 'peligro' | 'epp' | 'nfpa' | 'trat' | 'emerg' | 'alm';
type SgaSeleccionadoNavState = {
  materiaId?: number | string;
  mostrarCompleto?: boolean;
  idEncrypt?: string;
};

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
    { key: 'alm' as const, label: 'Almacenamiento' }
  ];
  public active: TabKey = 'peligro';
  public tabs = [...this.defaultTabs];

  public emergenciaData: EmergenciaFicha | null = null;
  public almacenamientoData: AlmacenamientoFicha | null = null;
  public tratamientoData: TratamientoFicha | null = null;
  public nfpaData: NfpaTransporteFicha | null = null;
  public idEncrypt: string | null = null;

  public loadingTab = false;
  public errorTab: string | null = null;

  public materiaId = 0;
  public mostrarCompleto = true;

  public fichaPeligro: SgaFicha | null = null;
  public fichaEpp: TablaEppFicha | null = null;

  constructor(
    private router: Router,
    private descargas: DescargasService,
    private registros: RegistrosService
  ) { }

  // ==================================================
  // Helper para arreglar texto con encoding roto
  // (ej: "Î±" -> "α", "EspaÃ±ol" -> "Español")
  // ==================================================
  private fixEncoding(value: any): string {
    if (value == null) return '';
    const s = String(value);
    try {
      return decodeURIComponent(escape(s));
    } catch {
      return s;
    }
  }

  // ==================================================
  // Ciclo de vida
  // ==================================================

  public ngOnInit(): void {
    const state = this.getNavigationState<SgaSeleccionadoNavState>();

    const idValue = state?.materiaId;
    const parsed = typeof idValue === 'number' ? idValue : Number(idValue);
    this.materiaId = Number.isFinite(parsed) ? parsed : 0;

    this.idEncrypt = state?.idEncrypt ?? null;

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

  public setActive(tab: TabKey): void {
    if (this.active === tab) return;
    this.active = tab;
    this.loadActive();
  }

  private loadActive(): void {
    this.errorTab = null;
    this.loadingTab = true;

    switch (this.active) {
      case 'peligro':
        forkJoin({
          sga: this.descargas.getSgaPeligros(this.materiaId),
          ipel: this.registros.obtenerIpel(String(this.materiaId)).pipe(
            catchError(() =>
              of({
                rango_p: null,
                descripcion_p: null
              })
            )
          )
        }).subscribe({
          next: ({ sga, ipel }) => {
            const ipelValue = this.resolveIpel(sga, ipel);
            const hazardReason = this.resolveHazardReason(sga, ipel);
            this.fichaPeligro = this.mapPeligro(sga, ipelValue, hazardReason);
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

  // ==================================================
  // MAPEOS
  // ==================================================

  /** PELIGROS */
  private mapPeligro(resp: any, ipel: number | null, hazardReason: string): SgaFicha {
    const d = resp?.data ?? resp ?? {};
    const h = d.header ?? {};

    const hazardStatements: string[] = Array.isArray(d.frasesH)
      ? d.frasesH
        .map(
          (f: any) =>
            this.fixEncoding(
              (f?.espaniol ?? f?.frase ?? '').toString().trim()
            )
        )
        .filter(Boolean)
      : [];

    const precautionaryStatements: string[] = Array.isArray(d.consejosPrudencia)
      ? d.consejosPrudencia
        .map(
          (p: any) =>
            this.fixEncoding(
              (p?.espaniol ?? p?.frase ?? '').toString().trim()
            )
        )
        .filter(Boolean)
      : [];

    return {
      productName: this.fixEncoding(h.nombre_producto ?? ''),
      supplier: this.fixEncoding(h.razonSocial ?? ''),
      displayVisibility: 'Publico',
      dataSource: '',
      ipel,
      hazardReason,
      pictograms: Array.isArray(d.pictogramas)
        ? d.pictogramas.filter(Boolean)
        : [],
      signalWord: this.fixEncoding(d.palabra_advertencia ?? ''),
      hazardStatements,
      precautionaryStatements
    };
  }

  /** EPP y COMPOSICIÓN */
  private mapEpp(resp: any): TablaEppFicha {
    const d = resp?.data ?? resp ?? {};
    const h = d.header ?? {};
    const pictRaw = (d.epp?.pictograma ?? '').toString().trim();
    const pict = pictRaw ? pictRaw.toUpperCase() : null;

    const comps = Array.isArray(d.composicion) ? d.composicion : [];

    return {
      productName: this.fixEncoding(h.nombre_producto ?? ''),
      supplier: this.fixEncoding(h.razonSocial ?? ''),
      rnpq: h.rnpqlist ? this.fixEncoding(h.rnpqlist) : null,
      eppCode: pict,
      eppImg: pict ? this.eppAssetUrl(pict) : null,
      componentes: comps.map((c: any) => ({
        // aquí estaba el texto roto
        nombre: this.fixEncoding(
          String(c?.componente ?? '').replace(/\r?\n|\r/g, '').trim()
        ),
        cas: this.fixEncoding(c?.cas ?? ''),
        porcentaje: this.formatPorcentaje(c?.porcentaje, c?.porcentaje2)
      }))
    };
  }

  private eppAssetUrl(letter: string): string {
    const safe = String(letter).replace(/[^A-Z0-9_-]/g, '').toUpperCase();
    return `assets/iconos/${safe}.png`;
  }

  /** “a-b%” o solo “b%” si a = 0 */
  private formatPorcentaje(p1: any, p2: any): string {
    const a = Number(p1);
    const b = Number(p2);
    if (!isFinite(a) || !isFinite(b)) {
      return [p1, p2]
        .filter((v) => v !== undefined && v !== null && v !== '')
        .join(' - ');
    }
    if (a === 0) return `${b}%`;
    return `${a}% - ${b}%`;
  }

  /** Tratamiento */
  private mapTratamiento(d: any): TratamientoFicha {
    return {
      productName: this.fixEncoding(d?.productName ?? d?.nombre_producto ?? ''),
      supplier: this.fixEncoding(d?.supplier ?? d?.razonSocial ?? ''),
      medidasGenerales: this.fixEncoding(d?.medidas_generales ?? ''),
      ojos: this.fixEncoding(d?.contacto_ojos ?? ''),
      piel: this.fixEncoding(d?.contacto_piel ?? ''),
      inhalacion: this.fixEncoding(d?.inhalacion ?? ''),
      ingestion: this.fixEncoding(d?.ingestion ?? ''),
      notaMedico: this.fixEncoding(d?.nota_medico ?? '')
    };
  }

  /** Emergencia */
  private mapEmergencia(resp: any): EmergenciaFicha {
    const d = resp?.data ?? resp ?? {};
    const header = d.header ?? resp?.header ?? {};
    return {
      productName: this.fixEncoding(
        header.nombre_producto ?? header.productName ?? ''
      ),
      supplier: this.fixEncoding(header.razonSocial ?? header.supplier ?? ''),
      mediosApropiados: this.fixEncoding(
        d.medios_extincion_apropiados ?? d.apropiados ?? ''
      ),
      mediosNoApropiados: this.fixEncoding(
        d.medios_extincion_no_apropiados ?? d.no_apropiados ?? ''
      ),
      incendio: this.fixEncoding(d.incendio ?? ''),
      derrames: this.fixEncoding(d.derrames ?? d.derrame ?? '')
    };
  }

  /** Almacenamiento */
  private mapAlmacenamiento(resp: any): AlmacenamientoFicha {
    const d = resp?.data ?? resp ?? {};
    return {
      productName: this.fixEncoding(d.producto ?? d.nombre_producto ?? ''),
      supplier: this.fixEncoding(d.fabricante ?? d.razonSocial ?? ''),
      tipoProducto: this.fixEncoding(d.tipo_producto ?? ''),
      caracteristicasDeposito: this.fixEncoding(
        d.caracteristicas_deposito ?? ''
      ),
      condicionesOperacion: this.fixEncoding(d.condiciones_operacion ?? ''),
      disposicionesParticulares: this.fixEncoding(
        d.disposiciones_particulares ?? ''
      ),
      disposicionesAlmacenamiento: this.fixEncoding(
        d.disposiciones_almacenamiento ?? ''
      ),
      incompatibleCon: Array.isArray(d.incompatible_con)
        ? d.incompatible_con.map((x: any) => this.fixEncoding(x))
        : this.splitList(d.incompatible_con).map((x) => this.fixEncoding(x))
    };
  }

  /** 'a, b, c' -> ['a','b','c'] */
  private splitList(v: any): string[] {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return String(v)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /** NFPA y Transporte */
  private mapNfpaTransporte(resp: any): NfpaTransporteFicha {
    const d = resp?.data ?? resp ?? {};
    const h = d.header ?? {};
    const n = d.nfpa ?? {};
    const t = d.transporte ?? {};

    return {
      productName: this.fixEncoding(h.nombre_producto ?? ''),
      supplier: this.fixEncoding(h.razonSocial ?? ''),
      fuente: this.fixEncoding(h.fuente ?? ''),

      nfpa: {
        salud: this.fixEncoding(n.salud ?? 'NP'),
        inflamabilidad: this.fixEncoding(n.inflamabilidad ?? 'NP'),
        reactividad: this.fixEncoding(n.reactividad ?? 'NP'),
        otros: this.fixEncoding(n.otros ?? '-')
      },

      transporte: {
        codRiesgo: this.fixEncoding(t.cod_riesgo ?? 'NP'),
        nroOnu: this.fixEncoding(t.nro_onu ?? 'NP'),
        grupoEmbalaje: this.fixEncoding(t.grupo_embalaje ?? 'NP'),
        clasImg: String(t.clas_img ?? '0'),
        guia: this.fixEncoding(t.guia ?? '')
      }
    };
  }

  // ==================================================
  // Utilidades
  // ==================================================

  get activeLabel(): string {
    return this.tabs.find((t) => t.key === this.active)?.label ?? '';
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

  private resolveIpel(resp: any, ipelResp: any): number | null {
    const fromService = Number(ipelResp?.rango_p);
    if (Number.isFinite(fromService) && fromService >= 1 && fromService <= 5) {
      return fromService;
    }

    const fromHeader = Number(resp?.data?.header?.iPel ?? resp?.header?.iPel);
    if (Number.isFinite(fromHeader) && fromHeader >= 1 && fromHeader <= 5) {
      return fromHeader;
    }

    return null;
  }

  private resolveHazardReason(resp: any, ipelResp: any): string {
    const reason =
      ipelResp?.descripcion_p ??
      resp?.data?.header?.iPelDescripcion ??
      resp?.header?.iPelDescripcion;

    const text = this.fixEncoding(reason ?? '').trim();
    if (text) return text;

    return 'No es Peligroso';
  }
}
