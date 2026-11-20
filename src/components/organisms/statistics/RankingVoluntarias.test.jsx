import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RankingVoluntarias } from './RankingVoluntarias';

describe('RankingVoluntarias', () => {
  it('muestra el estado vacío sin ranking', () => {
    render(<RankingVoluntarias ranking={{ ranking: [] }} />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
    expect(screen.getByText(/no hay abrazos finalizados en el período/i)).toBeInTheDocument();
  });

  it('muestra el estado vacío con prop ausente', () => {
    render(<RankingVoluntarias />);
    expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
  });

  it('renderiza los ítems del ranking desde props', () => {
    const ranking = {
      ranking: [
        { idVoluntaria: 1, posicion: 1, nombreVoluntaria: 'Ana Pérez', cantidadAbrazosFinalizados: 8 },
        { idVoluntaria: 2, posicion: 2, nombreVoluntaria: 'Luz Díaz', cantidadAbrazosFinalizados: 5 },
      ],
    };
    render(<RankingVoluntarias ranking={ranking} />);
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Luz Díaz')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('usa "Sin nombre" cuando falta el nombre de la voluntaria', () => {
    const ranking = { ranking: [{ idVoluntaria: 3, posicion: 1, cantidadAbrazosFinalizados: 2 }] };
    render(<RankingVoluntarias ranking={ranking} />);
    expect(screen.getByText('Sin nombre')).toBeInTheDocument();
  });
});
