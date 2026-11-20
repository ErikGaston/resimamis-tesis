import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CarrucelPrincipal from './CarrucelPrincipal';

describe('CarrucelPrincipal', () => {
  it('renderiza su contenido placeholder', () => {
    render(<CarrucelPrincipal />);
    expect(screen.getByRole('heading', { name: 'carousel secundario' })).toBeInTheDocument();
  });
});
