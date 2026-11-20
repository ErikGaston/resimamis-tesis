import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  it('muestra el spinner y el texto "Cargando…"', () => {
    render(<Loading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });
});
