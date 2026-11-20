import { render, screen } from '@testing-library/react';
import MotherAccordionForm from './MotherAccordionForm';

const baseProps = {
    setModel: () => {},
    listLocalities: [],
    listEstadosCiviles: [],
    submitMother: () => {},
    setError: () => {},
    listMothers: [],
    fieldErrors: {},
    setFieldErrors: () => {},
};

describe('MotherAccordionForm', () => {
    it('muestra el acordeón de datos de la madre en un alta', () => {
        render(<MotherAccordionForm {...baseProps} model={{}} typeForm="ALTA" expandedMother />);
        expect(screen.getByText('Datos de la madre')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Guardar madre y continuar/i })).toBeInTheDocument();
    });

    it('incluye el nombre de la madre en el título cuando ya está cargado', () => {
        render(
            <MotherAccordionForm {...baseProps} model={{ nombre: 'Ana', apellido: 'Pérez' }} typeForm="ALTA" />,
        );
        expect(screen.getByText('Datos de la madre: Ana Pérez')).toBeInTheDocument();
    });
});
