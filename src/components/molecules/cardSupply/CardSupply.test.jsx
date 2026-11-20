import { render, screen } from '@testing-library/react';
import CardSupply from './CardSupply';

describe('CardSupply', () => {
  it('muestra el nombre y el valor secundario', () => {
    render(<CardSupply first="Pañales" second="12 u" />);
    expect(screen.getByText('Pañales')).toBeInTheDocument();
    expect(screen.getByText('12 u')).toBeInTheDocument();
  });

  it('renderiza la barra de progreso según stock actual/máximo', () => {
    render(<CardSupply first="Gasas" second="5" stockActual={5} stockMaximo={10} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });

  it('sin stock máximo no dibuja barra de progreso', () => {
    render(<CardSupply first="Gasas" second="5" />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('marca stock bajo cuando actual <= mínimo', () => {
    const { container } = render(
      <CardSupply first="Alcohol" second="1" stockActual={1} stockMinimo={3} stockMaximo={10} />,
    );
    expect(container.querySelector('svg[data-testid="WarningAmberIcon"]')).toBeInTheDocument();
  });
});
