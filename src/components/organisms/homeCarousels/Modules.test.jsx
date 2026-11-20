import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Modules from './Modules';

const renderModules = (props) =>
    render(
        <MemoryRouter>
            <Modules {...props} />
        </MemoryRouter>,
    );

describe('Modules', () => {
    it('saluda con el nombre de la voluntaria', () => {
        renderModules({ nameVolunteer: 'Ana' });
        expect(screen.getByText('¡Hola, Ana!')).toBeInTheDocument();
    });

    it('saluda genérico cuando no hay nombre', () => {
        renderModules({});
        expect(screen.getByText('¡Hola!')).toBeInTheDocument();
    });

    it('al cerrar sesión limpia localStorage', async () => {
        const user = userEvent.setup();
        localStorage.setItem('token', 'abc');
        renderModules({ nameVolunteer: 'Ana' });
        await user.click(screen.getByRole('button', { name: /Cerrar sesión/i }));
        expect(localStorage.getItem('token')).toBeNull();
    });
});
