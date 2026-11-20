import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TitlePurple from './TitlePurple';

describe('TitlePurple', () => {
  it('renderiza el children', () => {
    render(<TitlePurple>Mi perfil</TitlePurple>);
    expect(screen.getByRole('heading', { name: 'Mi perfil' })).toBeInTheDocument();
  });
});
