import { Routes } from '@angular/router';
import { activarPaso2Guard } from '@core/guards/activar-paso2';
import { activarPaso3Guard } from '@core/guards/activar-paso3';
import { Home } from '@features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'entrenador',
    loadComponent: () => import('@features/stepper/stepper').then((m) => m.Stepper),
    children: [
      { path: '', redirectTo: 'crear-perfil', pathMatch: 'full' },
      {
        path: 'crear-perfil',
        loadComponent: () =>
          import('@features/crear-perfil/crear-perfil').then((m) => m.CrearPerfil),
      },
      {
        path: 'escoger-pokemon',
        loadComponent: () =>
          import('@features/escoger-pokemon/escoger-pokemon').then((m) => m.EscogerPokemon),
        canActivate: [activarPaso2Guard],
      },
      {
        path: 'ver-perfil-completo',
        loadComponent: () =>
          import('@features/ver-perfil-completo/ver-perfil-completo').then(
            (m) => m.VerPerfilCompleto,
          ),
        canActivate: [activarPaso2Guard, activarPaso3Guard],
      },
    ],
  },
];
