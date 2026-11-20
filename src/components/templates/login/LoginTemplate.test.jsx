import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import LoginTemplate from './LoginTemplate';
import { renderWithTheme } from '../../../test/renderWithProviders';

function renderLogin(props = {}) {
  const setModel = vi.fn();
  const handleLogin = vi.fn();
  const utils = renderWithTheme(
    <LoginTemplate
      model={{ Dni: '', Contrasena: '' }}
      setModel={setModel}
      handleLogin={handleLogin}
      {...props}
    />,
  );
  return { setModel, handleLogin, ...utils };
}

describe('LoginTemplate', () => {
  it('renderiza DNI, Contraseña y el botón de login', () => {
    const { container } = renderLogin();
    expect(container.querySelector('input[name="Dni"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="Contrasena"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('el DNI solo acepta dígitos (no dispara setModel con letras)', () => {
    const { container, setModel } = renderLogin();
    const dni = container.querySelector('input[name="Dni"]');
    fireEvent.change(dni, { target: { name: 'Dni', value: 'abc' } });
    expect(setModel).not.toHaveBeenCalled();
    fireEvent.change(dni, { target: { name: 'Dni', value: '123' } });
    expect(setModel).toHaveBeenCalledWith({ Dni: '123', Contrasena: '' });
  });

  it('el submit del formulario dispara handleLogin', () => {
    const { container, handleLogin } = renderLogin({ model: { Dni: '123', Contrasena: 'x' } });
    fireEvent.submit(container.querySelector('form'));
    expect(handleLogin).toHaveBeenCalledTimes(1);
  });

  it('loading deshabilita el botón y muestra el spinner en vez del texto', () => {
    const { container } = renderLogin({ loading: true });
    expect(container.querySelector('button[type="submit"]')).toBeDisabled();
    expect(screen.queryByText(/iniciar sesión/i)).not.toBeInTheDocument();
  });

  it('el error de login se muestra inline con role="alert" (convención de login)', () => {
    renderLogin({ error: 'DNI o contraseña incorrectos' });
    expect(screen.getByRole('alert')).toHaveTextContent('DNI o contraseña incorrectos');
  });
});
