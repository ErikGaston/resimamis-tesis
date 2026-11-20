import { render, screen } from '@testing-library/react';
import CardCarouselWork from './CardCarouselWork';

describe('CardCarouselWork', () => {
  it('renderiza el nombre y la imagen con su alt', () => {
    render(<CardCarouselWork name="Madres" label="icono madres" image="/m.png" />);
    expect(screen.getByText('Madres')).toBeInTheDocument();
    expect(screen.getByAltText('icono madres')).toHaveAttribute('src', '/m.png');
  });

  it('usa valores por defecto sin props', () => {
    render(<CardCarouselWork />);
    expect(screen.getByText('nombre')).toBeInTheDocument();
    expect(screen.getByAltText('img')).toBeInTheDocument();
  });
});
