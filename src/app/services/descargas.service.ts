// src/app/services/descargas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SgaPeligroApi } from '../interfaces/descargas.interface';
import { wakeUpRetry } from '../utils/wake-up-retry';

type SgaTab = 'peligros' | 'epp' | 'nfpa' | 'tratamiento' | 'emergencia' | 'almacenamiento';

export interface EditarCertPayload {
  materiaId: number;
  usuarioId: number;
  cali: boolean;
  avisoEn: 30 | 60 | 90;
  doc1Vencimiento?: string;
  doc2Vencimiento?: string;
  oldNombreCalidoc?: string;
  oldNombreCalidoc2?: string;
  doc1?: File | null;
  doc2?: File | null;
}

@Injectable({ providedIn: 'root' })
export class DescargasService {
  private base_url: string = environment.baseUrl;

  private descargas = `${this.base_url}/descargas`;
  private utils = `${this.base_url}/utils/legacy`;
  private idEmpresa: string = localStorage.getItem('id_empresa') ?? '';

  constructor(private http: HttpClient) { }

  // ---------- SGA (por pestaña) ----------
  public getSgaPeligros(materiaId: number): Observable<any> {
    return this.http
      .get<SgaPeligroApi>(`${this.descargas}/sga/${materiaId}/peligros`)
      .pipe(wakeUpRetry());
  }
  public getSgaEpp(materiaId: number): Observable<any> {
    return this.http
      .get<any>(`${this.descargas}/sga/${materiaId}/epp`)
      .pipe(wakeUpRetry());
  }
  public getSgaNfpa(materiaId: number): Observable<any> {
    return this.http
      .get<any>(`${this.descargas}/sga/${materiaId}/nfpa`)
      .pipe(wakeUpRetry());
  }
  public getSgaTratamiento(materiaId: number): Observable<any> {
    return this.http
      .get<any>(`${this.descargas}/sga/${materiaId}/tratamiento`)
      .pipe(wakeUpRetry());
  }
  public getSgaEmergencia(materiaId: number): Observable<any> {
    return this.http
      .get<any>(`${this.descargas}/sga/${materiaId}/emergencia`)
      .pipe(wakeUpRetry());
  }
  public getSgaAlmacenamiento(materiaId: number): Observable<any> {
    return this.http
      .get<any>(`${this.descargas}/sga/${materiaId}/almacenamiento`)
      .pipe(wakeUpRetry());
  }

  /** Versión “dispatcher” si usás /sga/:materiaId?tab=peligros|epp|... */
  public getSgaByTab(materiaId: number, tab: SgaTab): Observable<any> {
    return this.http
      .get<any>(`${this.descargas}/sga/${materiaId}`, { params: { tab } })
      .pipe(wakeUpRetry());
  }

  // ---------- HSO / FET (redirigen al portal viejo desde tu backend) ----------
  /** Devuelve la URL final (Location) para abrir la HSO */
  getLegacyHSOUrl(materiaId: number): Observable<string> {
    return this.http.get(`${this.utils}/hs/${materiaId}`, {
      observe: 'response',
      responseType: 'text' as 'json'
    }).pipe(
      wakeUpRetry(),
      map((resp: HttpResponse<any>) => {
        const loc = resp.headers.get('Location');
        if (!loc) throw new Error('No se recibió Location en la respuesta');
        return loc;
      })
    );
  }

  /** Conveniencia: resuelve la URL y la abre en una nueva pestaña */
  openLegacyHSO(materiaId: number): void {
    this.getLegacyHSOUrl(materiaId).subscribe({
      next: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
      error: (e) => console.error('HSO error', e)
    });
  }

  /** (Opcional) FET si implementaste /legacy/fet/:materiaId en tu backend */
  getLegacyFETUrl(materiaId: number): Observable<string> {
    return this.http.get(`${this.utils}/fet/${materiaId}`, {
      observe: 'response',
      responseType: 'text' as 'json'
    }).pipe(
      wakeUpRetry(),
      map((resp: HttpResponse<any>) => {
        const loc = resp.headers.get('Location');
        if (!loc) throw new Error('No se recibió Location en la respuesta');
        return loc;
      })
    );
  }
  openLegacyFET(materiaId: number): void {
    this.getLegacyFETUrl(materiaId).subscribe({
      next: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
      error: (e) => console.error('FET error', e)
    });
  }

  public getPais(): Observable<any> {
    return this.http
      .get<any>(`${this.descargas}/pais/${this.idEmpresa}`)
      .pipe(wakeUpRetry());
  }

  public getEtiquetaMenos3LUrl(materiaId: number | string): string {
    return `${this.descargas}/etiquetas/menos-3l/${materiaId}`;
  }

  public getEtiquetaGenerica(materiaId: number | string, type: string): string {
    return `${this.descargas}/legacy/etiquetas/${type}/${materiaId}`;
  }

  public getCertificadosCalidad(idUsuario: string): Observable<any> {
    const body = {
      id_usuario: idUsuario
    }
    return this.http
      .post<any>(`${this.descargas}/certificados/calidad`, body)
      .pipe(wakeUpRetry({ maxAttempts: 5, baseDelayMs: 4000 }));
  }

    editarCertificadosCalidad(data: EditarCertPayload): Observable<any> {
    const fd = new FormData();

    fd.append('materiaId', String(data.materiaId ?? 0));
    fd.append('usuarioId', String(data.usuarioId ?? 0));
    // el back espera 1/0 para "requiere"
    fd.append('cali', data.cali ? '1' : '0');
    fd.append('avisoEn', String(data.avisoEn ?? 30));

    fd.append('doc1Vencimiento', data.doc1Vencimiento ?? '');
    fd.append('doc2Vencimiento', data.doc2Vencimiento ?? '');

    // nombres previos (por si no se suben archivos nuevos)
    fd.append('oldNombreCalidoc',  data.oldNombreCalidoc  ?? '');
    fd.append('oldNombreCalidoc2', data.oldNombreCalidoc2 ?? '');

    if (data.doc1) fd.append('doc1', data.doc1, data.doc1.name);
    if (data.doc2) fd.append('doc2', data.doc2, data.doc2.name);

    return this.http.post(`${this.descargas}/certificados-calidad/editar`, fd);
  }
}
