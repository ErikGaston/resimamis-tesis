import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import StatisticsTemplate from './StatisticsTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

function setup(props = {}) {
  const merged = {
    stateChart: '',
    setStateChart: vi.fn(),
    generateChart: vi.fn(),
    valueChart: 1,
    isCoordinadora: false,
    onConsultarVisitas: vi.fn(),
    estadisticaAvanzada: null,
    ...props,
  };
  return { ...merged, ...renderWithProviders(<StatisticsTemplate {...merged} />) };
}

describe('StatisticsTemplate', () => {
  it('renderiza el header "Estadísticas"', () => {
    setup();
    expect(screen.getByText('Estadísticas')).toBeInTheDocument();
  });

  it('sin coordinadora oculta las opciones soloCoordinadora', () => {
    setup({ isCoordinadora: false });
    expect(screen.getByRole('button', { name: /edades de las madres/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ranking de voluntarias/i })).not.toBeInTheDocument();
  });

  it('con coordinadora muestra las opciones avanzadas', () => {
    setup({ isCoordinadora: true });
    expect(screen.getByRole('button', { name: /ranking de voluntarias/i })).toBeInTheDocument();
  });

  it('click en una opción dispara generateChart con su id', () => {
    const { generateChart } = setup();
    fireEvent.click(screen.getByRole('button', { name: /edades de las madres/i }));
    expect(generateChart).toHaveBeenCalledWith(1);
  });

  it('con stateChart distinto de OPEN el dialog está cerrado', () => {
    setup({ stateChart: '' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
