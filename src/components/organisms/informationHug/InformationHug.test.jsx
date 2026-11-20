import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InformationHug from './InformationHug';

const baseProps = {
    onClose: () => {},
    model: { comentario: '' },
    setModel: () => {},
    submitEndHug: () => {},
    changeStateInsumo: () => {},
    stateInsumo: '',
    setStateInsumo: () => {},
    listSupplies: [],
    setListSupplies: () => {},
    submitChangeSupplies: () => {},
};

describe('InformationHug', () => {
    it('no muestra el diálogo cuando open es false', () => {
        render(<InformationHug {...baseProps} open={false} hug={{ nombreBebe: 'Bebé Uno' }} />);
        expect(screen.queryByText('Finalizar abrazo')).not.toBeInTheDocument();
    });

    it('muestra el nombre del bebé y el campo de comentario cuando está abierto', () => {
        render(<InformationHug {...baseProps} open hug={{ nombreBebe: 'Bebé Uno' }} />);
        expect(screen.getByText('Bebé Uno')).toBeInTheDocument();
        expect(screen.getByLabelText(/Comentario \(opcional\)/i)).toBeInTheDocument();
    });

    it('lista los insumos ya registrados del abrazo', () => {
        const hug = {
            nombreBebe: 'Bebé Uno',
            detalles: [{ idInsumo: 1, nombreInsumo: 'Pañales', cantidad: 2 }],
        };
        render(<InformationHug {...baseProps} open hug={hug} />);
        expect(screen.getByText('Insumos registrados')).toBeInTheDocument();
        expect(screen.getByText('Pañales')).toBeInTheDocument();
    });

    it('al finalizar abrazo dispara submitEndHug con el id de la asignación', async () => {
        const user = userEvent.setup();
        const submitEndHug = vi.fn();
        render(
            <InformationHug
                {...baseProps}
                open
                hug={{ nombreBebe: 'Bebé Uno', idAsignacion: 42 }}
                submitEndHug={submitEndHug}
            />,
        );
        await user.click(screen.getByRole('button', { name: /Finalizar abrazo/i }));
        expect(submitEndHug).toHaveBeenCalledWith(42);
    });
});
