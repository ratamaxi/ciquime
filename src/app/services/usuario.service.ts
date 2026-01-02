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
  Subject,
  switchMap,
  startWith,
  catchError,
  EMPTY,
} from 'rxjs';
import { EmpresaTercero } from '../interfaces/user.interface';
import { wakeUpRetry } from '../utils/wake-up-retry';

export interface UserData {
  id_usuario: number;
  nombre?: string;
  razonSocial?: string;
  nombre_usuario?: string;
  razon_social?: string;
  alias?: string;
  id_empresa?: string;
  empresa?: { razonSocial?: string; nombre?: string };
}

export interface UsuarioDetalle {
  id: number;
  nombre: string;
  mail: string;
  alias: string | null;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly baseUrl = environment.baseUrl;

  private userRequest$?: Observable<UserData>;
  private api = '/api/descargas';

  // 🔥 NUEVO: señal para volver a cargar el usuario
  private readonly userReload$ = new Subject<void>();

  // 🔥 NUEVO: stream único que se re-emite cuando llamás refresh()
  private readonly userStream$: Observable<UserData>;

  constructor(private http: HttpClient) {
    this.userStream$ = this.userReload$.pipe(
      startWith(void 0), // carga inicial
      switchMap(() =>
        this.fetchUser().pipe(
          // si falla, no “mata” el stream (importante para no quedar colgado)
          catchError(() => EMPTY)
        )
      )
    );
  }

  // ✅ Tu lógica original, encapsulada
  private fetchUser(): Observable<UserData> {
    if (!this.userRequest$) {
      const userName = localStorage.getItem('user') ?? '';
      this.userRequest$ = this.http
        .get<UserData>(`${this.baseUrl}/usuario/data/usuario/${userName}`)
        .pipe(
          wakeUpRetry(),
          tap((u: UserData) => {
            localStorage.setItem('idUser', String(u.id_usuario));
            localStorage.setItem('id_empresa', String(u.id_empresa));
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );
    }
    return this.userRequest$;
  }

  /** ✅ Ahora user$ SI se actualiza cuando llamás refresh() */
  public get user$(): Observable<UserData> {
    return this.userStream$;
  }

  public clearUserCache(): void {
    this.userRequest$ = undefined;
  }

  /** Acceso directo sólo al id */
  public get userId$(): Observable<number> {
    return this.user$.pipe(map((u) => u.id_usuario));
  }

  public prefetch(): Promise<void> {
    return firstValueFrom(this.user$)
      .then(() => undefined)
      .catch(() => undefined);
  }

  /**
   * ✅ Mantiene tu comportamiento, pero además notifica a todos los suscriptores
   */
  public refresh(username?: string): void {
    if (username) localStorage.setItem('user', username);
    this.userRequest$ = undefined; // invalida caché
    this.userReload$.next();       // 🔥 fuerza re-emisión a quienes estén suscriptos
  }

  public getEmpresas(): Observable<EmpresaTercero[]> {
    return this.http
      .get<EmpresaTercero[]>(`${this.baseUrl}/usuario/empresas`)
      .pipe(
        wakeUpRetry(),
        map(rows => (rows ?? []).map(e => ({
          id: Number(e.id),
          noemp: e.noemp
        }))),
      );
  }

  public getDataUsuario(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/usuario/info/usuario/${id}`)
      .pipe(wakeUpRetry());
  }

  public updateUsuario(
    id: string | number,
    data: { correo: string; alias?: string | null; contrasena?: string }
  ): Observable<any> {
    const body: any = {
      mail: data.correo,
      alias: data.alias ?? null,
    };

    if (data.contrasena && data.contrasena.trim().length > 0) {
      body.password = data.contrasena.trim();
    }

    return this.http
      .put(`${this.baseUrl}/usuario/info/usuario/${id}`, body)
      .pipe(wakeUpRetry());
  }
}
