import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

type UsuarioFila = {
  id: string,
  user: string;
  email: string;
  alias?: string | null;
};

@Component({
  selector: 'app-data-usuario',
  templateUrl: './data-usuario.component.html',
  styleUrls: ['./data-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormsModule]
})
export class DataUsuarioComponent implements OnInit {

  // búsqueda
  public busqueda = '';

  // datos
  private idUser: string = localStorage.getItem('idUser') ?? '';
  public usuarios: UsuarioFila[] = [];
  public usuariosFiltrados: UsuarioFila[] = [];

  // estado
  public loading = false;
  public error: string | null = null;

  // paginación
  public page = 1;
  public pageSize = 10;

  constructor(private readonly usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    if (!this.idUser) {
      this.error = 'No se encontró id de usuario en LocalStorage.';
      return;
    }
    this.loading = true;
    this.error = null;

    this.usuarioService.getDataUsuario(this.idUser).subscribe({
      next: (resp: any) => {
        // resp esperado:
        // { ok: true, data: { id, nombre, mail, alias } }
        const d = resp?.data;
        const fila: UsuarioFila | null = d
          ? { id: d.id, user: d.nombre ?? '', email: d.mail ?? '', alias: d.alias ?? null }
          : null;

        this.usuarios = fila ? [fila] : [];
        this.usuariosFiltrados = [...this.usuarios];
        this.page = 1; // reset página
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo cargar el usuario.';
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.loading = false;
      }
    });
  }

  // --- filtros ---
  public filtrarUsuarios(): void {
    const q = this.busqueda.trim().toLowerCase();
    this.usuariosFiltrados = !q
      ? [...this.usuarios]
      : this.usuarios.filter(u =>
          (u.user ?? '').toLowerCase().includes(q) ||
          (u.email ?? '').toLowerCase().includes(q) ||
          (u.alias ?? '').toLowerCase().includes(q)
        );
    this.page = 1; // reset
  }

  public editUser(): void {
    // TODO: tu lógica de edición
    console.log('Editar usuario');
  }

  // --- getters paginación ---
  get totalItems(): number {
    return this.usuariosFiltrados.length;
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }
  get usuariosPaginados(): UsuarioFila[] {
    const start = (this.page - 1) * this.pageSize;
    return this.usuariosFiltrados.slice(start, start + this.pageSize);
  }
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // --- acciones paginador ---
  public goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }
  public prevPage() { this.goToPage(this.page - 1); }
  public nextPage() { this.goToPage(this.page + 1); }
}
