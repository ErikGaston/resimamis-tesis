import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AvisoStockBajo from './AvisoStockBajo';

describe('AvisoStockBajo', () => {
    it('no renderiza nada si no hay insumos bajo el mínimo', () => {
        const { container } = render(<AvisoStockBajo insumos={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('muestra un único insumo con su nombre', () => {
        render(<AvisoStockBajo insumos={[{ idInsumo: 1, nombre: 'Pañales', stockActual: 2, stockMinimo: 5 }]} />);
        expect(screen.getByText('1 insumo bajo el stock mínimo')).toBeInTheDocument();
        expect(screen.getByText('Pañales')).toBeInTheDocument();
    });

    it('cuenta de a muchos y resume el excedente por encima de 4', () => {
        const insumos = Array.from({ length: 6 }, (_, i) => ({
            idInsumo: i,
            nombre: `Insumo ${i}`,
            stockActual: 0,
            stockMinimo: 3,
        }));
        render(<AvisoStockBajo insumos={insumos} />);
        expect(screen.getByText('6 insumos bajo el stock mínimo')).toBeInTheDocument();
        expect(screen.getByText('y 2 más.')).toBeInTheDocument();
    });

    it('el botón "Ver insumos" invoca su callback', async () => {
        const user = userEvent.setup();
        const onVerInsumos = vi.fn();
        render(
            <AvisoStockBajo
                insumos={[{ idInsumo: 1, nombre: 'Gasas', stockActual: 1, stockMinimo: 4 }]}
                onVerInsumos={onVerInsumos}
            />,
        );
        await user.click(screen.getByRole('button', { name: /Ver insumos/i }));
        expect(onVerInsumos).toHaveBeenCalledTimes(1);
    });
});
