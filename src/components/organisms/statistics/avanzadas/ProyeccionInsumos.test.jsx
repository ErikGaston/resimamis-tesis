import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProyeccionInsumos } from './ProyeccionInsumos';

describe('ProyeccionInsumos', () => {
  it('sin datos sólo muestra el selector', () => {
    render(<ProyeccionInsumos datos={null} onConsultar={vi.fn()} />);
    expect(screen.getByText('Consumo promedio de los últimos')).toBeInTheDocument();
    expect(screen.queryByText('Sin datos disponibles')).not.toBeInTheDocument();
  });

  it('con lista vacía muestra el estado vacío', () => {
    render(<ProyeccionInsumos datos={{ insumos: [] }} onConsultar={vi.fn()} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/no hay insumos activos/i)).toBeInTheDocument();
  });

  it('renderiza los insumos con su estado y proyección', () => {
    const datos = {
      insumos: [
        {
          idInsumo: 1,
          nombre: 'Pañal',
          estado: 'Bajo mínimo',
          stockActual: 5,
          stockMinimo: 10,
          consumoDiarioPromedio: 2,
          diasHastaMinimo: 0,
          diasHastaAgotarse: 3,
        },
      ],
    };
    render(<ProyeccionInsumos datos={datos} onConsultar={vi.fn()} />);
    expect(screen.getByText('Pañal')).toBeInTheDocument();
    expect(screen.getByText('Bajo mínimo')).toBeInTheDocument();
    expect(screen.getByText(/se agota en 3 días/i)).toBeInTheDocument();
  });

  it('dispara onConsultar al cambiar el período', () => {
    const onConsultar = vi.fn();
    render(<ProyeccionInsumos datos={null} onConsultar={onConsultar} />);
    fireEvent.click(screen.getByText('15 días'));
    expect(onConsultar).toHaveBeenCalledWith({ dias: 15 });
  });
});
