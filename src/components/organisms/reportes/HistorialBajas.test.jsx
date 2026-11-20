import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistorialBajas from './HistorialBajas';

describe('HistorialBajas', () => {
    it('muestra el estado de carga mientras no hay registros', () => {
        render(<HistorialBajas historial={null} tipo={null} onCambiarTipo={() => {}} />);
        expect(screen.getByText('Cargando historial…')).toBeInTheDocument();
    });

    it('avisa cuando no hay bajas registradas', () => {
        render(<HistorialBajas historial={{ registros: [] }} tipo={null} onCambiarTipo={() => {}} />);
        expect(screen.getByText('No hay bajas registradas.')).toBeInTheDocument();
    });

    it('lista las bajas con su tipo', () => {
        const historial = {
            registros: [
                { tipoRegistro: 'Madre', idRegistro: 1, nombre: 'Ana', apellido: 'Pérez', dni: '12345678', fechaBaja: '2026-11-10T10:00:00' },
            ],
        };
        render(<HistorialBajas historial={historial} tipo={null} onCambiarTipo={() => {}} />);
        expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
        expect(screen.getByText('Madre')).toBeInTheDocument();
    });

    it('al elegir un tipo avisa al padre', async () => {
        const user = userEvent.setup();
        const onCambiarTipo = vi.fn();
        render(<HistorialBajas historial={{ registros: [] }} tipo={null} onCambiarTipo={onCambiarTipo} />);
        await user.click(screen.getByRole('button', { name: 'Voluntarias' }));
        expect(onCambiarTipo).toHaveBeenCalledWith('Voluntaria');
    });

    it('al buscar algo sin coincidencias muestra "Sin resultados."', async () => {
        const user = userEvent.setup();
        const historial = {
            registros: [
                { tipoRegistro: 'Madre', idRegistro: 1, nombre: 'Ana', apellido: 'Pérez', dni: '12345678' },
            ],
        };
        render(<HistorialBajas historial={historial} tipo={null} onCambiarTipo={() => {}} />);
        await user.type(screen.getByPlaceholderText(/Buscar por nombre o DNI/i), 'Zzz');
        expect(screen.getByText('Sin resultados.')).toBeInTheDocument();
    });
});
