import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssignmentTask from './AssignmentTask';

const baseProps = {
    toggleVolunteerSelection: () => {},
    selectVolunteersFree: () => {},
    toggleBabyTareaSelection: () => {},
    selectAllBabysFree: () => {},
    submitAssignmentTask: () => {},
    setChangeAssignedList: () => {},
};

describe('AssignmentTask', () => {
    it('muestra los estados vacíos cuando no hay voluntarias ni bebés', () => {
        render(<AssignmentTask {...baseProps} listVolunteersFree={[]} listBabysFree={[]} />);
        expect(
            screen.getByText(/No se encontraron voluntarias con asistencia registrada/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/No hay bebés disponibles para abrazar/i)).toBeInTheDocument();
    });

    it('lista las voluntarias presentes por nombre', () => {
        render(
            <AssignmentTask
                {...baseProps}
                listVolunteersFree={[{ idVoluntaria: 1, nombre: 'Ana', apellido: 'Pérez' }]}
                listBabysFree={[]}
            />,
        );
        expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    });

    it('el botón principal está deshabilitado sin selección', () => {
        render(<AssignmentTask {...baseProps} listVolunteersFree={[]} listBabysFree={[]} />);
        expect(screen.getByRole('button', { name: /Generar asignaciones/i })).toBeDisabled();
    });

    it('al seleccionar una voluntaria notifica al padre', async () => {
        const user = userEvent.setup();
        const toggleVolunteerSelection = vi.fn();
        render(
            <AssignmentTask
                {...baseProps}
                toggleVolunteerSelection={toggleVolunteerSelection}
                listVolunteersFree={[{ idVoluntaria: 7, nombre: 'Ana', apellido: 'Pérez' }]}
                listBabysFree={[]}
            />,
        );
        await user.click(screen.getByText('Ana Pérez'));
        expect(toggleVolunteerSelection).toHaveBeenCalledWith(7);
    });

    it('abre el diálogo de asignación rápida cuando hay callback', async () => {
        const user = userEvent.setup();
        render(
            <AssignmentTask
                {...baseProps}
                listVolunteersFree={[{ idVoluntaria: 1, nombre: 'Ana', apellido: 'Pérez' }]}
                listBabysFree={[{ idTarea: 5, nombre: 'Bebé', apellido: 'Uno' }]}
                submitAssignmentQuick={() => {}}
            />,
        );
        await user.click(screen.getByText('Asignación rápida'));
        expect(screen.getByText(/Asigná una sola voluntaria a un bebé/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Generar' })).toBeDisabled();
    });
});
