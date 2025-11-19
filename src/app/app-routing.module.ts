import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard, AuthChildGuard } from './pages/login/login-core/auth.guard';
import { AyudaVideosComponent } from './pages/ayuda-videos/ayuda-videos.component';
import { DataUsuarioComponent } from './pages/data-usuario/data-usuario.component';
import { SgaComponent } from './pages/sga/sga.component';
import { EtiquetasComponent } from './pages/etiquetas/etiquetas.component';
import { BuscarInsumoComponent } from './pages/buscar-insumo/buscar-insumo.component';
import { RegistroInsumoComponent } from './pages/registro-insumo/registro-insumo.component';
import { VerInsumoComponent } from './pages/ver-insumo/ver-insumo.component';
import { EditarInsumoComponent } from './pages/editar-insumo/editar-insumo.component';
import { DescargaFetComponent } from './pages/descarga-fet/descarga-fet.component';
import { DescargaHsoComponent } from './pages/descarga-hso/descarga-hso.component';
import { DescargaFdsComponent } from './pages/descarga-fds/descarga-fds.component';
import { DescargaEtiquetaComponent } from './pages/descarga-etiqueta/descarga-etiqueta.component';
import { SgaSeleccionadoComponent } from './pages/sga/sga-seleccionado/sga-seleccionado.component';
import { CertificadosCalidadComponent } from './components/certificados-calidad/certificados-calidad.component';
import { EditarCertificadoCalidadComponent } from './components/editar-certificado-calidad/editar-certificado-calidad.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'panel',
    component: PagesComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthChildGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'ayuda-video', component: AyudaVideosComponent },
      { path: 'data-user', component: DataUsuarioComponent },
      { path: 'sga', component: SgaComponent },
      { path: 'sga/detalle', component: SgaSeleccionadoComponent },
      { path: 'buscar-insumos', component: BuscarInsumoComponent },
      { path: 'registro-insumo', component: RegistroInsumoComponent },
      { path: 'ver-insumo', component: VerInsumoComponent },
      { path: 'editar-insumo', component: EditarInsumoComponent },
      { path: 'descarga-fet', component: DescargaFetComponent },
      { path: 'descarga-hso', component: DescargaHsoComponent },
      { path: 'descarga-fds', component: DescargaFdsComponent },
      { path: 'etiquetas', component: EtiquetasComponent },
      { path: 'descarga-etiqueta', component: DescargaEtiquetaComponent },
      {path: 'certificados-calidad', component: CertificadosCalidadComponent},
      {path: 'certificados-calidad/editar', component: EditarCertificadoCalidadComponent },
      { path: 'data-user/editar', component: EditarUsuarioComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
