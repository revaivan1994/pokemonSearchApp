import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// Компонент, который выбрасывает ошибку
const ThrowError = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal content</div>;
};

describe('ErrorBoundary Component', () => {
  const originalError = console.error;
  
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('displays child elements if there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays a fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('displays an error message', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('show button "Try again"', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  it('the "Try again" button processes clicks', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    const button = screen.getByRole('button', { name: /try again/i });
    
    expect(button).toBeInTheDocument();
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('logs an error to the console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    expect(console.error).toHaveBeenCalled();
  });

  it('has a correct structure with the error-boundary class', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    const errorBoundary = container.querySelector('.error-boundary');
    expect(errorBoundary).toBeInTheDocument();
  });
});