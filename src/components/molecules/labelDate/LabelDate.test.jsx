import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import LabelDate from './LabelDate';

describe('LabelDate', () => {
  it('renderiza la etiqueta estática', () => {
    render(<LabelDate id="fn" label="Fecha de nacimiento" onChange={() => {}} />);
    expect(screen.getByText('Fecha de nacimiento')).toBeInTheDocument();
  });

  it('muestra el asterisco cuando es requerido', () => {
    const { container } = render(
      <LabelDate id="fn" label="Fecha de nacimiento" required onChange={() => {}} />,
    );
    expect(container.querySelector('.MuiFormLabel-asterisk')).toBeInTheDocument();
  });

  it('refleja el valor formateado en el campo', () => {
    render(
      <LabelDate
        id="fn"
        label="Fecha"
        inputFormat="DD/MM/YYYY"
        value={dayjs('2020-01-15')}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('textbox')).toHaveValue('15/01/2020');
  });
});
