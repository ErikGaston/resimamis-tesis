import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VisitasBebe from './VisitasBebe';

const baseProps = {
    idBebe: 10,
    onCrear: () => {},
    onEditar: () => {},
    onEliminar: () => {},
};

describe('VisitasBebe', () => {
    it('muestra el estado vacío cuando no hay visitas', () => {
        render(<VisitasBebe {...baseProps} visitasList={[]} />);
        expect(screen.getByText('Sin visitas registradas para este bebé.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Nueva visita/i })).toBeInTheDocument();
    });

    it('lista las visitas registradas', () => {
        const visitas = [
            { idVisita: 1, nombreVisitante: 'Juan', familiar: 'Padre', fechaHoraVisita: '2026-11-18T10:00:00' },
        ];
        render(<VisitasBebe {...baseProps} visitasList={visitas} />);
        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText(/Padre/)).toBeInTheDocument();
    });

    it('abre el formulario de nueva visita con el botón de guardar deshabilitado', async () => {
        const user = userEvent.setup();
        render(<VisitasBebe {...baseProps} visitasList={[]} />);
        await user.click(screen.getByRole('button', { name: /Nueva visita/i }));
        expect(screen.getByText('Nueva visita')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Registrar visita/i })).toBeDisabled();
    });

    it('al eliminar una visita avisa con su id', async () => {
        const user = userEvent.setup();
        const onEliminar = vi.fn();
        const visitas = [
            { idVisita: 7, nombreVisitante: 'Juan', familiar: 'Padre', fechaHoraVisita: '2026-11-18T10:00:00' },
        ];
        render(<VisitasBebe {...baseProps} visitasList={visitas} onEliminar={onEliminar} />);
        await user.click(screen.getByRole('button', { name: /Eliminar visita de Juan/i }));
        expect(onEliminar).toHaveBeenCalledWith(7);
    });

    it('abre el diálogo de edición al tocar editar', async () => {
        const user = userEvent.setup();
        const visitas = [
            { idVisita: 7, nombreVisitante: 'Juan', familiar: 'Padre', fechaHoraVisita: '2026-11-18T10:00:00' },
        ];
        render(<VisitasBebe {...baseProps} visitasList={visitas} />);
        await user.click(screen.getByRole('button', { name: /Editar visita de Juan/i }));
        expect(screen.getByText('Editar visita')).toBeInTheDocument();
    });
});
