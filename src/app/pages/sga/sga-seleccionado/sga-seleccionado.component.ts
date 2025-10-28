// sga-seleccionado.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AlmacenamientoFicha, TablaAlmacenamientoComponent } from '../tabla-almacenamiento/tabla-almacenamiento.component';
import { EmergenciaFicha, TablaEmergenciaComponent } from '../tabla-emergencia/tabla-emergencia.component';
import { TablaEppComponent, TablaEppFicha, EppIcon } from '../tabla-epp/tabla-epp.component';
import { TablaNfpaComponent } from '../tabla-nfpa/tabla-nfpa.component';
import { TablaPeligroComponent } from '../tabla-peligro/tabla-peligro.component';
import { TablaTratamientoComponent, TratamientoFicha } from '../tabla-tratamiento/tabla-tratamiento.component';

import { DescargasService } from 'src/app/services/descargas.service';
import { NfpaTransporteFicha, SgaFicha } from 'src/app/interfaces/descargas.interface';

type TabKey = 'peligro' | 'epp' | 'nfpa' | 'trat' | 'emerg' | 'alm';

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
    TablaAlmacenamientoComponent
  ]
})
export class SgaSeleccionadoComponent implements OnInit, OnDestroy {

  public active: TabKey = 'peligro';
  public tabs = [
    { key: 'peligro' as const, label: 'Peligros por SGA' },
    { key: 'epp'     as const, label: 'EPP y Composición' },
    { key: 'nfpa'    as const, label: 'NFPA y Transporte' },
    { key: 'trat'    as const, label: 'Tratamiento' },
    { key: 'emerg'   as const, label: 'Emergencia' },
    { key: 'alm'     as const, label: 'Almacenamiento' },
  ];

  public emergenciaData: EmergenciaFicha | null = null;
  public almacenamientoData: AlmacenamientoFicha | null = null;
  public tratamientoData: TratamientoFicha | null = null;
  public nfpaData: NfpaTransporteFicha | null = null;

  loadingTab = false;
  errorTab: string | null = null;

  private materiaId = 0;
  private sub?: Subscription;

  fichaPeligro: SgaFicha | null = null;
  fichaEpp: TablaEppFicha | null = null;

