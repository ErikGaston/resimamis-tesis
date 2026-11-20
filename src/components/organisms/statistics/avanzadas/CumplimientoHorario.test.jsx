import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CumplimientoHorario } from './CumplimientoHorario';

describe('CumplimientoHorario', () => {
  it('sin datos sólo muestra el selector de período', () => {
    render(<CumplimientoHorario datos={null} onConsultar={vi.fn()} />);
    expect(screen.getByText('Período')).toBeInTheDocument();
    expect(screen.queryByText('Sin datos disponibles')).not.toBeInTheDocument();
  });

  it('con lista vacía muestra el estado vacío', () => {
    render(<CumplimientoHorario datos={{ voluntarias: [], promedioCumplimiento: 0 }} onConsultar={vi.fn()} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/ninguna voluntaria activa tiene horario/i)).toBeInTheDocument();
  });

  it('renderiza las voluntarias con su porcentaje', () => {
    const datos = {
      promedioCumplimiento: 80,
      voluntarias: [
        { idVoluntaria: 1, nombre: 'Ana', diasDelHorario: 'Lun, Mié', diasQueVino: 4, diasPrevistos: 5, porcentajeCumplimiento: 80, diasExtra: 0 },
      ],
    };
    render(<CumplimientoHorario datos={datos} onConsultar={vi.fn()} />);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Cumplimiento promedio')).toBeInTheDocument();
    expect(screen.getByText(/vino 4 de 5/i)).toBeInTheDocument();
  });

  it('dispara onConsultar al cambiar el período', () => {
    const onConsultar = vi.fn();
    render(<CumplimientoHorario datos={null} onConsultar={onConsultar} />);
    fireEvent.click(screen.getByText('60 días'));
    expect(onConsultar).toHaveBeenCalledWith(expect.objectContaining({ fechaDesde: expect.any(String), fechaHasta: expect.any(String) }));
  });
});
