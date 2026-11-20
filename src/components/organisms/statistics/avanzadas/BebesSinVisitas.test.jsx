import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BebesSinVisitas } from './BebesSinVisitas';

describe('BebesSinVisitas', () => {
  it('sin datos sólo muestra el selector de umbral', () => {
    render(<BebesSinVisitas datos={null} onConsultar={vi.fn()} />);
    expect(screen.getByText('Sin visita familiar hace al menos')).toBeInTheDocument();
    expect(screen.queryByText(/todos los bebés activos/i)).not.toBeInTheDocument();
  });

  it('con lista vacía muestra el estado "todos tuvieron visitas"', () => {
    render(<BebesSinVisitas datos={{ bebes: [], bebesSuperanUmbral: 0 }} onConsultar={vi.fn()} />);
    expect(screen.getByText('Todos los bebés activos tuvieron visitas')).toBeInTheDocument();
  });

  it('renderiza los bebés sin visitas', () => {
    const datos = {
      bebesSuperanUmbral: 1,
      bebes: [
        { idBebe: 1, nombre: 'Ana', sala: 'Sala A', diasSinVisita: 10, nuncaVisitado: false, ultimaVisita: '2026-11-01' },
      ],
    };
    render(<BebesSinVisitas datos={datos} onConsultar={vi.fn()} />);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('10 días')).toBeInTheDocument();
  });

  it('dispara onConsultar al cambiar el umbral', () => {
    const onConsultar = vi.fn();
    render(<BebesSinVisitas datos={null} onConsultar={onConsultar} />);
    fireEvent.click(screen.getByText('15 días'));
    expect(onConsultar).toHaveBeenCalledWith({ dias: 15 });
  });
});
