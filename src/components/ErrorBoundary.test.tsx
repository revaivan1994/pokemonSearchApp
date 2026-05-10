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
  // Подавляем console.error для чистоты вывода тестов
  const originalError = console.error;
  
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('отображает дочерние элементы при отсутствии ошибки', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('отображает fallback UI при ошибке', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('показывает кнопку "Try again"', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  it('кнопка "Try again" обрабатывает клики', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    const button = screen.getByRole('button', { name: /try again/i });
    
    expect(button).toBeInTheDocument();
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('логирует ошибку в консоль', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    expect(console.error).toHaveBeenCalled();
  });

  it('имеет корректную структуру с классом error-boundary', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    
    const errorBoundary = container.querySelector('.error-boundary');
    expect(errorBoundary).toBeInTheDocument();
  });
});