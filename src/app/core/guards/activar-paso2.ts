import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PerfilFormService } from '@core/services/perfil-form';

export const activarPaso2Guard: CanActivateFn = (route, state) => {
  const perfilFormService = inject(PerfilFormService);
  const router = inject(Router);

  const validacion = perfilFormService.formularioValido();

  if (!validacion) {
    router.navigate(['/entrenador/crear-perfil']);
  }

  return validacion;
};
