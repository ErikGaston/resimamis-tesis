import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartDuracionAbrazos } from './ChartDuracionAbrazos';

describe('ChartDuracionAbrazos', () => {
  it('muestra el estado vacío sin abrazos finalizados', () => {
    render(<ChartDuracionAbrazos duracion={{ general: { cantidadAbrazosFinalizados: 0 }, porMes: [] }} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/no hay abrazos finalizados/i)).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<ChartDuracionAbrazos />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza KPIs y gráfico con datos válidos', () => {
    const duracion = {
      general: { cantidadAbrazosFinalizados: 5, promedioMinutos: 45, minimoMinutos: 10, maximoMinutos: 90 },
      porMes: [{ label: 'Ene', promedio: 45, cantidad: 5 }],
    };
    render(<ChartDuracionAbrazos duracion={duracion} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByText('Promedio por mes')).toBeInTheDocument();
    expect(screen.getByText(/abrazos finalizados/i)).toBeInTheDocument();
  });

  it('advierte cuando hay abrazos colgados de más de 24 h', () => {
    const duracion = {
      general: { cantidadAbrazosFinalizados: 3, promedioMinutos: 60, minimoMinutos: 10, maximoMinutos: 2000 },
      porMes: [{ label: 'Feb', promedio: 60, cantidad: 3 }],
    };
    render(<ChartDuracionAbrazos duracion={duracion} />);
    expect(screen.getByText(/más de 24 h/i)).toBeInTheDocument();
  });
});
