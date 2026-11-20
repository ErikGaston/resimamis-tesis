import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrimerAbrazo } from './PrimerAbrazo';

describe('PrimerAbrazo', () => {
  it('sin datos no renderiza nada', () => {
    const { container } = render(<PrimerAbrazo datos={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('con lista vacía muestra el estado vacío', () => {
    render(<PrimerAbrazo datos={{ bebes: [] }} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/no hay bebés con fecha de ingreso/i)).toBeInTheDocument();
  });

  it('renderiza bebés esperando y con primer abrazo', () => {
    const datos = {
      promedioDias: 3,
      medianaDias: 2,
      activosSinPrimerAbrazo: 1,
      bebes: [
        { idBebe: 1, nombre: 'Ana', sinPrimerAbrazo: true, activo: true, dias: 5, fechaIngresoNeo: '2026-11-01' },
        { idBebe: 2, nombre: 'Luz', sinPrimerAbrazo: false, dias: 2, fechaPrimerAbrazo: '2026-11-03' },
      ],
    };
    render(<PrimerAbrazo datos={datos} />);
    expect(screen.getByText('Esperando su primer abrazo')).toBeInTheDocument();
    expect(screen.getByText('Ya recibieron su primer abrazo')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Luz')).toBeInTheDocument();
  });
});
