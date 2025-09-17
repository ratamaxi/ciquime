import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";

@Component({
  selector: 'app-ayuda-videos',
  templateUrl: './ayuda-videos.component.html',
  styleUrls: ['./ayuda-videos.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AyudaVideosComponent {
  public videoSelector: string = '';
  public tituloVideo: string = '';

  public seleccionarVideo(opt: string, titulo:string):void{
    this.videoSelector = opt;
    this.tituloVideo = titulo;
  }

}
