import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartWeightEvolution } from './ChartWeightEvolution';

describe('ChartWeightEvolution', () => {
  it('muestra el estado vacío sin bebés comparables', () => {
    render(<ChartWeightEvolution statisticsWeightEvolution={{ bebes: [], bebesConComparacionCompleta: 0 }} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/peso de ingreso a NEO y peso de egreso/i)).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<ChartWeightEvolution />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza KPIs y gráfico con datos válidos', () => {
    const statisticsWeightEvolution = {
      bebesConComparacionCompleta: 1,
      bebes: [
        { pesoIngresoNeo: 1.2, pesoEgreso: 1.5, fechaIngresoNeo: '2026-01-10', fechaSalida: '2026-02-10' },
      ],
    };
    render(<ChartWeightEvolution statisticsWeightEvolution={statisticsWeightEvolution} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByText('Ganancia de peso promedio')).toBeInTheDocument();
    expect(screen.getByText('Ganancia promedio por mes')).toBeInTheDocument();
  });
});
