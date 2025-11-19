# CIQUIME

Aplicación web en Angular 16 para la gestión de insumos, certificados y recursos de CIQUIME. El proyecto incluye autenticación, panel interno con distintas vistas operativas y componentes reutilizables para gráficos, tablas y formularios.

## Requisitos previos
- Node.js 18+
- npm 9+
- Angular CLI 16 (`npm install -g @angular/cli`)

## Instalación y ejecución
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Variables de entorno: el backend se configura desde `src/environments/environment.ts` (`baseUrl`).
3. Servidor de desarrollo:
   ```bash
   npm start
   ```
   La aplicación se sirve en `http://localhost:4200/` y recarga automáticamente con cada cambio.
4. Compilación de producción:
   ```bash
   npm run build
   ```
5. Pruebas unitarias (Karma + Jasmine):
   ```bash
   npm test
   ```

## Estructura del proyecto
```
ciquime/
├─ angular.json              # Configuración de build y proyectos Angular
├─ package.json              # Scripts de npm y dependencias
├─ src/
│  ├─ main.ts                # Punto de entrada de la aplicación
│  ├─ styles.scss            # Estilos globales
│  ├─ index.html             # HTML raíz
│  ├─ environments/
│  │  └─ environment.ts     # Variables de entorno (baseUrl)
│  ├─ assets/                # Recursos estáticos
│  └─ app/
│     ├─ app.module.ts       # Módulo raíz
│     ├─ app-routing.module.ts# Definición de rutas públicas y protegidas
│     ├─ components/         # Componentes compartidos
│     │  ├─ actividades-item/
│     │  ├─ buscar-submenu/
│     │  ├─ certificados-calidad/
│     │  ├─ certificados-resumen/
│     │  ├─ chart-card/
│     │  ├─ editar-certificado-calidad/
│     │  ├─ editar-usuario/
│     │  ├─ estadisticas/
│     │  ├─ internal-header/
│     │  ├─ spinner/
│     │  ├─ status-card/
│     │  ├─ tabla-descargar/
│     │  └─ tabla-home/
│     ├─ pages/              # Páginas del panel y login
│     │  ├─ login/           # Autenticación y guardias
│     │  ├─ home/
│     │  ├─ ayuda-videos/
│     │  ├─ data-usuario/
│     │  ├─ editar-insumo/
│     │  ├─ etiquetas/
│     │  ├─ registro-insumo/
│     │  ├─ buscar-insumo/
│     │  ├─ ver-insumo/
│     │  ├─ descarga-etiqueta/
│     │  ├─ descarga-fds/
│     │  ├─ descarga-fet/
│     │  ├─ descarga-hso/
│     │  └─ sga/ (incluye detalle `sga-seleccionado`)
│     ├─ services/           # Servicios para API y autenticación
│     ├─ interfaces/         # Tipados de dominio
│     ├─ utils/              # Utilidades comunes
│     └─ pipe/               # Pipes personalizados
└─ tsconfig*.json            # Configuración de TypeScript
```

## Enrutamiento y módulos
- `AppModule` importa el módulo de login y el módulo `PagesModule` que encapsula el layout interno.
- `AppRoutingModule` define la ruta pública `/login` y el prefijo protegido `/panel` con guardas (`AuthGuard`, `AuthChildGuard`). Dentro del panel se organizan las vistas de ayuda, SGA, gestión de insumos, descargas y certificados.

## Tecnologías principales
- Angular 16 con TypeScript
- Angular Material CDK
- ng2-charts + Chart.js para gráficas
- SweetAlert2 para notificaciones
- Karma + Jasmine para pruebas unitarias

## Convenciones y buenas prácticas
- Los estilos globales se centralizan en `src/styles.scss`; los estilos de componentes usan SCSS aislado.
- Las interfaces de datos residen en `src/app/interfaces` para mantener tipado consistente en servicios y componentes.
- Las utilidades compartidas viven en `src/app/utils` y los pipes personalizados en `src/app/pipe`.

## Soporte y enlaces útiles
- Documentación Angular CLI: https://angular.io/cli
- Chart.js: https://www.chartjs.org/
- SweetAlert2: https://sweetalert2.github.io/
