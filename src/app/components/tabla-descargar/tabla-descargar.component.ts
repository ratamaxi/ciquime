import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FdsDataResponse, InsumoDescarga } from 'src/app/interfaces/descargas.interface';
import { Estado } from 'src/app/interfaces/registros.interface';
import { RegistrosService } from 'src/app/services/registros.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-tabla-descargar',
  templateUrl: './tabla-descargar.component.html',
  styleUrls: ['./tabla-descargar.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class TablaDescargarComponent {
  @Input() public title: string = '';
  @Input() public actions: Array<'hso'|'fet'|'fds'|'etiqueta'> = []; // default

  /** (opcional) Mapa materia_id -> id_encrypt (si el padre lo tiene de otro endpoint) */
  @Input() public idEncryptByMateria: Record<string, string> | null = null;

  /** Recibe los datos del padre y los convierte al modelo interno */
  @Input() set data(value: FdsDataResponse[] | null | undefined) {
    this.all = Array.isArray(value) ? value.map(v => this.toInsumo(v)) : [];
    this.page = 1;
    this.query = '';
  }

  public readonly Math = Math;
  private oldPortalBase = 'https://ciquime.com.ar';

  // Tabs / filtros
  activeTab: Estado = 'APROBADO';

  // Búsqueda y paginado
  query = '';
  pageSize = 10;
  page = 1;

  // Ordenamiento
  sortKey: keyof InsumoDescarga | 'fechaFds' = 'producto';
  sortDir: 1 | -1 = 1;

  // Dataset real
  private all: InsumoDescarga[] = [];

  constructor(private router: Router, private readonly registros: RegistrosService) {}

  // ---------- Mapping y helpers ----------
  /** Corrige mojibake básico (UTF-8 leído como Latin-1) */
  private deMojibake(s: string | null | undefined): string {
    if (!s) return '';
    try {
      const bytes = new Uint8Array([...s].map(ch => ch.charCodeAt(0)));
      return new TextDecoder('utf-8').decode(bytes);
    } catch {
      return s;
    }
  }

  /** yyyy-mm-dd desde ISO/Date */
  private toYmd(d: string | Date | null | undefined): string {
    if (!d) return '';
    const dt = new Date(d as any);
    if (isNaN(dt.getTime())) return '';
    return dt.toISOString().slice(0, 10);
  }

  /** Mapea la fila del back al modelo de la tabla */
  private toInsumo(r: FdsDataResponse): InsumoDescarga {
    const id = String(r.materia_id);
    const idEncFromInput = this.idEncryptByMateria?.[id] ?? null;
    const idEncFromApi = (r as any).id_encrypt ?? null; // por si ya viene en la fila

    return {
      id,
      idEncrypt: idEncFromInput ?? idEncFromApi ?? undefined,
      codigoAprobacion: r.apr_code ?? undefined,
      nombreInterno: r.extraname ?? undefined,
      producto: this.deMojibake(r.nombre_producto),
      fabricante: this.deMojibake(r.razonSocial),
      fechaFds: this.toYmd(r.FDS_fecha as any),
      estado: 'APROBADO', // por tu WHERE
      // Guardamos el nombre de archivo crudo para el link del portal viejo (no “arreglado”)
      fdsFile: r.fds,
      calidadDoc: r.nombre_calidoc ?? null
    };
  }

  // ---------- Derivados para UI ----------
  get filtered(): InsumoDescarga[] {
    const q = this.query.trim().toLowerCase();
    return this.all
      .filter(i => i.estado === this.activeTab)
      .filter(i =>
        !q ||
        i.producto.toLowerCase().includes(q) ||
        i.fabricante.toLowerCase().includes(q) ||
        (i.nombreInterno ?? '').toLowerCase().includes(q) ||
        (i.codigoAprobacion ?? '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const va = (a[this.sortKey] ?? '').toString().toLowerCase();
        const vb = (b[this.sortKey] ?? '').toString().toLowerCase();
        return va < vb ? -1 * this.sortDir : va > vb ? 1 * this.sortDir : 0;
      });
  }

  get total(): number { return this.filtered.length; }

  get pageData(): InsumoDescarga[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  /** Codifica como espera el portal viejo para root= (FDS):
   *  Unicode -> bytes UTF-8 -> reinterpretado como Latin-1 -> encodeURIComponent
   */
  private encodeForOldPortal(s: string): string {
    const bytes = new TextEncoder().encode(s);
    let latin1 = '';
    for (const b of bytes) latin1 += String.fromCharCode(b);
    return encodeURIComponent(latin1);
  }

public abrirHSO(item: InsumoDescarga): void {
  const url = this.registros.getHsUrl(item.id);
  window.open(url, '_blank', 'noopener,noreferrer');
}

public abrirFet(item: InsumoDescarga): void {
  const url = this.registros.getFetUrl(item.id);
  window.open(url, '_blank', 'noopener,noreferrer');
}

  // ---------- Acciones ----------
public abrirFds(item: InsumoDescarga): void {
  const openBlank = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  if (!item.fdsFile) {
    alert('No hay archivo FDS asociado.');
    return;
  }

  const root = this.encodeLegacyRoot(item.fdsFile);
  const rfn  = encodeURIComponent(item.producto ?? '');

  const url = `${this.oldPortalBase}/fdsdownload.php?root=${root}&rfn=${rfn}`;
  openBlank(url);
}


  // ——— Helpers ———
/** Detecta si el string YA está en mojibake (ej: contiene "Ã" típico de utf8 mal decodificado) */
private isMojibake(s: string): boolean {
  return /Ã./.test(s);
}

/** Emula php utf8_decode: toma UTF-8 y lo representa como si fuera Latin-1 */
private utf8ToLatin1(s: string): string {
  const bytes = new TextEncoder().encode(s); // UTF-8 bytes
  let out = '';
  for (const b of bytes) out += String.fromCharCode(b); // cada byte -> char latin-1
  return out;
}

/** Limpia artefactos comunes de doble mojibake (el famoso "Â") */
private stripPhantomPairs(s: string): string {
  // 0x83 = \u0083, 0xC2 = \u00C2
  return s.replace(/\u0083\u00C2/g, '');
}

/** Codificación EXACTA para el PHP legado (root=) */
private encodeLegacyRoot(name: string): string {
  // si ya está mojibakeado, no “latin1-ices” otra vez
  const base = this.isMojibake(name) ? name : this.utf8ToLatin1(name);
  const cleaned = this.stripPhantomPairs(base);
  return encodeURIComponent(cleaned);
}


  // ---------- UI helpers ----------
  setTab(tab: Estado) {
    this.activeTab = tab;
    this.page = 1;
    this.query = '';
  }

  toggleSort(key: keyof InsumoDescarga | 'fechaFds') {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = 1;
    }
  }

  next() { if (this.page * this.pageSize < this.total) this.page++; }
  prev() { if (this.page > 1) this.page--; }

  // (opcionales de demo)
  editar(i: InsumoDescarga)           { alert(`Editar: ${i.producto}`); }
  verSGA(i: InsumoDescarga)           { alert(`SGA de: ${i.producto}`); }
  imprimirEtiqueta(i: InsumoDescarga) { alert(`Etiqueta de: ${i.producto} (${i.calidadDoc ?? 'sin doc'})`); }
  auditar(i: InsumoDescarga)          { alert(`Auditar: ${i.producto}`); }
  eliminar(i: InsumoDescarga) {
    if (confirm(`Eliminar "${i.producto}"?`)) {
      this.all = this.all.filter(x => x.id !== i.id);
      this.page = 1;
    }
  }
}
