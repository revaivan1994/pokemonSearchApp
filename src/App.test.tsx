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

    it('рендерится без ошибок', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search Pokémon...')).toBeInTheDocument();
    });

    it('делает начальный API запрос при монтировании', async () => {
        const fetchSpy = vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalled();
        });
    });

    it('отображает Spinner во время загрузки данных', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(mockPokemonList), 1000))
        );

        render(<App />);

        expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    });

    it('отображает список покемонов после успешной загрузки', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('pikachu')).toBeInTheDocument();
            expect(screen.getByText('bulbasaur')).toBeInTheDocument();
            expect(screen.getByText('charmander')).toBeInTheDocument();
        });
    });

    it('показывает сообщение об ошибке при неудачном API запросе', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockRejectedValue(
            new Error('Error 404: Pokémon not found')
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Error 404: Pokémon not found')).toBeInTheDocument();
        });
    });

    it('обрабатывает неизвестные ошибки корректно', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockRejectedValue('Unknown error');

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('something went wrong')).toBeInTheDocument();
        });
    });

    it('загружает сохраненный поисковый запрос из localStorage при монтировании', async () => {
        localStorage.setItem('searchTerm', 'charizard');

        const fetchSpy = vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockSinglePokemon);

        render(<App />);

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith('charizard');
        });
    });

    it('обрабатывает поиск покемона по имени', async () => {
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

    it('обновляет состояние searchTerm при поиске', async () => {
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

    it('показывает заголовок "Results:"', () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        expect(screen.getByText('Results:')).toBeInTheDocument();
    });

    it('имеет кнопку "Simulate Error" для тестирования ErrorBoundary', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('pikachu')).toBeInTheDocument();
        });

        const errorButton = screen.getByText('Simulate Error');
        expect(errorButton).toBeInTheDocument();
    });

    it('не показывает ошибку когда загрузка активна', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(mockPokemonList), 1000))
        );

        render(<App />);

        expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('не показывает список когда есть ошибка', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockRejectedValue(
            new Error('Network error')
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
    });

    it('отображает пустой список когда нет результатов', async () => {
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

    it('вызывает API с правильными параметрами при поиске', async () => {
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

    it('управляет состоянием загрузки корректно', async () => {
        vi.spyOn(pokemonApi, 'fetchPokemons').mockResolvedValue(mockPokemonList);

        render(<App />);

        expect(screen.getByLabelText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading...')).not.toBeInTheDocument();
            expect(screen.getByText('pikachu')).toBeInTheDocument();
        });
    });
});