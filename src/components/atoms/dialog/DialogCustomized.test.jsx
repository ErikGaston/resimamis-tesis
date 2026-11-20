import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DialogCustomized from './DialogCustomized';

describe('DialogCustomized', () => {
  it('con open muestra título, contenido y acciones', () => {
    render(
      <DialogCustomized
        open
        setOpen={() => {}}
        title="Confirmar baja"
        content={<p>¿Seguro?</p>}
        actions={<button>Aceptar</button>}
      />,
    );
    expect(screen.getByText('Confirmar baja')).toBeInTheDocument();
    expect(screen.getByText('¿Seguro?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeInTheDocument();
  });

  it('con open=false no renderiza el contenido', () => {
    render(<DialogCustomized open={false} setOpen={() => {}} title="Confirmar baja" content={<p>¿Seguro?</p>} />);
    expect(screen.queryByText('Confirmar baja')).not.toBeInTheDocument();
  });

  it('el botón de cerrar llama setOpen(false) y setModel(null)', async () => {
    const setOpen = vi.fn();
    const setModel = vi.fn();
    render(<DialogCustomized open setOpen={setOpen} setModel={setModel} title="X" content={<p>c</p>} />);
    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(setModel).toHaveBeenCalledWith(null);
  });
});
