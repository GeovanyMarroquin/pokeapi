import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PerfilEntrenador } from '@core/interfaces/perfil-entrenador';
import { EscogerPokemonService } from '@core/services/escoger-pokemon';
import { PerfilFormService } from '@core/services/perfil-form';
import { PokemonPorNombreResponse } from '@core/interfaces/poke-api';

@Component({
  selector: 'app-ver-perfil-completo',
  imports: [ScrollingModule],
  templateUrl: './ver-perfil-completo.html',
  styleUrls: ['./ver-perfil-completo.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerPerfilCompleto {
  private readonly perfilForm = inject(PerfilFormService);
  private readonly escogerPokemon = inject(EscogerPokemonService);
  perfilEntrenador: PerfilEntrenador = this.perfilForm.perfilEntrenador();
  readonly fotoUrl = this.perfilForm.fotoUrl;
  readonly pokemonesSeleccionados = this.escogerPokemon.pokemonesSeleccionados;
  readonly pokemonesSeleccionadosArray = computed(() =>
    Array.from(this.pokemonesSeleccionados().values()),
  );

  readonly statInfo: Record<string, { label: string; max: number }> = {
    hp: { label: 'HP', max: 255 },
    attack: { label: 'Ataque', max: 190 },
    defense: { label: 'Defensa', max: 230 },
    'special-attack': { label: 'Ataque especial', max: 194 },
    'special-defense': { label: 'Defensa especial', max: 230 },
    speed: { label: 'Velocidad', max: 180 },
  };

  obtenerTipos(pokemon: PokemonPorNombreResponse) {
    // console.log({ pokemon });

    return pokemon.types.map((t) => t.type.name).join(', ');
  }
}
