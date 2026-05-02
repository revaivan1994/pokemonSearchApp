import type { ApiResponse } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemons(search: string): Promise<ApiResponse> {
  if (search.trim()) {
    const res = await fetch(`${BASE_URL}/pokemon/${search.toLowerCase()}`);
    if (!res.ok) throw new Error(`Error ${res.status}: Pokémon not found`);
    const data = await res.json();
    return {
      results: [{ name: data.name, url: `${BASE_URL}/pokemon/${data.id}` }],
      count: 1,
    };
  } else {
    const res = await fetch(`${BASE_URL}/pokemon?limit=20&offset=0`);
    if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch`);
    return res.json();
  }
}