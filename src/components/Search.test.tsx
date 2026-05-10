import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Search from './Search';

describe('Search Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays an input field and a search button', () => {
    render(<Search onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: /search/i });
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('loads a saved search query from localStorage', () => {
    localStorage.setItem('searchTerm', 'pikachu');
    
    render(<Search onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...') as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('displays an empty field if there is no stored value', () => {
    render(<Search onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('updates the value when the user enters it', () => {
    render(<Search onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'bulbasaur' } });
    
    expect(input.value).toBe('bulbasaur');
  });

  it('calls onSearch with the correct value when clicked', () => {
    const mockOnSearch = vi.fn();
    render(<Search onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'charmander' } });
    fireEvent.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('charmander');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('saves the search query to localStorage when searching', () => {
    render(<Search onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'squirtle' } });
    fireEvent.click(button);
    
    expect(localStorage.getItem('searchTerm')).toBe('squirtle');
  });

  it('trims spaces before saving', () => {
    const mockOnSearch = vi.fn();
    render(<Search onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: '  mewtwo  ' } });
    fireEvent.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('mewtwo');
    expect(localStorage.getItem('searchTerm')).toBe('mewtwo');
  });

  it('overwrites the existing value in localStorage', () => {
    localStorage.setItem('searchTerm', 'old-value');
    
    render(<Search onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...');
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'new-value' } });
    fireEvent.click(button);
    
    expect(localStorage.getItem('searchTerm')).toBe('new-value');
  });

  it('correct class CSS', () => {
    const { container } = render(<Search onSearch={vi.fn()} />);
    
    const section = container.querySelector('.search-section');
    const input = container.querySelector('.search-input');
    const button = container.querySelector('.search-button');
    
    expect(section).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('handles multiple inputs correctly', () => {
    render(<Search onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Search Pokémon...') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'p' } });
    expect(input.value).toBe('p');
    
    fireEvent.change(input, { target: { value: 'pi' } });
    expect(input.value).toBe('pi');
    
    fireEvent.change(input, { target: { value: 'pik' } });
    expect(input.value).toBe('pik');
    
    fireEvent.change(input, { target: { value: 'pika' } });
    expect(input.value).toBe('pika');
  });
});