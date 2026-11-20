import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssistanceDataDialog from './AssistanceDataDialog';

describe('AssistanceDataDialog', () => {
    it('no muestra el título cuando está cerrado', () => {
        render(<AssistanceDataDialog open={false} title="Asistencias de hoy" data={[]} onClose={() => {}} />);
        expect(screen.queryByText('Asistencias de hoy')).not.toBeInTheDocument();
    });

    it('muestra el título en el portal cuando está abierto', () => {
        render(<AssistanceDataDialog open title="Asistencias de hoy" data={[]} onClose={() => {}} />);
        expect(screen.getByText('Asistencias de hoy')).toBeInTheDocument();
    });

    it('muestra el estado vacío con un array vacío', () => {
        render(<AssistanceDataDialog open title="Histórico" data={[]} onClose={() => {}} />);
        expect(screen.getByText('No hay registros en esta consulta.')).toBeInTheDocument();
    });

    it('renderiza las tarjetas de asistencia con nombre e ingreso', () => {
        const data = [
            { idAsistencia: 1, fechaHoraIngreso: '2026-11-20T08:00:00', voluntaria: { nombre: 'Ana', apellido: 'Pérez' } },
        ];
        render(<AssistanceDataDialog open title="Asistencias" data={data} onClose={() => {}} />);
        expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
        expect(screen.getByText('1 registro')).toBeInTheDocument();
    });

    it('el botón cerrar dispara onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<AssistanceDataDialog open title="Asistencias" data={[]} onClose={onClose} />);
        await user.click(screen.getByRole('button', { name: /Cerrar/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
