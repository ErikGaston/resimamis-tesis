import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EquidadBebes } from './EquidadBebes';

describe('EquidadBebes', () => {
  it('sin datos no renderiza nada', () => {
    const { container } = render(<EquidadBebes datos={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('con lista vacía muestra el estado vacío', () => {
    render(<EquidadBebes datos={{ bebes: [] }} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/no hay bebés activos/i)).toBeInTheDocument();
  });

  it('renderiza los bebés con sus métricas', () => {
    const datos = {
      promedioAbrazosPorSemana: 3,
      bebesPorDebajo: 1,
      bebes: [
        { idBebe: 1, nombre: 'Ana', sala: 'Sala A', abrazos: 6, diasInternado: 14, abrazosPorSemana: 3, porDebajoDelPromedio: false },
        { idBebe: 2, nombre: 'Luz', sala: 'Sala B', abrazos: 1, diasInternado: 14, abrazosPorSemana: 0.5, porDebajoDelPromedio: true },
      ],
    };
    render(<EquidadBebes datos={datos} />);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Luz')).toBeInTheDocument();
    expect(screen.getByText('Por debajo')).toBeInTheDocument();
  });
});
