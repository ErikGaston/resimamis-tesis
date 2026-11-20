import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartAssignmentMonth } from './ChartAssignmentMonth';

describe('ChartAssignmentMonth', () => {
  it('muestra el estado vacío sin datos', () => {
    render(<ChartAssignmentMonth statisticsAssignment={[]} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<ChartAssignmentMonth />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('ignora registros con mes inválido y cae al estado vacío', () => {
    render(<ChartAssignmentMonth statisticsAssignment={[{ mes: 99, cantidadAsignaciones: 3 }]} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza el gráfico con datos válidos', () => {
    render(<ChartAssignmentMonth statisticsAssignment={[{ mes: 1, anio: 2026, cantidadAsignaciones: 5 }]} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.queryByText('Sin datos disponibles')).not.toBeInTheDocument();
  });
});
