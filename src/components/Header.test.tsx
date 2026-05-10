import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('displays the title "Pokémon Search"', () => {
    render(<Header />);
    
    expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
  });

  it('displays the title as h1', () => {
    render(<Header />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Pokémon Search');
  });

  it('has a correct structure with a header element', () => {
    const { container } = render(<Header />);
    
    const header = container.querySelector('header.app-header');
    expect(header).toBeInTheDocument();
  });

  it('renders without errors', () => {
    const { container } = render(<Header />);
    
    expect(container.firstChild).toBeInTheDocument();
  });
});