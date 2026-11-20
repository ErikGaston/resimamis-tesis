import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiasTurnosVoluntarias from './DiasTurnosVoluntarias';

describe('DiasTurnosVoluntarias', () => {
    it('muestra el título del reporte', () => {
        render(<DiasTurnosVoluntarias voluntarias={[]} resultado={null} onConsultar={() => {}} />);
        expect(screen.getByText('Días y turnos de las voluntarias')).toBeInTheDocument();
    });

    it('muestra el estado vacío cuando no hay registros', () => {
        render(<DiasTurnosVoluntarias voluntarias={[]} resultado={{ registros: [] }} onConsultar={() => {}} />);
        expect(
            screen.getByText('No hay datos disponibles para el período seleccionado.'),
        ).toBeInTheDocument();
    });

    it('lista los registros recibidos', () => {
        const resultado = {
            registros: [
                { idVoluntaria: 1, fecha: '2026-11-18', dia: 'Miércoles', nombre: 'Ana', apellido: 'Pérez', turno: 'Mañana' },
            ],
        };
        render(<DiasTurnosVoluntarias voluntarias={[]} resultado={resultado} onConsultar={() => {}} />);
        expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
        expect(screen.getByText('1 registro')).toBeInTheDocument();
    });

    it('el botón consultar envía el rango de fechas', async () => {
        const user = userEvent.setup();
        const onConsultar = vi.fn();
        render(<DiasTurnosVoluntarias voluntarias={[]} resultado={null} onConsultar={onConsultar} />);
        await user.click(screen.getByRole('button', { name: /Consultar días y turnos/i }));
        expect(onConsultar).toHaveBeenCalledTimes(1);
        expect(onConsultar.mock.calls[0][0]).toHaveProperty('fechaDesde');
        expect(onConsultar.mock.calls[0][0]).toHaveProperty('fechaHasta');
    });
});
