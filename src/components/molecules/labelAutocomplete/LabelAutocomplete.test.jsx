import { render, screen } from '@testing-library/react';
import LabelAutocomplete from './LabelAutocomplete';

const options = [
  { label: 'Córdoba', value: 1 },
  { label: 'Rosario', value: 2 },
];

describe('LabelAutocomplete', () => {
  it('renderiza la etiqueta estática', () => {
    render(<LabelAutocomplete id="loc" label="Localidad" options={options} onChange={() => {}} />);
    expect(screen.getByText('Localidad')).toBeInTheDocument();
  });

  it('marca el input como requerido', () => {
    const { container } = render(
      <LabelAutocomplete id="loc" label="Localidad" options={options} required onChange={() => {}} />,
    );
    expect(container.querySelector('input[required]')).toBeInTheDocument();
  });

  it('refleja el valor seleccionado en el input', () => {
    render(
      <LabelAutocomplete id="loc" label="Localidad" options={options} value={options[0]} onChange={() => {}} />,
    );
    expect(screen.getByRole('combobox')).toHaveValue('Córdoba');
  });
});
