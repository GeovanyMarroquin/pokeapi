import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EscogerPokemonService } from '../services/escoger-pokemon';

export const activarPaso3Guard: CanActivateFn = (route, state) => {
  const escogerPokemonService = inject(EscogerPokemonService);
  const router = inject(Router);

  const validacion =
    escogerPokemonService.pokemonesSeleccionados().size ===
    escogerPokemonService.TOTAL_POKEMON_REQUERIDOS;

  if (!validacion) {
    router.navigate(['/']);
  }

  return validacion;
};
