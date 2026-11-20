import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import DatePickerCustomized from './DatePickerCustomized';

describe('DatePickerCustomized', () => {
  it('renderiza un campo de fecha', () => {
    render(<DatePickerCustomized label="Fecha de nacimiento" value={null} onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('muestra el valor con el formato indicado', () => {
    render(
      <DatePickerCustomized
        label="Fecha"
        inputFormat="DD/MM/YYYY"
        value={dayjs('2020-01-15')}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('textbox')).toHaveValue('15/01/2020');
  });
});
