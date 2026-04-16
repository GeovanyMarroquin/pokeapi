import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { HttpCustomClient } from './http-custom-client';
import {
  PokemonGeneracionUno,
  PokemonPorGeneracionResponse,
  PokemonPorNombreResponse,
} from '@core/interfaces/poke-api';
import { Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EscogerPokemonService {
  httpClient = inject(HttpCustomClient);

  readonly pokemonesBuscados: WritableSignal<PokemonGeneracionUno[]> = signal([]);
  readonly pokemonesGeneracionUno: WritableSignal<PokemonGeneracionUno[]> = signal([]);
  readonly pokemonesVisibles: WritableSignal<PokemonGeneracionUno[]> = signal([]);
  readonly pokemonesDetalle = signal<Map<string, PokemonPorNombreResponse>>(new Map());
  readonly pokemonesSeleccionados = signal<Map<string, PokemonPorNombreResponse>>(new Map());
  readonly TOTAL_POKEMON_REQUERIDOS = 3;

  constructor() {}

  obtenerPokemonesPorGeneracion(generacion: number = 1): Observable<PokemonGeneracionUno[]> {
    if (this.pokemonesBuscados().length > 0) {
      return of(this.pokemonesBuscados());
    }

    const url = `/generation/${generacion}`;

    return this.httpClient.get<PokemonPorGeneracionResponse>(url, {}).pipe(
      tap((response) => {
        // console.log('Respuesta de la API:', response);
        this.pokemonesBuscados.set(response.pokemon_species);
      }),
      switchMap((response) => of(response.pokemon_species)),
    );
  }

  obtenerInformacionPokemon(termino: string): Observable<PokemonPorNombreResponse> {
    const url = `/pokemon/${termino.toLowerCase()}`;
    return this.httpClient.get<PokemonPorNombreResponse>(url);
  }
}
