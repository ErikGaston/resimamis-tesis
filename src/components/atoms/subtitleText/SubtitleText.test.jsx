import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubtitleText from './SubtitleText';

describe('SubtitleText', () => {
  it('renderiza el children como subtítulo', () => {
    render(<SubtitleText>Programa de abrazos</SubtitleText>);
    expect(screen.getByRole('heading', { name: 'Programa de abrazos' })).toBeInTheDocument();
  });
});
