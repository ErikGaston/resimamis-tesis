import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssignedList from './AssignedList';

describe('AssignedList', () => {
    it('muestra el título del listado', () => {
        render(<AssignedList listAssignedVolunteer={[]} setChangeAssignedList={() => {}} submitStartHug={() => {}} />);
        expect(screen.getByText('Asignaciones del día')).toBeInTheDocument();
    });

    it('renderiza una tarjeta por asignación recibida', () => {
        const lista = [
            { idAsignacion: 1, nombreBebe: 'Bebé Uno', nombreVoluntaria: 'Ana' },
            { idAsignacion: 2, nombreBebe: 'Bebé Dos', nombreVoluntaria: 'Lucía' },
        ];
        render(<AssignedList listAssignedVolunteer={lista} setChangeAssignedList={() => {}} submitStartHug={() => {}} />);
        expect(screen.getByText('Bebé Uno')).toBeInTheDocument();
        expect(screen.getByText('Bebé Dos')).toBeInTheDocument();
    });

    it('el botón de volver avisa al padre', async () => {
        const user = userEvent.setup();
        const setChangeAssignedList = vi.fn();
        render(<AssignedList listAssignedVolunteer={[]} setChangeAssignedList={setChangeAssignedList} submitStartHug={() => {}} />);
        await user.click(screen.getByRole('button'));
        expect(setChangeAssignedList).toHaveBeenCalledWith(false);
    });
});
