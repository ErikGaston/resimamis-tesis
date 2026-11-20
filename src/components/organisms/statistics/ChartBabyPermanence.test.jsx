import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartBabyPermanence } from './ChartBabyPermanence';

describe('ChartBabyPermanence', () => {
  it('muestra el estado vacío sin bebés', () => {
    render(<ChartBabyPermanence statisticsPermanencia={{ bebes: [] }} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/bebés activos con fecha de ingreso/i)).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<ChartBabyPermanence />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza el histograma con datos válidos', () => {
    const statisticsPermanencia = {
      bebes: [
        { idBebe: 1, nombre: 'Ana', apellido: 'Pérez', diasPermanencia: 5, fechaIngresoNeo: '2026-11-01' },
        { idBebe: 2, nombre: 'Luz', apellido: 'Díaz', diasPermanencia: 20, fechaIngresoNeo: '2026-10-15' },
      ],
    };
    render(<ChartBabyPermanence statisticsPermanencia={statisticsPermanencia} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByText('Distribución de permanencia')).toBeInTheDocument();
  });
});
