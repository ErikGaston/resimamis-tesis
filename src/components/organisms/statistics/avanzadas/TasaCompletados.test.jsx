import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TasaCompletados } from './TasaCompletados';

describe('TasaCompletados', () => {
  it('sin datos sólo muestra el selector', () => {
    render(<TasaCompletados datos={null} onConsultar={vi.fn()} />);
    expect(screen.getByText('Período')).toBeInTheDocument();
    expect(screen.queryByText('Sin datos disponibles')).not.toBeInTheDocument();
  });

  it('con total cero muestra el estado vacío', () => {
    render(<TasaCompletados datos={{ total: 0 }} onConsultar={vi.fn()} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/no hubo asignaciones de abrazo/i)).toBeInTheDocument();
  });

  it('renderiza las tarjetas y el desglose por voluntaria', () => {
    const datos = {
      total: 10,
      completados: 8,
      porcentajeCompletados: 80,
      cerradosAutomaticamente: 1,
      nuncaIniciados: 1,
      enCurso: 0,
      porVoluntaria: [
        { idVoluntaria: 1, grupo: 'Ana', completados: 4, total: 5, porcentajeCompletados: 80, nuncaIniciados: 0 },
      ],
      porDiaSemana: [{ grupo: 'Lunes', completados: 2, total: 3, porcentajeCompletados: 67 }],
    };
    render(<TasaCompletados datos={datos} onConsultar={vi.fn()} />);
    expect(screen.getByText('Abrazos completados')).toBeInTheDocument();
    expect(screen.getByText('Por voluntaria')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Por día de la semana')).toBeInTheDocument();
    expect(screen.getByText('Lunes')).toBeInTheDocument();
  });

  it('dispara onConsultar al cambiar el período', () => {
    const onConsultar = vi.fn();
    render(<TasaCompletados datos={null} onConsultar={onConsultar} />);
    fireEvent.click(screen.getByText('30 días'));
    expect(onConsultar).toHaveBeenCalledWith(expect.objectContaining({ fechaDesde: expect.any(String), fechaHasta: expect.any(String) }));
  });
});
