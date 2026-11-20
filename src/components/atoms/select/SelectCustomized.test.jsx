import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectCustomized from './SelectCustomized';

const list = [
  { value: 1, label: 'Soltera' },
  { value: 2, label: 'Casada' },
];

describe('SelectCustomized', () => {
  it('con value vacío muestra el placeholder', () => {
    render(<SelectCustomized value="" displayEmpty placeholder="Estado civil" list={list} />);
    expect(screen.getByText('Estado civil')).toBeInTheDocument();
  });

  it('muestra el label de la opción seleccionada', () => {
    render(<SelectCustomized value={2} list={list} onChange={() => {}} />);
    expect(screen.getByText('Casada')).toBeInTheDocument();
  });

  it('al abrir lista las opciones y permite elegir una', async () => {
    const onChange = vi.fn();
    render(<SelectCustomized value="" displayEmpty placeholder="Estado civil" list={list} onChange={onChange} />);
    await userEvent.click(screen.getByText('Estado civil'));
    await userEvent.click(screen.getByRole('option', { name: 'Soltera' }));
    expect(onChange).toHaveBeenCalled();
  });
});
