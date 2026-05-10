import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardList from './CardList';
import type { Pokemon } from '../types';

describe('CardList Component', () => {
  const mockPokemons: Pokemon[] = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }
  ];

  it('displays all transferred elements', () => {
    render(<CardList items={mockPokemons} />);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();
  });

  it('displays the correct number of cards', () => {
    const { container } = render(<CardList items={mockPokemons} />);
    
    const cards = container.querySelectorAll('.card');
    expect(cards).toHaveLength(3);
  });

  it('does not display cards when the array is empty', () => {
    const { container } = render(<CardList items={[]} />);
    
    const cards = container.querySelectorAll('.card');
    expect(cards).toHaveLength(0);
  });

  it('displays one card correctly', () => {
    const singlePokemon: Pokemon[] = [
      { name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150/' }
    ];
    
    render(<CardList items={singlePokemon} />);
    
    expect(screen.getByText('mewtwo')).toBeInTheDocument();
    expect(screen.getByText('Pokémon #150')).toBeInTheDocument();
  });

  it('has a correct structure with the class card-list', () => {
    const { container } = render(<CardList items={mockPokemons} />);
    
    const cardList = container.querySelector('.card-list');
    expect(cardList).toBeInTheDocument();
  });
});