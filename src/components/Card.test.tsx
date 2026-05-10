import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';
import type { Pokemon } from '../types';

describe('Card Component', () => {
  const mockPokemon: Pokemon = {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25/'
  };

  it('show name pokemon', () => {
    render(<Card item={mockPokemon} />);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('show ID pokemon to URL', () => {
    render(<Card item={mockPokemon} />);
    
    expect(screen.getByText('Pokémon #25')).toBeInTheDocument();
  });

  it('correctly extracts ID from URL without trailing slash', () => {
    const pokemon: Pokemon = {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1'
    };
    
    render(<Card item={pokemon} />);
    
    expect(screen.getByText('Pokémon #1')).toBeInTheDocument();
  });

  it('displays the correct structure with classes', () => {
    const { container } = render(<Card item={mockPokemon} />);
    
    const card = container.querySelector('.card');
    const name = container.querySelector('.card-name');
    const desc = container.querySelector('.card-desc');
    
    expect(card).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(desc).toBeInTheDocument();
  });

  it('handles different IDs correctly', () => {
    const pokemon: Pokemon = {
      name: 'mewtwo',
      url: 'https://pokeapi.co/api/v2/pokemon/150/'
    };
    
    render(<Card item={pokemon} />);
    
    expect(screen.getByText('Pokémon #150')).toBeInTheDocument();
  });
});