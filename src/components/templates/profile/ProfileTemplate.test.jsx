import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ProfileTemplate } from './ProfileTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

function setup(props = {}) {
  const merged = {
    model: { nombre: 'Ana', apellido: 'Pérez', dni: '', mail: '', celular: '' },
    setModel: vi.fn(),
    error: false,
    submit: vi.fn(),
    editForm: false,
    setEditForm: vi.fn(),
    type: 'VOLUNTEER',
    fieldErrors: {},
    setFieldErrors: vi.fn(),
    disableAccordion: true,
    submitDisabled: false,
    ...props,
  };
  return { ...merged, ...renderWithProviders(<ProfileTemplate {...merged} />) };
}

describe('ProfileTemplate (VOLUNTEER)', () => {
  it('muestra el nombre del modelo en el header', () => {
    setup();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
  });

  it('cae a "Perfil" si no hay nombre', () => {
    setup({ model: {} });
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('sin edición muestra "Editar voluntaria" y al click habilita la edición', () => {
    const { setEditForm } = setup({ editForm: false });
    const btn = screen.getByRole('button', { name: /editar voluntaria/i });
    fireEvent.click(btn);
    expect(setEditForm).toHaveBeenCalledWith(true);
  });

  it('en edición muestra Guardar (deshabilitable) y Cancelar (vuelve a no-edición)', () => {
    const { setEditForm } = setup({ editForm: true, submitDisabled: true });
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(setEditForm).toHaveBeenCalledWith(false);
  });
});
