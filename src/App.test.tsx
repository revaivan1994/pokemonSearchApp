import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import * as pokemonApi from './api/pokemonApi';
import type { ApiResponse } from './types';

vi.mock('./api/pokemonApi');

describe('App Component', () => {
    const mockPokemonList: ApiResponse = {
        results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25' },
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
            { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4' }
        ],
        count: 3
    };

    const mockSinglePokemon: ApiResponse = {
        results: [
            { name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150' }
        ],
        count: 1
    };

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders without errors', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search Pokémon...')).toBeInTheDocument();
    });

    it('makes an initial API request when mounting', async () => {
        const fetchSpy = vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalled();
        });
    });

    it('displays a Spinner while data is loading', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(mockPokemonList), 1000))
        );

        render(<App />);

        expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    });

    it('displays a list of Pokemon after a successful download', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('pikachu')).toBeInTheDocument();
            expect(screen.getByText('bulbasaur')).toBeInTheDocument();
            expect(screen.getByText('charmander')).toBeInTheDocument();
        });
    });

    it('shows an error message when the API request fails', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockRejectedValue(
            new Error('Error 404: Pokémon not found')
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Error 404: Pokémon not found')).toBeInTheDocument();
        });
    });

    it('handles unknown errors correctly', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockRejectedValue('Unknown error');

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('something went wrong')).toBeInTheDocument();
        });
    });

    it('loads a saved search query from localStorage on mount', async () => {
        localStorage.setItem('searchTerm', 'charizard');

        const fetchSpy = vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockSinglePokemon);

        render(<App />);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith('charizard');
        });
    });

    it('handles searching for a Pokemon by name', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons')
            .mockResolvedValueOnce(mockPokemonList)
            .mockResolvedValueOnce(mockSinglePokemon);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('pikachu')).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText('Search Pokémon...');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: 'mewtwo' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('mewtwo')).toBeInTheDocument();
            expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
        });
    });

    it('updates the state of searchTerm when searching', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        const input = screen.getByPlaceholderText('Search Pokémon...') as HTMLInputElement;
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: 'pikachu' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(localStorage.getItem('searchTerm')).toBe('pikachu');
        });
    });

    it('shows the title "Results:"', () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        expect(screen.getByText('Results:')).toBeInTheDocument();
    });

    it('have button "Simulate Error" for tests ErrorBoundary', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('pikachu')).toBeInTheDocument();
        });

        const errorButton = screen.getByText('Simulate Error');
        expect(errorButton).toBeInTheDocument();
    });

    it('Doesnt show an error when the download is active.', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(mockPokemonList), 1000))
        );

        render(<App />);

        expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('Doesnt show the list when there is an error', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockRejectedValue(
            new Error('Network error')
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
    });

    it('displays an empty list when there are no results', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue({
            results: [],
            count: 0
        });

        render(<App />);

        await waitFor(() => {
            const cardList = screen.getByText('Results:').parentElement;
            const cards = cardList?.querySelectorAll('.card');
            expect(cards?.length).toBe(0);
        });
    });

    it('calls the API with the correct parameters when searching', async () => {
        const fetchSpy = vi.spyOn(pokemonApi, 'fetchPokemons')
            .mockResolvedValueOnce(mockPokemonList)
            .mockResolvedValueOnce(mockSinglePokemon);

        render(<App />);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith('');
        });

        const input = screen.getByPlaceholderText('Search Pokémon...');
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: 'ditto' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith('ditto');
        });
    });

    it('manages the loading state correctly', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        expect(screen.getByLabelText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading...')).not.toBeInTheDocument();
            expect(screen.getByText('pikachu')).toBeInTheDocument();
        });
    });
});