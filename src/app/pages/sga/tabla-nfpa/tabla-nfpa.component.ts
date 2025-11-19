import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { RegistrosService } from 'src/app/services/registros.service';

export interface NfpaTransporteFicha {
  productName: string;
  supplier: string;
  fuente: string;
  nfpa: { salud: number | string; inflamabilidad: number | string; reactividad: number | string; otros: string; };
  transporte: { codRiesgo: string; nroOnu: string; grupoEmbalaje: string; clasImg: string; guia: string; };
}

@Component({
  selector: 'app-tabla-nfpa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-nfpa.component.html',
  styleUrls: ['./tabla-nfpa.component.scss']
})
export class TablaNfpaComponent {
  @Input() ficha!: NfpaTransporteFicha;
  @Output() fetClick = new EventEmitter<'A' | 'B'>();
  @Input() materiaId: number | string | null = null;

  constructor(
    private readonly registrosService: RegistrosService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  public getTransportImg(code: string | number | null | undefined): string {
    const v = String(code ?? '0').trim();      // asegura string (incluye '0')
    return `assets/iconos/${v}.png`;           // ej: assets/iconos/0.png
  }

  public onOpenFET(): void {
    const materiaId = this.resolveMateriaId();
    if (!materiaId) {
      console.warn('No se pudo determinar el ID de la materia para la FET.');
      return;
    }
    const url = this.registrosService.getFetUrl(materiaId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  public openPdfBotonB(): void {
    const url = this.assetUrl('assets/img/FIE_MERCOSUR_Parte_2.pdf');
    console.log(url)
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private resolveMateriaId(): string | null {
    if (typeof this.materiaId === 'number' && Number.isFinite(this.materiaId)) {
      return this.materiaId.toString();
    }
    if (typeof this.materiaId === 'string' && this.materiaId.trim()) {
      return this.materiaId.trim();
    }
    return null;
  }

  private assetUrl(path: string): string {
    try {
      const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      return new URL(path, this.document?.baseURI ?? fallbackOrigin).toString();
    } catch {
      return path;
    }
  }
}
