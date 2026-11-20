import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CarouselWork from './CarouselWork';

const data = [
  { name: 'Madres', image: '/m.png', url: '/madres' },
  { name: 'Bebés', image: '', url: '/bebes', special: true },
];

const renderCarousel = (props) =>
  render(
    <MemoryRouter>
      <CarouselWork {...props} />
    </MemoryRouter>,
  );

describe('CarouselWork', () => {
  it('renderiza una card por cada item con su link', () => {
    renderCarousel({ data });
    expect(screen.getByText('Madres')).toBeInTheDocument();
    expect(screen.getByText('Bebés')).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/madres');
  });

  it('no explota con data vacía o indefinida', () => {
    expect(() => renderCarousel({ data: [] })).not.toThrow();
    expect(() => renderCarousel({})).not.toThrow();
  });
});
