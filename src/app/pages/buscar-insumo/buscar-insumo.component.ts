import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

type Insumo = {
  producto: string;
  fabricante: string;
  revFDS: string;
  fechaFDS: string; // ISO
  url?: string;
};

@Component({
  selector: 'app-buscar-insumo',
  templateUrl: './buscar-insumo.component.html',
  styleUrls: ['./buscar-insumo.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BuscarInsumoComponent {
 // filtros
  filtroNombre = '';
  filtroFabricante = '';

  // mock de datos
  private all: Insumo[] = [
    { producto: 'Propylene Glycol', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', revFDS: 'A-12', fechaFDS: '2025-08-01' },
    { producto: '1,4-DIOXANO', fabricante: 'MERCK S.A.', revFDS: 'B-03', fechaFDS: '2025-07-18' },
    { producto: 'HEPES, Free Acid, ULTROL Grade', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', revFDS: 'C-02', fechaFDS: '2025-05-09' },
    { producto: 'Agar de contacto CASO + LT - ICR+ (821)', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', revFDS: 'D-07', fechaFDS: '2025-04-25' },
    { producto: 'Silica fumed', fabricante: 'SIGMA ALDRICH DE ARGENTINA S.R.L.', revFDS: 'E-10', fechaFDS: '2025-03-03' },
    { producto: 'Acetato de Etilo', fabricante: 'MERCK S.A.', revFDS: 'F-01', fechaFDS: '2025-02-10' },
    { producto: 'Glicerina', fabricante: 'ACME Labs', revFDS: 'G-21', fechaFDS: '2025-01-14' },
    { producto: 'Etanol 96%', fabricante: 'ACME Labs', revFDS: 'H-08', fechaFDS: '2024-12-02' },
    { producto: 'Isopropanol', fabricante: 'Quimex', revFDS: 'I-15', fechaFDS: '2024-11-20' },
    { producto: 'Peróxido de Hidrógeno 30%', fabricante: 'Quimex', revFDS: 'J-05', fechaFDS: '2024-10-05' },
  ];

  // estado de lista/orden/paginación
  filtered: Insumo[] = [...this.all];
  pageItems: Insumo[] = [];
  pageSize = 6;
  page = 1;

  sortKey: keyof Insumo = 'producto';
  sortDir: 1 | -1 = 1; // 1 asc, -1 desc

  constructor() {
    this.applyAll();
  }

  // UI events
  buscar(): void {
    this.page = 1;
    this.applyAll();
  }

  limpiar(): void {
    this.filtroNombre = '';
    this.filtroFabricante = '';
    this.page = 1;
    this.applyAll();
  }

  sortBy(key: keyof Insumo): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 1 ? -1 : 1;
    } else {
      this.sortKey = key;
      this.sortDir = 1;
    }
    this.applySort();
    this.slicePage();
  }

  prev(): void {
    if (this.page > 1) {
      this.page--;
      this.slicePage();
    }
  }
  next(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.slicePage();
    }
  }

  // helpers
  get total(): number { return this.filtered.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.total / this.pageSize)); }
  get showingFrom(): number { return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1; }
  get showingTo(): number { return Math.min(this.page * this.pageSize, this.total); }

  private applyAll(): void {
    const n = this.filtroNombre.trim().toLowerCase();
    const f = this.filtroFabricante.trim().toLowerCase();

    this.filtered = this.all.filter(item =>
      (!n || item.producto.toLowerCase().includes(n)) &&
      (!f || item.fabricante.toLowerCase().includes(f))
    );

    this.applySort();
    this.slicePage();
  }

  private applySort(): void {
    const key = this.sortKey;
    const dir = this.sortDir;
    this.filtered.sort((a, b) => {
      const va = (a[key] || '').toString().toLowerCase();
      const vb = (b[key] || '').toString().toLowerCase();
      if (va < vb) return -1 * dir;
      if (va > vb) return  1 * dir;
      return 0;
    });
  }

  private slicePage(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pageItems = this.filtered.slice(start, start + this.pageSize);
  }

  trackByRow = (_: number, r: Insumo) => r.producto + '|' + r.fabricante + '|' + r.revFDS;
}
