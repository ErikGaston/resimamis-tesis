import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart" />,
  Line: () => <div data-testid="chart" />,
  Pie: () => <div data-testid="chart" />,
  Doughnut: () => <div data-testid="chart" />,
}));

import { ChartVisitasBebes } from './ChartVisitasBebes';

describe('ChartVisitasBebes', () => {
  it('renderiza el formulario y el botón sin estadísticas', () => {
    render(<ChartVisitasBebes bebes={[]} estadisticas={null} onConsultar={vi.fn()} />);
    expect(screen.getByRole('button', { name: /generar estadística/i })).toBeInTheDocument();
    expect(screen.queryByTestId('chart')).not.toBeInTheDocument();
  });

  it('muestra mensaje vacío cuando no hay visitas para los filtros', () => {
    render(<ChartVisitasBebes bebes={[]} estadisticas={{ porBebe: [], totalVisitas: 0 }} onConsultar={vi.fn()} />);
    expect(screen.getByText(/no hay visitas para los filtros/i)).toBeInTheDocument();
  });

  it('renderiza el gráfico y el total con estadísticas', () => {
    const estadisticas = { porBebe: [{ nombreBebe: 'Ana', cantidad: 3 }], totalVisitas: 3 };
    render(<ChartVisitasBebes bebes={[]} estadisticas={estadisticas} onConsultar={vi.fn()} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByText(/total del período: 3 visitas/i)).toBeInTheDocument();
  });

  it('dispara onConsultar al generar la estadística', () => {
    const onConsultar = vi.fn();
    render(<ChartVisitasBebes bebes={[]} estadisticas={null} onConsultar={onConsultar} />);
    fireEvent.click(screen.getByRole('button', { name: /generar estadística/i }));
    expect(onConsultar).toHaveBeenCalledTimes(1);
    expect(onConsultar).toHaveBeenCalledWith(expect.objectContaining({ fechaDesde: expect.any(String), fechaHasta: expect.any(String) }));
  });
});
