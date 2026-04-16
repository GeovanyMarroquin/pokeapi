import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { from, mergeMap, tap } from 'rxjs';
import { Searchbox } from '@shared/components/searchbox/searchbox';
import { PerfilEntrenador } from '@core/interfaces/perfil-entrenador';
import { PerfilFormService } from '@core/services/perfil-form';
import { EscogerPokemonService } from '@core/services/escoger-pokemon';
import { PokemonGeneracionUno } from '@core/interfaces/poke-api';

@Component({
  selector: 'app-escoger-pokemon',
  imports: [Searchbox, ScrollingModule],
  templateUrl: './escoger-pokemon.html',
  styleUrls: ['./escoger-pokemon.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscogerPokemon implements OnInit {
  private readonly perfilForm = inject(PerfilFormService);
  readonly escogerPokemonService = inject(EscogerPokemonService);
  readonly formGroup = this.perfilForm.form;
  readonly formValues = computed(() => this.formGroup.value as PerfilEntrenador);
  public perfilEntrenador!: PerfilEntrenador;

  readonly pokemonesGeneracionUno = this.escogerPokemonService.pokemonesGeneracionUno;
  readonly pokemonesVisibles = this.escogerPokemonService.pokemonesVisibles;
  readonly pokemonesDetalle = this.escogerPokemonService.pokemonesDetalle;
  readonly pokemonesSeleccionados = this.escogerPokemonService.pokemonesSeleccionados;
  readonly fotoUrl = this.perfilForm.fotoUrl;

  private readonly PAGE_SIZE = 9;
  private readonly INITIAL_SIZE = 12;

  readonly pokemonFilas = computed(() => {
    const lista = this.pokemonesVisibles();
    const filas: PokemonGeneracionUno[][] = [];
    for (let i = 0; i < lista.length; i += 3) {
      filas.push(lista.slice(i, i + 3));
    }
    return filas;
  });

  ngOnInit(): void {
    // Llenar los datos antes de mostrar el formulario
    this.formatearDatos();
    this.llenarListaPokemonesInicial();
  }

  formatearDatos(): void {
    const opcionesSeleccionadas = this.perfilForm.selectOptions
      .filter((o) => this.formValues().pasatiempo?.includes(o.value))
      .map((o) => o.label);

    const copiaFormulario: PerfilEntrenador = { ...this.formValues() };
    copiaFormulario.pasatiempo = opcionesSeleccionadas;
    copiaFormulario.edad = this.perfilForm.calcularEdad(this.formValues().cumpleanos);

    this.perfilEntrenador = copiaFormulario;
  }

  buscarPokemon(query: string): void {
    const todos = this.pokemonesGeneracionUno();
    const termino = query.trim().toLowerCase();

    if (termino === '') {
      this.pokemonesVisibles.set(todos.slice(0, this.INITIAL_SIZE));
      this.fetchDetalles(todos.slice(0, this.INITIAL_SIZE));
      return;
    }

    const resultado = todos.filter((p) => p.name.toLowerCase().includes(termino));
    const visibles = resultado.length > 0 ? resultado : todos.slice(0, this.INITIAL_SIZE);
    this.pokemonesVisibles.set(visibles);
    this.fetchDetalles(visibles);
  }

  seleccionarPokemon(nombre: string): void {
    const detalle = this.pokemonesDetalle().get(nombre);
    if (!detalle) return;

    this.pokemonesSeleccionados.update((map) => {
      const nuevo = new Map(map);
      if (nuevo.has(nombre)) {
        nuevo.delete(nombre);
      } else if (nuevo.size < this.escogerPokemonService.TOTAL_POKEMON_REQUERIDOS) {
        nuevo.set(nombre, detalle);
      }
      return nuevo;
    });
  }

  private fetchDetalles(pokemons: PokemonGeneracionUno[]): void {
    const mapaActual = this.pokemonesDetalle();
    const sinDetalle = pokemons.filter((p) => !mapaActual.has(p.name));

    from(sinDetalle)
      .pipe(
        mergeMap((pokemon) =>
          this.escogerPokemonService.obtenerInformacionPokemon(pokemon.name).pipe(
            tap((detalle) => {
              this.pokemonesDetalle.update((map) => new Map(map).set(pokemon.name, detalle));
            }),
          ),
        ),
      )
      .subscribe();
  }

  llenarListaPokemonesInicial(): void {
    this.escogerPokemonService
      .obtenerPokemonesPorGeneracion(1)
      .subscribe((response: PokemonGeneracionUno[]) => {
        // console.log('Pokémon de la primera generación:', response);
        this.pokemonesGeneracionUno.set(response);
        this.pokemonesVisibles.set(response.slice(0, this.INITIAL_SIZE));
        this.fetchDetalles(response.slice(0, this.INITIAL_SIZE));
      });
  }

  cargarMas(): void {
    const actuales = this.pokemonesVisibles().length;
    const todos = this.pokemonesGeneracionUno();
    if (actuales >= todos.length) return;
    const nuevos = todos.slice(actuales, actuales + this.PAGE_SIZE);
    this.pokemonesVisibles.set(todos.slice(0, actuales + this.PAGE_SIZE));
    this.fetchDetalles(nuevos);
  }

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
      this.cargarMas();
    }
  }
}
