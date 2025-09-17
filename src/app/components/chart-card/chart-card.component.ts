import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

// ¡Registrar el plugin una sola vez!
Chart.register(DataLabelsPlugin);

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnChanges {
  @Input() title = '';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() legendItems: { color: string; label: string }[] = [];
  @Input() maxCanvasWidth = 360; // para limitar tamaño del gráfico

  private defaultColors = ['#84C5F4', '#F8DA8A', '#7DD3A7', '#F5A3A3'];

  public doughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [], borderWidth: 0 }],
  };

  // ÚNICO bloque de opciones
  public doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,   // círculo perfecto
    aspectRatio: 1,               // 1:1
    layout: { padding: 8 },
    cutout: '60%',
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true } },
      tooltip: { enabled: true },
      datalabels: {
        color: '#111',
        clamp: true,
        clip: false,
        font: { weight: 'bold' },
        // Muestra % aunque le pases valores absolutos
        formatter: (_value, ctx) => {
          const dataset = ctx.chart.data.datasets[0]?.data as number[] || [];
          const total = dataset.reduce((a, b) => a + (Number(b) || 0), 0);
          const val = Number(dataset[ctx.dataIndex] || 0);
          if (!total || !val) return '';
          return `${Math.round((val / total) * 100)}%`;
        },
      },
    },
  };

  ngOnChanges(): void {
    const colors = this.legendItems?.length
      ? this.legendItems.map(i => i.color)
      : this.defaultColors.slice(0, this.data.length);

    this.doughnutData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };
  }
}
