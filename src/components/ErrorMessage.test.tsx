import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('displays the passed error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('have role="alert"', () => {
    render(<ErrorMessage message="Error occurred" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Error occurred');
  });

  it('displays various messages correctly', () => {
    const { rerender } = render(<ErrorMessage message="First error" />);
    
    expect(screen.getByText('First error')).toBeInTheDocument();
    
    rerender(<ErrorMessage message="Second error" />);
    
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();
  });

  it('имеет корректный класс error-message', () => {
    const { container } = render(<ErrorMessage message="Test" />);
    
    const errorDiv = container.querySelector('.error-message');
    expect(errorDiv).toBeInTheDocument();
  });

  it('processes an empty message', () => {
    render(<ErrorMessage message="" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('');
  });

  it('processes long messages', () => {
    const longMessage = 'This is a very long error message that contains multiple words and should be displayed correctly in the component';
    
    render(<ErrorMessage message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});