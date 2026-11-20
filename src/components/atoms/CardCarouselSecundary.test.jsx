import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardCarouselSecundary from './CardCarouselSecundary';

describe('CardCarouselSecundary', () => {
  it('muestra el nombre y sus iniciales', () => {
    render(<CardCarouselSecundary name="Ana Pérez" />);
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('AP')).toBeInTheDocument();
  });

  it('con un solo nombre usa la inicial; sin nombre usa "?"', () => {
    const { rerender } = render(<CardCarouselSecundary name="Marta" />);
    expect(screen.getByText('M')).toBeInTheDocument();
    rerender(<CardCarouselSecundary name="" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
