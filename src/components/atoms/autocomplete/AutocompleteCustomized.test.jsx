import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AutocompleteCustomized from './AutocompleteCustomized';

const options = ['Córdoba', 'Rosario', 'Mendoza'];

describe('AutocompleteCustomized', () => {
  it('renderiza el input con su etiqueta', () => {
    render(<AutocompleteCustomized label="Localidad" options={options} value="" onChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: 'Localidad' })).toBeInTheDocument();
  });

  it('al abrir lista las opciones y al elegir una llama onChange', async () => {
    const onChange = vi.fn();
    render(<AutocompleteCustomized label="Localidad" options={options} value="" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Localidad' }));
    await userEvent.click(screen.getByRole('option', { name: 'Rosario' }));
    expect(onChange).toHaveBeenCalled();
  });
});
