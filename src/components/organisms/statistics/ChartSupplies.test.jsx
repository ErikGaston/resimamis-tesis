import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartSupplies } from './ChartSupplies';

describe('ChartSupplies', () => {
  it('muestra el estado vacío sin datos', () => {
    render(<ChartSupplies statisticsSupplies={[]} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<ChartSupplies />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza el gráfico con pocos insumos (eje x)', () => {
    render(<ChartSupplies statisticsSupplies={[{ nombreInsumo: 'Pañal', cantidad: 10 }]} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('renderiza el gráfico con muchos insumos (eje y)', () => {
    const insumos = ['A', 'B', 'C', 'D', 'E'].map((n, i) => ({ nombreInsumo: n, cantidad: i + 1 }));
    render(<ChartSupplies statisticsSupplies={insumos} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
