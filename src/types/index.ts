export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetail {
  name: string;
  id: number;
  base_experience: number;
}

export interface ApiResponse {
  results: Pokemon[];
  count: number;
}

export interface AppState {
  items: Pokemon[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}