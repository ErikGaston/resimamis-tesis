import { render, screen } from '@testing-library/react';
import CauroselSecundary from './CauroselSecundary';

describe('CauroselSecundary', () => {
  it('renderiza una card por cada item del data', () => {
    render(<CauroselSecundary data={[{ name: 'Ana', url: '', label: 'a' }, { name: 'Luz', url: '', label: 'l' }]} />);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Luz')).toBeInTheDocument();
  });

  it('no explota con data vacía (default)', () => {
    expect(() => render(<CauroselSecundary />)).not.toThrow();
  });
});
