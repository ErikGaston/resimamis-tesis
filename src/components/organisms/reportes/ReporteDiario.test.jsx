import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReporteDiario from './ReporteDiario';

describe('ReporteDiario', () => {
    it('muestra el título del reporte', () => {
        render(<ReporteDiario reporte={null} onConsultar={() => {}} />);
        expect(screen.getByText('Reporte diario')).toBeInTheDocument();
    });

    it('muestra el estado vacío cuando no hubo movimientos', () => {
        render(<ReporteDiario reporte={{ fecha: '2026-11-18', totalMovimientos: 0 }} onConsultar={() => {}} />);
        expect(screen.getByText(/No hay movimientos registrados el/i)).toBeInTheDocument();
    });

    it('renderiza las categorías con movimientos', () => {
        const reporte = {
            fecha: '2026-11-18',
            totalMovimientos: 1,
            categorias: [
                {
                    categoria: 'Abrazos',
                    cantidad: 1,
                    movimientos: [{ fechaHora: '2026-11-18T09:30:00', tipo: 'Inicio', descripcion: 'Bebé Uno' }],
                },
            ],
        };
        render(<ReporteDiario reporte={reporte} onConsultar={() => {}} />);
        expect(screen.getByText('Abrazos')).toBeInTheDocument();
        expect(screen.getByText('Bebé Uno')).toBeInTheDocument();
    });

    it('el botón "Ver reporte" consulta la fecha seleccionada', async () => {
        const user = userEvent.setup();
        const onConsultar = vi.fn();
        render(<ReporteDiario reporte={null} onConsultar={onConsultar} />);
        await user.click(screen.getByRole('button', { name: /Ver reporte/i }));
        expect(onConsultar).toHaveBeenCalledTimes(1);
        expect(typeof onConsultar.mock.calls[0][0]).toBe('string');
    });
});
