import { render, screen } from '@testing-library/react';
import DialogInsumo from './DialogInsumo';

describe('DialogInsumo', () => {
    it('no muestra el contenido cuando open es false', () => {
        render(
            <DialogInsumo open={false} title="Agregar insumo" content={<p>Cuerpo del diálogo</p>} setOpen={() => {}} />,
        );
        expect(screen.queryByText('Cuerpo del diálogo')).not.toBeInTheDocument();
    });

    it('muestra título y contenido cuando está abierto', () => {
        render(
            <DialogInsumo open title={<span>Agregar insumo</span>} content={<p>Cuerpo del diálogo</p>} setOpen={() => {}} />,
        );
        expect(screen.getByText('Agregar insumo')).toBeInTheDocument();
        expect(screen.getByText('Cuerpo del diálogo')).toBeInTheDocument();
    });

    it('renderiza las acciones recibidas por props', () => {
        render(
            <DialogInsumo
                open
                title="T"
                content={<p>C</p>}
                actions={<button type="button">Registrar insumos</button>}
                setOpen={() => {}}
            />,
        );
        expect(screen.getByRole('button', { name: 'Registrar insumos' })).toBeInTheDocument();
    });
});
