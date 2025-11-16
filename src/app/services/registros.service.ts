import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgregarInsumoAUsuario, BuscarInsumoQuery, BuscarInsumoResponseItem, BuscarInsumoUI, CrearInsumoResp, CrearSgaResp, EditarInsumoRequest, EstadisticasInsumosData, Estado, InsertResponse, Insumo } from '../interfaces/registros.interface';
import { FdsResponse } from '../interfaces/descargas.interface';
import { CertificadoResumenItem } from '../components/certificados-resumen/certificados-resumen.component';
import { wakeUpRetry } from '../utils/wake-up-retry';


interface ApiResp {
  ok: boolean;
  data: any[];
  msg?: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrosService {
  private base_url: string = environment.baseUrl;
  private idUsuario: string | null = localStorage.getItem('idUser');

  constructor(private http: HttpClient) { }

  public obtenerRegistroData(userId: number): Observable<any> {
    return this.http
      .get<any>(`${this.base_url}/registros/data/${userId}`)
      .pipe(wakeUpRetry());
  }

  public obtenerEstadisticaInsumo(usuarioId: number): Observable<EstadisticasInsumosData> {
    return this.http
      .get<EstadisticasInsumosData>(`${this.base_url}/registros/estadistica/${usuarioId}`, { params: { usuarioId } as any })
      .pipe(
        wakeUpRetry(),
        map(r => ({
          aprobados: r?.aprobados ?? 0,
          pendientes: r?.pendientes ?? 0,
          rechazados: r?.rechazados ?? 0,
        })),
      );
  }

  public buscarInsumosDisponibles(
    usuarioId: number,
    opts: BuscarInsumoQuery
  ): Observable<BuscarInsumoUI[]> {
    const params = new HttpParams({
      fromObject: {
        insumo: (opts.insumo ?? '').trim(),
        fabricante: (opts.fabricante ?? '').trim(),
        limit: String(opts.limit ?? 10),
        offset: String(opts.offset ?? 0),
        // si tu backend filtra por empid, descomentá:
        // empid: opts.empid != null ? String(opts.empid) : ''
      },
    });

    return this.http
      .get<BuscarInsumoResponseItem[]>(
        `${this.base_url}/registros/registros/${usuarioId}`,
        { params }
      )
      .pipe(
        wakeUpRetry(),
        map(rows =>
          (rows ?? []).map((r): BuscarInsumoUI => {
            // Fix opcional de acentos rotos (ej: EspaÃ±ol)
            const fixLatin1 = (s: string) => {
              try { return decodeURIComponent(escape(s)); } catch { return s; }
            };
            return {
              // datos “crudos” del back (con tipos correctos)
              Nfile_name: fixLatin1(r.Nfile_name),
              id: Number(r.id),
              matid: Number(r.matid),
              empid: Number(r.empid),
              nombre_producto: r.nombre_producto,
              fabricante: r.fabricante,
              revisionFDS: r.revisionFDS,
              fecha_insert: r.fecha_insert,
              fdsUrl: r.fdsUrl,

              // alias requeridos para la vista
              producto: r.nombre_producto,
              revFDS: r.revisionFDS,
              fechaFDS: r.fecha_insert,
            };
          })
        ),
        catchError(err => {
          console.error('[buscarInsumosDisponibles] error', err);
          return of<BuscarInsumoUI[]>([]);
        })
      );
  }

  // (ojo con el nombre, lo dejé como lo tenías)
  public instertarInsumoUsuario(userId: number): Observable<any> {
    return this.http
      .get<any>(`${this.base_url}/registros/data/${userId}`)
      .pipe(wakeUpRetry());
  }

  public addInsumos(
    idUsuario: number,
    empresaId: number,
    materiaId: number | number[],
    token?: string
  ): Observable<InsertResponse> {
    const url = `${this.base_url}/registros/insertar/insumo/${idUsuario}`;
    const body = {
      id_empresa: empresaId,
      materia_id: materiaId
    };

    // Header Authorization opcional (si usás JWT)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const t = token ?? localStorage.getItem('token') ?? '';
    if (t) headers = headers.set('Authorization', `Bearer ${t}`);

    return this.http.post<InsertResponse>(url, body, { headers }).pipe(
      wakeUpRetry(),
      catchError((err) => {
        const msg = err?.error?.msj || 'Error al insertar insumos';
        return throwError(() => new Error(msg));
      })
    );
  }

  public crearInsumo(
    idUsuario: number,
    formData: FormData,
    token?: string
  ) {
    const url = `${this.base_url}/registros/insumo/${idUsuario}`;

    let headers = new HttpHeaders(); // ¡sin Content-Type!
    const t = token ?? localStorage.getItem('token') ?? '';
    if (t) headers = headers.set('Authorization', `Bearer ${t}`);

    return this.http.post<CrearInsumoResp>(url, formData, { headers }).pipe(
      wakeUpRetry({ maxAttempts: 5 }),
      catchError(err => {
        const msg = err?.error?.msj || 'Error al registrar insumo';
        return throwError(() => new Error(msg));
      })
    );
  }

  public getInsumosParaEditar(estado: Estado, idUsuario: number) {
    const url = `${this.base_url}/registros/ver/editar/insumo/${idUsuario}/${estado}`;
    return this.http.get<ApiResp>(url).pipe(
      wakeUpRetry(),
      // 👈 invocá la función curried con el estado
      map(resp => (resp?.data ?? []).map(this.mapRowToInsumo(estado))),
      catchError(err => {
        console.error('getInsumosParaEditar error', err);
        return of([] as Insumo[]);
      })
    );
  }

  public fdsUrl(fileName?: string) {
    if (!fileName) return null;
    return `${this.base_url}/uploads/fds/${encodeURIComponent(fileName)}`;
  }

  // ---- helpers privados ----
  private mapRowToInsumo = (estado: Estado) => (row: any): Insumo => ({
    id: String(row.materia_id),
    codigoAprobacion: row.apr_code ?? undefined,
    nombreInterno: row.extraname ?? undefined,
    nombreCalidoc: row.nombre_calidoc ?? undefined,
    producto: row.nombre_producto,
    fabricante: row.razonSocial,
    fechaFds: this.toISO(row.FDS_fecha),
    fds: row.fds ?? row.Nfile_name,
    estado, // <- clave
  });

  private toISO(dateLike: string): string {
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) return dateLike;
    return d.toISOString().slice(0, 10);
  }

