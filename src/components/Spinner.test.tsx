import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  it('displays a loading indicatorй', () => {
    const { container } = render(<Spinner />);
    
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('have aria-label for accessibility', () => {
    render(<Spinner />);
    
    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toBeInTheDocument();
  });

  it('render without mistakes', () => {
    const { container } = render(<Spinner />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('have correct spinner', () => {
    const { container } = render(<Spinner />);
    
    const spinner = container.querySelector('.spinner');
    expect(spinner).toHaveClass('spinner');
  });
});