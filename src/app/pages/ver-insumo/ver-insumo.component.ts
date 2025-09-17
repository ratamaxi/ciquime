import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type Estado = 'aprobado' | 'rechazado' | 'pendiente';

interface Insumo {
  id: string;
  codigoAprobacion?: string;
  nombreInterno?: string;
  producto: string;
  fabricante: string;
  fechaFds: string; // ISO (yyyy-mm-dd) para simplificar
  estado: Estado;
}

@Component({
  selector: 'app-ver-insumo',
  templateUrl: './ver-insumo.component.html',
  styleUrls: ['./ver-insumo.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class VerInsumoComponent {
  public readonly Math = Math;
 // Tabs / filtros
  activeTab: Estado = 'aprobado';

  // Búsqueda y paginado
  query = '';
  pageSize = 10;
  page = 1;

  // Ordenamiento
  sortKey: keyof Insumo | 'fechaFds' = 'producto';
  sortDir: 1 | -1 = 1;

  // Mock de insumos (meté los reales cuando tengas API)
  private all: Insumo[] = [
    { id: '1',  producto: 'ETER DE PETROLEO', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2025-01-02', estado: 'aprobado' },
    { id: '2',  producto: 'Tergazyme(R) enzyme detergent', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2025-02-14', estado: 'aprobado' },
    { id: '3',  producto: 'Citrato de sodio dihidrato', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2025-03-05', estado: 'aprobado' },
    { id: '4',  producto: 'Dibasic Calcium Phosphate', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2025-05-13', estado: 'aprobado' },
    { id: '5',  producto: '1-HEPTANOL', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2021-07-03', estado: 'aprobado' },
    { id: '6',  producto: 'HEPES, Free Acid, ULTROL Grade', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2025-02-04', estado: 'aprobado' },
    { id: '7',  producto: 'Agar de contacto CASO + LT - ICR+ (821)', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2025-03-26', estado: 'aprobado' },
    { id: '8',  producto: 'Silica fumed', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', fechaFds: '2025-04-28', estado: 'aprobado' },

    // Algunos rechazados/pendientes para probar tabs
    { id: '9',  producto: 'Acetona técnica', fabricante: 'MERCK S.A.', fechaFds: '2024-11-20', estado: 'rechazado' },
    { id: '10', producto: 'Isopropanol', fabricante: 'MERCK S.A.', fechaFds: '2025-06-10', estado: 'pendiente' },
  ];

  // Derivados
  get filtered(): Insumo[] {
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

  get pageData(): Insumo[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  // UI helpers
  setTab(tab: Estado) {
    this.activeTab = tab;
    this.page = 1;
    this.query = '';
  }

  toggleSort(key: keyof Insumo | 'fechaFds') {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = 1;
    }
  }

  next() {
    if (this.page * this.pageSize < this.total) this.page++;
  }
  prev() {
    if (this.page > 1) this.page--;
  }

  // Acciones (PLACEHOLDER)
  editar(i: Insumo)     { alert(`Editar: ${i.producto}`); }
  verSGA(i: Insumo)     { alert(`SGA de: ${i.producto}`); }
  verHSO(i: Insumo)     { alert(`HSO de: ${i.producto}`); }
  verFDS(i: Insumo)     { alert(`FDS de: ${i.producto}`); }
  imprimirEtiqueta(i: Insumo) { alert(`Etiqueta de: ${i.producto}`); }
  auditar(i: Insumo)    { alert(`Auditar: ${i.producto}`); }
  eliminar(i: Insumo)   {
    if (confirm(`Eliminar "${i.producto}"?`)) {
      this.all = this.all.filter(x => x.id !== i.id);
      this.page = 1;
    }
  }
}
