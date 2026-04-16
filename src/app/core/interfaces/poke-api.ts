export interface PokemonPorGeneracionResponse {
  id: number;
  main_region: MainRegion;
  pokemon_species: PokemonGeneracionUno[];
  types: TipoPokemon[];
}

export interface MainRegion {
  name: string;
  url: string;
}

export interface PokemonGeneracionUno {
  name: string;
  url: string;
}

export interface TipoPokemon {
  name: string;
  url: string;
}

export interface PokemonPorNombreResponse {
  abilities: AbilityElement[];
  base_experience: number;
  height: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  weight: number;
}

export interface AbilityElement {
  ability: MoveClass;
  is_hidden: boolean;
  slot: number;
}

export interface MoveClass {
  name: string;
  url: string;
}

export interface Move {
  move: MoveClass;
}

export interface Sprites {
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
  other: Other;
}

export interface Other {
  home: Home;
}

export interface Home {
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: MoveClass;
}

export interface Type {
  slot: number;
  type: MoveClass;
}
