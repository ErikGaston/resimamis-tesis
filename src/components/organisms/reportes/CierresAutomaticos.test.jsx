import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CierresAutomaticos from './CierresAutomaticos';

describe('CierresAutomaticos', () => {
    it('muestra estados de carga mientras no hay datos', () => {
        render(<CierresAutomaticos estado={null} resultado={null} onConsultar={() => {}} />);
        expect(screen.getByText('Cargando…')).toBeInTheDocument();
        expect(screen.getByText('Cargando cierres…')).toBeInTheDocument();
    });

    it('muestra los estados vacíos cuando no hubo corridas ni cierres', () => {
        render(
            <CierresAutomaticos
                estado={{ ultimasEjecuciones: [] }}
                resultado={{ cierres: [] }}
                onConsultar={() => {}}
            />,
        );
        expect(screen.getByText('Todavía no hay corridas registradas.')).toBeInTheDocument();
        expect(screen.getByText(/No hubo cierres automáticos en los últimos 7 días/i)).toBeInTheDocument();
    });

    it('lista los cierres recibidos', () => {
        const resultado = {
            cierres: [
                { idAsignacion: 1, fechaHora: '2026-11-19T23:59:00', descripcion: 'Abrazo de Bebé Uno', origen: 'Cierre diario' },
            ],
        };
        render(<CierresAutomaticos estado={{ ultimasEjecuciones: [] }} resultado={resultado} onConsultar={() => {}} />);
        expect(screen.getByText('Abrazo de Bebé Uno')).toBeInTheDocument();
        expect(screen.getByText('1 abrazo cerrado')).toBeInTheDocument();
    });

    it('al cambiar de período consulta el nuevo rango', async () => {
        const user = userEvent.setup();
        const onConsultar = vi.fn();
        render(
            <CierresAutomaticos
                estado={{ ultimasEjecuciones: [] }}
                resultado={{ cierres: [] }}
                onConsultar={onConsultar}
            />,
        );
        await user.click(screen.getByRole('button', { name: '30 días' }));
        expect(onConsultar).toHaveBeenCalledTimes(1);
        expect(onConsultar.mock.calls[0][0]).toHaveProperty('fechaDesde');
        expect(onConsultar.mock.calls[0][0]).toHaveProperty('fechaHasta');
    });
});
