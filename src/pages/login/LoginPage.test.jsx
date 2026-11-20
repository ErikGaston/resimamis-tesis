import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { LoginPage } from './LoginPage';

beforeEach(() => localStorage.clear());

describe('LoginPage (smoke)', () => {
  it('renderiza el formulario de login sin sesión', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: { userReducer: { loading: false, error: null, postLogin: null } },
    });
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });
});
