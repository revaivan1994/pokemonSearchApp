import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPokemons } from './pokemonApi';

describe('fetchPokemons', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('fetches pokemon by search term', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({
                name: 'pikachu',
                id: 25,
            }),
        });

        const result = await fetchPokemons('pikachu');

        expect(fetch).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon/pikachu'
        );

        expect(result).toEqual({
            results: [
                {
                    name: 'pikachu',
                    url: 'https://pokeapi.co/api/v2/pokemon/25',
                },
            ],
            count: 1,
        });
    });

    it('converts search term to lowercase', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({
                name: 'pikachu',
                id: 25,
            }),
        });

        await fetchPokemons('PIKACHU');

        expect(fetch).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon/pikachu'
        );
    });

    it('fetches default pokemon list when search is empty', async () => {
        const mockResponse = {
            results: [
                {
                    name: 'bulbasaur',
                    url: 'https://pokeapi.co/api/v2/pokemon/1',
                },
            ],
            count: 1,
        };

        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await fetchPokemons('');

        expect(fetch).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
        );

        expect(result).toEqual(mockResponse);
    });

    it('uses the provided search value when calling pokemon API', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => ({
                name: 'mewtwo',
                id: 150,
            }),
        });

        await fetchPokemons('   mewtwo   ');

        expect(fetch).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon/   mewtwo   '
        );
    });

    it('throws error when pokemon is not found', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(fetchPokemons('unknown')).rejects.toThrow(
            'Error 404: Pokémon not found'
        );
    });

    it('throws error when default fetch fails', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: false,
            status: 500,
        });

        await expect(fetchPokemons('')).rejects.toThrow(
            'Error 500: Failed to fetch'
        );
    });

    it('handles network errors', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error('Network Error')
        );

        await expect(fetchPokemons('pikachu')).rejects.toThrow(
            'Network Error'
        );
    });
});