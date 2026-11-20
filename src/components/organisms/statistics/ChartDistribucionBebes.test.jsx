import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartDistribucionBebes } from './ChartDistribucionBebes';

describe('ChartDistribucionBebes', () => {
  it('muestra el estado vacío sin datos', () => {
    render(<ChartDistribucionBebes datos={[]} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('muestra el estado vacío con datos no-array', () => {
    render(<ChartDistribucionBebes datos={null} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza el gráfico y el total con datos válidos', () => {
    render(
      <ChartDistribucionBebes
        datos={[{ label: 'Sala A', cantidad: 3 }, { label: 'Sala B', cantidad: 2 }]}
        total={5}
        unidad="bebés"
        notaAlPie="Nota al pie"
      />,
    );
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Nota al pie')).toBeInTheDocument();
  });
});