  public eliminarInsumo(body: any): Observable<any> {
    let apiUrl = `${this.base_url}/registros/eliminar/insumo`;
    return this.http.post(apiUrl, body).pipe(wakeUpRetry());
  }

  public obtenerDataEditarUsuario(matempresa: string, empresa_id: string, usuario_id: string): Observable<any> {
    let apiUrl = `${this.base_url}/registros/data/editar/insumo/${matempresa}/${empresa_id}/${usuario_id}`;
    return this.http.get(apiUrl).pipe(wakeUpRetry());
  }

  public obtenerDataSectorInsumo(empresa_id: string): Observable<any> {
    let apiUrl = `${this.base_url}/registros/data/sector/insumo/${empresa_id}`;
    return this.http.get(apiUrl).pipe(wakeUpRetry());
  }

  public obtenerDataFds(): Observable<FdsResponse> {
    const apiUrl = `${this.base_url}/descargas/data/${this.idUsuario}`;
    return this.http.get<FdsResponse>(apiUrl).pipe(wakeUpRetry());
  }

  public getHsUrl(materiaId: string): string {
    return `${this.base_url}/utils/legacy/hs/${encodeURIComponent(materiaId)}`;
  }

  public getFetUrl(materiaId: string): string {
    return `${this.base_url}/utils/legacy/fet/${encodeURIComponent(materiaId)}`;
  }

  public modificarInsumo(body: EditarInsumoRequest): Observable<void> {
    const apiUrl = `${this.base_url}/registros/modificar/insumo/${this.idUsuario}`;
    return this.http.put<void>(apiUrl, body).pipe(wakeUpRetry());
  }

  public agregarInsumoUsuario(body: AgregarInsumoAUsuario): Observable<void> {
      const apiUrl = `${this.base_url}/registros/agregar/insumo/usuario`;
      return this.http.post<void>(apiUrl, body).pipe(wakeUpRetry());
  }

   public obtenerCertificadoAVencer(): Observable<{ok: boolean, data:  CertificadoResumenItem[]}> {
    const apiUrl = `${this.base_url}/registros/obtener/certificados/${this.idUsuario}`;
    return this.http
      .get<{ok: boolean, data:  CertificadoResumenItem[]}>(apiUrl)
      .pipe(wakeUpRetry());
  }
}
