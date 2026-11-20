import { render, screen } from '@testing-library/react';
import LabelSelect from './LabelSelect';

const list = [
  { value: 1, label: 'Mañana' },
  { value: 2, label: 'Tarde' },
];

describe('LabelSelect', () => {
  it('renderiza la etiqueta estática', () => {
    render(<LabelSelect id="turno" label="Turno" list={list} value="" onChange={() => {}} />);
    expect(screen.getByText('Turno')).toBeInTheDocument();
  });

  it('muestra el asterisco cuando es requerido', () => {
    const { container } = render(
      <LabelSelect id="turno" label="Turno" list={list} value="" required onChange={() => {}} />,
    );
    expect(container.querySelector('.MuiFormLabel-asterisk')).toBeInTheDocument();
  });

  it('refleja el valor seleccionado', () => {
    render(<LabelSelect id="turno" label="Turno" list={list} value={2} onChange={() => {}} />);
    expect(screen.getByText('Tarde')).toBeInTheDocument();
  });

  it('muestra el helperText de error', () => {
    render(
      <LabelSelect id="turno" label="Turno" list={list} value="" error helperText="Elegí un turno" onChange={() => {}} />,
    );
    expect(screen.getByText('Elegí un turno')).toBeInTheDocument();
  });
});
