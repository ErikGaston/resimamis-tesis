import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartHugMonth } from './ChartHugMonth';

describe('ChartHugMonth', () => {
  it('muestra el estado vacío sin datos', () => {
    render(<ChartHugMonth statisticsMonthMother={[]} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<ChartHugMonth />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza el gráfico con datos válidos', () => {
    render(<ChartHugMonth statisticsMonthMother={[{ edad: '20-25', cantidadMadres: 4 }]} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.queryByText('Sin datos disponibles')).not.toBeInTheDocument();
  });
});
