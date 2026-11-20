import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PanelTrabajo from './PanelTrabajo';

const renderPanel = () =>
    render(
        <MemoryRouter>
            <PanelTrabajo />
        </MemoryRouter>,
    );

describe('PanelTrabajo', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('muestra las secciones base para cualquier voluntaria', () => {
        localStorage.setItem('voluntaria', JSON.stringify({ rol: 'voluntaria' }));
        renderPanel();
        expect(screen.getByText('Panel de trabajo')).toBeInTheDocument();
        expect(screen.getByText('Personas')).toBeInTheDocument();
        expect(screen.getByText('Gestión')).toBeInTheDocument();
    });

    it('no muestra accesos de coordinación si no es coordinadora', () => {
        localStorage.setItem('voluntaria', JSON.stringify({ rol: 'voluntaria' }));
        renderPanel();
        expect(screen.queryByText('Coordinación')).not.toBeInTheDocument();
        expect(screen.queryByText('Panel del día')).not.toBeInTheDocument();
    });

    it('muestra los accesos de coordinación cuando es coordinadora', () => {
        localStorage.setItem('voluntaria', JSON.stringify({ rol: 'Coordinadora' }));
        renderPanel();
        expect(screen.getByText('Coordinación')).toBeInTheDocument();
        expect(screen.getByText('Panel del día')).toBeInTheDocument();
        expect(screen.getByText('Salas en vivo')).toBeInTheDocument();
        expect(screen.getByText('Asistente')).toBeInTheDocument();
    });
});
