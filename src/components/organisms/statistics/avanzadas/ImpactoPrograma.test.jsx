import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImpactoPrograma } from './ImpactoPrograma';

describe('ImpactoPrograma', () => {
  it('sin datos sólo muestra el selector', () => {
    render(<ImpactoPrograma datos={null} onConsultar={vi.fn()} />);
    expect(screen.getByText('Bebés egresados en')).toBeInTheDocument();
    expect(screen.queryByText('Sin datos disponibles')).not.toBeInTheDocument();
  });

  it('con cero egresados muestra el estado vacío', () => {
    render(<ImpactoPrograma datos={{ bebesEgresados: 0, tramos: [] }} onConsultar={vi.fn()} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/todavía no hay bebés egresados/i)).toBeInTheDocument();
  });

  it('renderiza los tramos con datos válidos', () => {
    const datos = {
      bebesEgresados: 5,
      tramos: [
        { tramo: '0-7 días', cantidadBebes: 3, promedioAbrazos: 4, promedioGananciaGramosPorDia: 20, promedioDiasInternacion: 5 },
      ],
    };
    render(<ImpactoPrograma datos={datos} onConsultar={vi.fn()} />);
    expect(screen.getByText('Ganancia de peso por día')).toBeInTheDocument();
    expect(screen.getByText('Días de internación')).toBeInTheDocument();
    expect(screen.getByText('Bebés egresados analizados')).toBeInTheDocument();
  });

  it('dispara onConsultar al cambiar el período', () => {
    const onConsultar = vi.fn();
    render(<ImpactoPrograma datos={null} onConsultar={onConsultar} />);
    fireEvent.click(screen.getByText('90 días'));
    expect(onConsultar).toHaveBeenCalledWith(expect.objectContaining({ fechaDesde: expect.any(String), fechaHasta: expect.any(String) }));
  });
});
