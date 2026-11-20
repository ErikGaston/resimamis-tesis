import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import TasksTemplate from './TasksTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

function setup(props = {}) {
  const noop = vi.fn();
  const merged = {
    model: {},
    setModel: noop,
    assignmentVolunteer: null,
    valueTask: 1,
    changeTask: () => () => {},
    submitAssistence: noop,
    submitAssistanceSalida: noop,
    checkAssistance: false,
    salidaRegistrada: false,
    volunteersFree: null,
    listBabysFree: null,
    selectVolunteersFree: [],
    selectedVolunteerIds: [],
    toggleVolunteerSelection: noop,
    selectAllBabysFree: noop,
    selectedBabyTareaIds: [],
    toggleBabyTareaSelection: noop,
    submitAssignmentTask: noop,
    listAssignment: null,
    submitStartHug: noop,
    submitEndHug: noop,
    changeStateInsumo: noop,
    stateInsumo: null,
    setStateInsumo: noop,
    supplies: null,
    submitChangeSupplies: noop,
    changeInformationHug: false,
    setChangeInformationHug: noop,
    changeAssignedList: false,
    setChangeAssignedList: noop,
    onShowAssistanceToday: noop,
    onShowAssistanceHistoricas: noop,
    onAssignmentDetail: noop,
    submitAssignmentQuick: noop,
    canAccessAssignment: false,
    ...props,
  };
  return { ...merged, ...renderWithProviders(<TasksTemplate {...merged} />) };
}

describe('TasksTemplate', () => {
  it('renderiza el header "Tareas" y el tab "Actividades"', () => {
    setup();
    expect(screen.getByText('Tareas')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Actividades' })).toBeInTheDocument();
  });

  it('sin acceso a asignación NO muestra el tab "Asignaciones"', () => {
    setup({ canAccessAssignment: false });
    expect(screen.queryByRole('tab', { name: 'Asignaciones' })).not.toBeInTheDocument();
  });

  it('con acceso a asignación muestra el tab "Asignaciones"', () => {
    setup({ canAccessAssignment: true });
    expect(screen.getByRole('tab', { name: 'Asignaciones' })).toBeInTheDocument();
  });
});
