import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityTask from './ActivityTask';

describe('ActivityTask', () => {
    it('sin asistencia registrada muestra el llamado a marcar entrada', () => {
        render(<ActivityTask check={false} listAssignmentVolunteer={[]} submitAssistence={() => {}} />);
        expect(
            screen.getByText(/Marcá tu asistencia para que la coordinadora/i),
        ).toBeInTheDocument();
    });

    it('con asistencia y sin asignaciones muestra el estado vacío', () => {
        render(<ActivityTask check listAssignmentVolunteer={[]} submitAssistence={() => {}} />);
        expect(screen.getByText('No hay asignaciones para el día de hoy.')).toBeInTheDocument();
    });

    it('al tocar "Registrar entrada" dispara submitAssistence', async () => {
        const user = userEvent.setup();
        const submitAssistence = vi.fn();
        render(<ActivityTask check={false} listAssignmentVolunteer={[]} submitAssistence={submitAssistence} />);
        await user.click(screen.getByRole('button', { name: /Registrar entrada/i }));
        expect(submitAssistence).toHaveBeenCalledTimes(1);
    });

    it('el botón de salida queda deshabilitado mientras no hay entrada', () => {
        render(
            <ActivityTask
                check={false}
                listAssignmentVolunteer={[]}
                submitAssistence={() => {}}
                submitAssistanceSalida={() => {}}
            />,
        );
        expect(screen.getByRole('button', { name: /Registrar salida/i })).toBeDisabled();
    });

    it('expone las acciones de actividad y dispara su callback', async () => {
        const user = userEvent.setup();
        const onShowAssistanceToday = vi.fn();
        render(
            <ActivityTask
                check={false}
                listAssignmentVolunteer={[]}
                submitAssistence={() => {}}
                onShowAssistanceToday={onShowAssistanceToday}
            />,
        );
        await user.click(screen.getByRole('button', { name: /Asistencias de hoy/i }));
        expect(onShowAssistanceToday).toHaveBeenCalledTimes(1);
    });
});
