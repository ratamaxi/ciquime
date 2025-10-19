// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  Observable,
  map,
  tap,
  shareReplay,
  firstValueFrom,
} from 'rxjs';
import { EmpresaTercero } from '../interfaces/user.interface';

export interface UserData {
  id_usuario: number;
  nombre?: string;
  razonSocial?: string;
  nombre_usuario?: string;
  razon_social?: string;
  id_empresa?: string;
  empresa?: { razonSocial?: string; nombre?: string };
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly baseUrl = environment.baseUrl;

  private userRequest$?: Observable<UserData>;

  constructor(private http: HttpClient) {}

  /**
   * Devuelve un observable con los datos del usuario actual.
   * - Hace UNA sola petición y la cachea (shareReplay(1)).
   * - Guarda id en localStorage cuando llega.
   */
  get user$(): Observable<UserData> {
    if (!this.userRequest$) {
      const userName = localStorage.getItem('user') ?? '';
      this.userRequest$ = this.http
        .get<UserData>(`${this.baseUrl}/usuario/data/usuario/${userName}`)
        .pipe(
          tap((u: UserData) => {
            localStorage.setItem('idUser', String(u.id_usuario))
            localStorage.setItem('id_empresa', String(u.id_empresa))
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );
    }
    return this.userRequest$;
  }

  /** Acceso directo sólo al id (también cacheado). */
  get userId$(): Observable<number> {
    return this.user$.pipe(map((u) => u.id_usuario));
  }

  /**
   * Fuerza la carga del usuario (útil para APP_INITIALIZER).
   * La app espera a que esto resuelva antes de bootstrappear.
   */
  public prefetch(): Promise<void> {
    return firstValueFrom(this.user$)
      .then(() => undefined)
      .catch(() => undefined); // no bloquear arranque si falla
  }

  /**
   * Permite refrescar el usuario (por ejemplo si cambia el username al loguearse).
   * Si pasás un username, lo persiste y rehace la caché.
   */
  public refresh(username?: string): void {
    if (username) localStorage.setItem('user', username);
    this.userRequest$ = undefined; // invalida caché
    // opcional: disparar el fetch de nuevo:
    void this.prefetch();
  }

  public getEmpresas(): Observable<EmpresaTercero[]> {
  return this.http
    .get<EmpresaTercero[]>(`${this.baseUrl}/usuario/empresas`)
    .pipe(
      // Aseguro tipos y opcionalmente normalizo acentos
      map(rows => (rows ?? []).map(e => ({
        id: Number(e.id),
        noemp: e.noemp
      }))),
    );
}
}
