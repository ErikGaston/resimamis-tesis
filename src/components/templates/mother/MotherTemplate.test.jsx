import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import MotherTemplate from './MotherTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

vi.mock('../../organisms/motherAccordionForm/MotherAccordionForm', () => ({
  default: () => <div data-testid="mother-accordion-form" />,
}));
vi.mock('../../organisms/motherAccordionForm/AltaBebeMadreExistente', () => ({
  default: () => <div data-testid="alta-bebe-madre-existente" />,
}));

const baseProps = {
  model: {},
  setModel: vi.fn(),
  localities: [],
  estadosCiviles: [],
  typeForm: 'ALTA',
  onRegistrarBebeMadreExistente: vi.fn(),
};

describe('MotherTemplate', () => {
  it('en ALTA muestra el header "Nueva madre" y el toggle de tipo de alta', () => {
    renderWithProviders(<MotherTemplate {...baseProps} />);
    expect(screen.getByText('Nueva madre')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Madre nueva' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Madre ya registrada' })).toBeInTheDocument();
    expect(screen.getByTestId('mother-accordion-form')).toBeInTheDocument();
  });

  it('al elegir "Madre ya registrada" cambia a alta de bebé para madre existente', () => {
    renderWithProviders(<MotherTemplate {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Madre ya registrada' }));
    expect(screen.getByText('Nuevo bebé')).toBeInTheDocument();
    expect(screen.getByTestId('alta-bebe-madre-existente')).toBeInTheDocument();
  });

  it('iniciarConMadreExistente arranca directo en el alta de bebé para madre existente', () => {
    renderWithProviders(<MotherTemplate {...baseProps} iniciarConMadreExistente />);
    expect(screen.getByText('Nuevo bebé')).toBeInTheDocument();
    expect(screen.getByTestId('alta-bebe-madre-existente')).toBeInTheDocument();
  });
});
