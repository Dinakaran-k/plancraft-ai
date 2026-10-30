import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BudgetManager from '../components/BudgetManager';

describe('BudgetManager Component', () => {
  const mockEvent = {
    totalBudget: 10000,
    currency: 'USD',
    budgetItems: [
      {
        id: '1',
        title: 'Grand Ballroom Venue',
        category: 'VENUE',
        estimatedCost: 4000,
        actualCost: 3900,
        isPaid: true
      },
      {
        id: '2',
        title: 'Acoustic Guitarist',
        category: 'ENTERTAINMENT',
        estimatedCost: 800,
        actualCost: 0,
        isPaid: false
      }
    ]
  };

  const mockSummary = {
    totalBudget: 10000,
    totalEstimated: 4800,
    totalActual: 3900,
    remainingBudget: 5200,
    percentSpent: 48,
    isOverBudget: false,
    categoryBreakdown: [
      { category: 'VENUE', estimated: 4000, percentageOfBudget: 40 },
      { category: 'ENTERTAINMENT', estimated: 800, percentageOfBudget: 8 }
    ]
  };

  it('renders budget metrics and line items correctly', () => {
    render(
      <BudgetManager
        event={mockEvent}
        summary={mockSummary}
        onAddItem={vi.fn()}
        onUpdateItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    expect(screen.getByText('Grand Ballroom Venue')).toBeInTheDocument();
    expect(screen.getByText('Acoustic Guitarist')).toBeInTheDocument();
    expect(screen.getByText(/Budget Utilization/i)).toBeInTheDocument();
    expect(screen.getByText('$5,200')).toBeInTheDocument();
  });

  it('opens add item form and invokes onAddItem', () => {
    const handleAdd = vi.fn();
    render(
      <BudgetManager
        event={mockEvent}
        summary={mockSummary}
        onAddItem={handleAdd}
        onUpdateItem={vi.fn()}
        onDeleteItem={vi.fn()}
      />
    );

    const addBtn = screen.getByText('Add Item');
    fireEvent.click(addBtn);

    const titleInput = screen.getByPlaceholderText(/Centerpiece Florals/i);
    fireEvent.change(titleInput, { target: { value: 'Floral Arch' } });

    const saveBtn = screen.getByText('Save Item');
    fireEvent.click(saveBtn);

    expect(handleAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Floral Arch'
      })
    );
  });
});
