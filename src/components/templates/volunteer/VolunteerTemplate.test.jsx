import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import VolunteerTemplate from './VolunteerTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

function setup(props = {}) {
  const merged = {
    model: { nombre: '', apellido: '', dni: '', mail: '', celular: '', fechaNacimiento: '', horarios: [] },
    setModel: vi.fn(),
    localities: [],
    submitVolunteer: vi.fn(),
    submitDisabled: false,
    error: false,
    setError: vi.fn(),
    fieldErrors: {},
    setFieldErrors: vi.fn(),
    ...props,
  };
  return { ...merged, ...renderWithProviders(<VolunteerTemplate {...merged} />) };
}

describe('VolunteerTemplate', () => {
  it('renderiza el header "Nueva voluntaria"', () => {
    setup();
    expect(screen.getByText('Nueva voluntaria')).toBeInTheDocument();
  });

  it('el botón "Guardar voluntaria" se deshabilita con submitDisabled', () => {
    setup({ submitDisabled: true });
    expect(screen.getByRole('button', { name: /guardar voluntaria/i })).toBeDisabled();
  });

  it('con submitDisabled=false el click dispara submitVolunteer', () => {
    const { submitVolunteer } = setup({ submitDisabled: false });
    fireEvent.click(screen.getByRole('button', { name: /guardar voluntaria/i }));
    expect(submitVolunteer).toHaveBeenCalled();
  });
});