  constructor(
    private route: ActivatedRoute,
    private descargas: DescargasService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(pm => {
      const id = Number(pm.get('id'));
      this.materiaId = isFinite(id) ? id : 0;
      this.loadActive();
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

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
          next: (resp) => { this.fichaPeligro = this.mapPeligro(resp); this.loadingTab = false; },
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
            // resp puede venir como { ok, data: {...} } o directo con los campos
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

private mapPeligro(resp: any): SgaFicha {
  const d = resp?.data ?? resp ?? {};
  const h = d.header ?? {};

  // H → descripciones
  const hazardStatements: string[] = Array.isArray(d.frasesH)
    ? d.frasesH.map((f: any) => (f?.espaniol ?? f?.frase ?? '').toString().trim()).filter(Boolean)
    : [];

  // P → descripciones
  const precautionaryStatements: string[] = Array.isArray(d.consejosPrudencia)
    ? d.consejosPrudencia.map((p: any) => (p?.espaniol ?? p?.frase ?? '').toString().trim()).filter(Boolean)
    : [];

  return {
    productName: h.nombre_producto ?? '',
    supplier: h.razonSocial ?? '',
    displayVisibility: 'Publico',   // tu back no lo envía
    dataSource: '',          // tu back no lo envía
    pictograms: this.mapGhsToUiPictos(d.pictogramas),
    signalWord: d.palabra_advertencia ?? '',
    hazardStatements,
    precautionaryStatements,
  };
}

private mapGhsToUiPictos(codes: any): string[] {
  const list: string[] = Array.isArray(codes) ? codes : [];
  const MAP: Record<string, string> = {
    // algunos más comunes; agregá los que necesites
    GHS01: 'bomba',            // explosivo (no lo dibuja el hijo hoy, quedará sin ícono)
    GHS02: 'llama',            // inflamable
    GHS03: 'llama-oxidante',   // oxidante (no lo dibuja el hijo hoy)
    GHS04: 'bombona',          // gas (no lo dibuja el hijo hoy)
    GHS05: 'corrosion',        // corrosivo (no lo dibuja el hijo hoy)
    GHS06: 'calavera',         // toxicidad aguda (no lo dibuja el hijo hoy)
    GHS07: 'exclamacion',      // irritante/menos grave ✔️
    GHS08: 'peligro-salud',    // peligro salud crónica ✔️
    GHS09: 'ambiente',         // medio ambiente (no lo dibuja el hijo hoy)
    GHS00: '',                 // sin pictograma
  };
  return list
    .map(c => MAP[c] ?? '')
    .filter(Boolean);
}

private mapEpp(resp: any): TablaEppFicha {
  const d = resp?.data ?? resp ?? {};
  const h = d.header ?? {};
  const pict = d.epp?.pictograma ?? null;
  const comps = Array.isArray(d.composicion) ? d.composicion : [];

  return {
    productName: h.nombre_producto ?? '',
    supplier: h.razonSocial ?? '',
    rnpq: h.rnpqlist ?? '',
    epp: this.mapPictogramaToEpp(pict),
    componentes: comps.map((c: any) => ({
      nombre: String(c?.componente ?? '').replace(/\r?\n|\r/g, '').trim(),
      cas: c?.cas ?? '',
      porcentaje: this.formatPorcentaje(c?.porcentaje, c?.porcentaje2),
    })),
  };
}

/** Convierte la letra del pictograma EPP (p.ej. "B") a la lista de íconos que usa el hijo */
private mapPictogramaToEpp(letter: string | null | undefined): EppIcon[] {
  const l = String(letter || '').toUpperCase();

  // Mapa de ejemplo (ajustá a tu criterio/legado)
  const MAP: Record<string, EppIcon[]> = {
    // Referencias típicas:
    // A: gafas
    A: ['gafas'],
    // B: gafas + guantes
    B: ['gafas', 'guantes'],
    // C: gafas + guantes + ropa
    C: ['gafas', 'guantes', 'ropa'],
    // D: gafas + guantes + respirador
    D: ['gafas', 'guantes', 'respirador'],
    // E: gafas + guantes + respirador + ropa
    E: ['gafas', 'guantes', 'respirador', 'ropa'],
    // F: todo lo anterior + botas
    F: ['gafas', 'guantes', 'respirador', 'ropa', 'botas'],
  };

  return MAP[l] ?? [];
}

/** Arma el string de porcentaje como en el PHP (si porcentaje=0, usar porcentaje2; si no, rango "a-b%") */
private formatPorcentaje(p1: any, p2: any): string {
  const a = Number(p1);
  const b = Number(p2);

  // casos del back:
  // - cuando p1=0 → mostraban solo p2%
  // - cuando p1>0 → "p1% - p2%"
  if (!isFinite(a) || !isFinite(b)) {
    // fallback seguro
    return [p1, p2].filter(v => v !== undefined && v !== null && v !== '').join(' - ');
  }

  if (a === 0) {
    return `${b}%`;
  }
  return `${a}% - ${b}%`;
}

  /** 🔧 NUEVO: mapea backend -> TratamientoFicha que espera el hijo */
  private mapTratamiento(d: any): TratamientoFicha {
    // El ejemplo de tu back trae estos campos:
    // tratamiento, medidas_generales, contacto_ojos, contacto_piel, inhalacion, ingestion, nota_medico
    // El hijo requiere (según tu error): productName, supplier, ojos, piel, etc.
    return {
      productName: d?.productName ?? d?.nombre_producto ?? '', // si no viene, queda vacío
      supplier: d?.supplier ?? d?.razonSocial ?? '',
      medidasGenerales: d?.medidas_generales ?? '',
      ojos: d?.contacto_ojos ?? '',
      piel: d?.contacto_piel ?? '',
      inhalacion: d?.inhalacion ?? '',
      ingestion: d?.ingestion ?? '',
      notaMedico: d?.nota_medico ?? ''
    };
  }

  // helpers
  private coerceEpp(v: any): EppIcon[] {
    const allow: EppIcon[] = ['gafas','guantes','respirador','botas'];
    if (!v) return [];
    const arr = Array.isArray(v) ? v : String(v).split(',').map((s: string) => s.trim());
    return arr.filter((x: string) => allow.includes(x as EppIcon)) as EppIcon[];
  }

  get activeLabel(): string {
  return this.tabs.find(t => t.key === this.active)?.label ?? '';
}

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
  return String(v)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

private mapNfpaTransporte(resp: any): NfpaTransporteFicha {
  const h = resp?.header ?? {};
  const n = resp?.nfpa ?? {};
  const t = resp?.transporte ?? {};

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
      clasImg: t.clas_img ?? '0',
      guia: t.guia ?? '',
    },
  };
}

}
