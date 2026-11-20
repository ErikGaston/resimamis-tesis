import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DialogSuccess from './DialogSuccess';

describe('DialogSuccess', () => {
  it('con open muestra el mensaje', () => {
    render(<DialogSuccess open setOpen={() => {}} message="Guardado con éxito" />);
    expect(screen.getByText('Guardado con éxito')).toBeInTheDocument();
  });

  it('con open=false no renderiza el mensaje', () => {
    render(<DialogSuccess open={false} setOpen={() => {}} message="Guardado con éxito" />);
    expect(screen.queryByText('Guardado con éxito')).not.toBeInTheDocument();
  });
});
