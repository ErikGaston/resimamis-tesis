import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import VolunteerHorarioSection from './VolunteerHorarioSection';

const stateConDias = {
  horarioReducer: {
    getHorarioDias: [
      { idDia: 1, nombre: 'Lunes' },
      { idDia: 2, nombre: 'Martes' },
    ],
    postHorario: null,
  },
};

describe('VolunteerHorarioSection', () => {
  it('sin días cargados muestra el estado de carga', () => {
    renderWithProviders(<VolunteerHorarioSection idVoluntaria={1} horarios={[]} />, {
      preloadedState: { horarioReducer: { getHorarioDias: null, postHorario: null } },
    });
    expect(screen.getByText(/Cargando días disponibles/)).toBeInTheDocument();
  });

  it('renderiza los días disponibles con su checkbox', () => {
    renderWithProviders(<VolunteerHorarioSection idVoluntaria={1} horarios={[]} />, {
      preloadedState: stateConDias,
    });
    expect(screen.getByText('Lunes')).toBeInTheDocument();
    expect(screen.getByText('Martes')).toBeInTheDocument();
  });

  it('el botón arranca deshabilitado y se habilita al marcar un día', () => {
    renderWithProviders(<VolunteerHorarioSection idVoluntaria={1} horarios={[]} />, {
      preloadedState: stateConDias,
    });
    const btn = screen.getByRole('button', { name: /seleccioná al menos un día/i });
    expect(btn).toBeDisabled();
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getByRole('button', { name: /guardar disponibilidad/i })).toBeEnabled();
  });
});
