import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AltaBebeMadreExistente from './AltaBebeMadreExistente';

const madres = [
    { idMadre: 1, nombre: 'Ana', apellido: 'Pérez', dni: '12345678' },
    { idMadre: 2, nombre: 'Lucía', apellido: 'Gómez', dni: '87654321' },
];

const baseProps = {
    madres,
    listLocalities: [],
    salaOptions: [],
    onRegistrar: () => {},
};

describe('AltaBebeMadreExistente', () => {
    it('arranca pidiendo buscar una madre', () => {
        render(<AltaBebeMadreExistente {...baseProps} />);
        expect(screen.getByText('Buscar madre')).toBeInTheDocument();
        expect(screen.getByText(/Escribí al menos 2 letras o números/i)).toBeInTheDocument();
    });

    it('muestra las coincidencias al buscar por nombre', async () => {
        const user = userEvent.setup();
        render(<AltaBebeMadreExistente {...baseProps} />);
        await user.type(screen.getByPlaceholderText('Nombre, apellido o DNI'), 'Ana');
        expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
        expect(screen.getByText('DNI 12345678')).toBeInTheDocument();
    });

    it('avisa cuando no hay una madre que coincida', async () => {
        const user = userEvent.setup();
        render(<AltaBebeMadreExistente {...baseProps} />);
        await user.type(screen.getByPlaceholderText('Nombre, apellido o DNI'), 'Zzz');
        expect(
            screen.getByText(/No hay una madre activa que coincida/i),
        ).toBeInTheDocument();
    });
});
