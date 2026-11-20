import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartLocalitiesMother } from './ChartLocalitiesMother';

describe('ChartLocalitiesMother', () => {
  it('muestra el estado vacío sin datos', () => {
    render(<ChartLocalitiesMother statisticsLocalities={[]} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<ChartLocalitiesMother />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza el gráfico de torta con datos válidos', () => {
    render(
      <ChartLocalitiesMother
        statisticsLocalities={[
          { nombreLocalidad: 'Córdoba', cantidadMadres: 4 },
          { nombreLocalidad: 'Villa María', cantidadMadres: 2 },
        ]}
      />,
    );
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
