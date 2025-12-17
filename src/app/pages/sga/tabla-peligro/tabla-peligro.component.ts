import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SgaFicha } from 'src/app/interfaces/descargas.interface';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-tabla-peligro',
  standalone: true,
  templateUrl: './tabla-peligro.component.html',
  styleUrls: ['./tabla-peligro.component.scss'],
  imports: [CommonModule]
})
export class TablaPeligroComponent {
  @Input() ficha!: SgaFicha;
  @Input() materiaId!: number;

  // referencia al div que queremos convertir en PDF
  @ViewChild('printSection') printSection!: ElementRef<HTMLDivElement>;

  getPictogramUrl(code: string): string {
    return `assets/iconos/${code}.png`; // todos son PNG
  }

  // trackBy que usa el propio código como identidad
  trackByCode(_index: number, code: string): string {
    return code;
  }

  // NUEVO: generar PDF solo de la ficha
  async onPrint(): Promise<void> {
    const element = this.printSection?.nativeElement;
    if (!element) {
      console.error('No se encontró el elemento printSection');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,          // mejor calidad
        useCORS: true,
        scrollY: -window.scrollY // evita recortes por scroll
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let y = 0;
      let remainingHeight = imgHeight;

      // si la ficha es más alta que una página, la cortamos en varias
      const canvasHeight = canvas.height;
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');

      if (!pageCtx) {
        console.error('No se pudo obtener el contexto 2D del canvas');
        return;
      }

      pageCanvas.width = canvas.width;
      pageCanvas.height = canvas.height;

      // Si entra en una sola página, fácil:
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Varios “trozos” verticales
        const ratio = pageWidth / canvas.width;
        const pagePixelHeight = pageHeight / ratio;

        let position = 0;
        let first = true;

        while (remainingHeight > 0) {
          // limpiar canvas auxiliar
          pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);

          // recortar parte del canvas original
          pageCtx.drawImage(
            canvas,
            0,
            position,
            canvas.width,
            pagePixelHeight,
            0,
            0,
            canvas.width,
            pagePixelHeight
          );

          const pageData = pageCanvas.toDataURL('image/png');
          const pageHeightMm = (pagePixelHeight * pageWidth) / canvas.width;

          if (!first) {
            pdf.addPage();
          } else {
            first = false;
          }

          pdf.addImage(pageData, 'PNG', 0, 0, pageWidth, pageHeightMm);

          position += pagePixelHeight;
          remainingHeight -= pagePixelHeight;
        }
      }

      // abrir en nueva pestaña (como antes se abría la ventana de impresión)
      const blobUrl = pdf.output('bloburl');
      window.open(blobUrl, '_blank');
      // si prefieres descarga directa:
      // pdf.save(`${this.ficha?.productName || 'ficha-sga'}.pdf`);

    } catch (e) {
      console.error('Error generando PDF', e);
    }
  }

  // Si algún día querés volver al PDF del servidor, puedes dejar aquí comentado:
  /*
  private readonly base_url_ciquime = environment.base_url_ciquime;

  oldOnPrint(): void {
    if (!this.materiaId) {
      alert('No se pudo generar el PDF (materiaId no disponible).');
      return;
    }
    const encId = encodeURIComponent(String(this.materiaId));
    const url = `${this.base_url_ciquime}/sga_pdf.php?id=${encId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  */
}
