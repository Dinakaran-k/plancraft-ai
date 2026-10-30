import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

function ProblemChild({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Simulated runtime component explosion');
  }
  return <div>Component rendered cleanly</div>;
}

describe('ErrorBoundary Component', () => {
  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Component rendered cleanly')).toBeInTheDocument();
  });

  it('catches render errors and displays fallback recovery UI', () => {
    // Suppress console.error during deliberate throw test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something unexpected occurred/i)).toBeInTheDocument();
    expect(screen.getByText(/Reload Application/i)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
