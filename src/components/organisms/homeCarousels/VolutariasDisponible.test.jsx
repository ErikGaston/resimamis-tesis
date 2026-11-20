import { render, screen } from '@testing-library/react';
import VolutariasDisponible from './VolutariasDisponible';

describe('VolutariasDisponible', () => {
    it('muestra esqueletos de carga cuando la lista es null', () => {
        const { container } = render(<VolutariasDisponible listVolunteersFree={null} />);
        expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
    });

    it('muestra el mensaje vacío cuando no hay voluntarias', () => {
        render(<VolutariasDisponible listVolunteersFree={[]} />);
        expect(
            screen.getByText(/No se encontraron voluntarias con asistencia registrada/i),
        ).toBeInTheDocument();
    });

    it('muestra el título cuando hay voluntarias', () => {
        render(<VolutariasDisponible listVolunteersFree={[{ name: 'Ana', url: '' }]} />);
        expect(screen.getByText('Voluntarias de hoy')).toBeInTheDocument();
    });
});
