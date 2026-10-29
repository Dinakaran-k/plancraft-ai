import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EventWizard from '../components/EventWizard';

describe('EventWizard Component', () => {
  it('renders event type preset buttons and default fields', () => {
    render(<EventWizard onGeneratePlan={vi.fn()} isGenerating={false} />);

    expect(screen.getByText('1. Choose Event Type')).toBeInTheDocument();
    expect(screen.getByText('Wedding')).toBeInTheDocument();
    expect(screen.getByText('Birthday Party')).toBeInTheDocument();
    expect(screen.getByText('Community Event')).toBeInTheDocument();
    expect(screen.getByText('Generate AI Event Blueprint')).toBeInTheDocument();
  });

  it('switches preset values when clicking Birthday Party', () => {
    render(<EventWizard onGeneratePlan={vi.fn()} isGenerating={false} />);

    const birthdayButton = screen.getByText('Birthday Party').closest('button');
    fireEvent.click(birthdayButton);

    const guestInput = screen.getByLabelText(/Expected Guests/i);
    expect(guestInput.value).toBe('40');

    const budgetInput = screen.getByLabelText(/Total Budget/i);
    expect(budgetInput.value).toBe('2500');
  });

  it('displays error if submitted with empty event name', () => {
    const handleGenerate = vi.fn();
    render(<EventWizard onGeneratePlan={handleGenerate} isGenerating={false} />);

    const nameInput = screen.getByLabelText(/Event Name/i);
    fireEvent.change(nameInput, { target: { value: '   ' } });

    const submitBtn = screen.getByText('Generate AI Event Blueprint');
    fireEvent.click(submitBtn);

    expect(handleGenerate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onGeneratePlan when valid inputs are submitted', () => {
    const handleGenerate = vi.fn();
    render(<EventWizard onGeneratePlan={handleGenerate} isGenerating={false} />);

    const nameInput = screen.getByLabelText(/Event Name/i);
    fireEvent.change(nameInput, { target: { value: 'Summer Gala' } });

    const submitBtn = screen.getByText('Generate AI Event Blueprint');
    fireEvent.click(submitBtn);

    expect(handleGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Summer Gala',
        eventType: 'WEDDING',
        guestCount: 120
      })
    );
  });
});
