import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimelineManager from '../components/TimelineManager';

describe('TimelineManager Component', () => {
  const mockEvent = {
    timelineItems: [
      { id: '1', title: 'Sign Catering Contract', phase: 'EARLY_PLANNING', time: '3 Months Out', isCompleted: true },
      { id: '2', title: 'Vendor Arrival & Sound Check', phase: 'DAY_OF', time: '11:00 AM', isCompleted: false }
    ]
  };

  it('renders milestones with phase tags and completion status', () => {
    render(
      <TimelineManager
        event={mockEvent}
        summary={{}}
        onToggleComplete={vi.fn()}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    expect(screen.getByText('Sign Catering Contract')).toBeInTheDocument();
    expect(screen.getByText('Vendor Arrival & Sound Check')).toBeInTheDocument();
    expect(screen.getByText('EARLY PLANNING')).toBeInTheDocument();
    expect(screen.getByText('DAY OF')).toBeInTheDocument();
  });

  it('triggers onToggleComplete when milestone check is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <TimelineManager
        event={mockEvent}
        summary={{}}
        onToggleComplete={handleToggle}
        onAddItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const checkBtn = screen.getByLabelText(/Mark milestone as pending/i);
    fireEvent.click(checkBtn);

    expect(handleToggle).toHaveBeenCalledWith('1');
  });
});
