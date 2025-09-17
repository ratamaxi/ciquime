import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesComponent} from './pages.component';
import {RouterModule} from '@angular/router';
import { InternalHeaderComponent } from '../components/internal-header/internal-header.component';
import { BuscarSubmenuComponent } from '../components/buscar-submenu/buscar-submenu.component';

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InternalHeaderComponent,
    BuscarSubmenuComponent
  ],
  exports: [PagesComponent]
})
export class PagesModule {
}
