import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TitleText from './TitleText';

describe('TitleText', () => {
  it('renderiza el children como título', () => {
    render(<TitleText fontsize="28px">Hola NEO</TitleText>);
    expect(screen.getByRole('heading', { name: 'Hola NEO' })).toBeInTheDocument();
  });
});
