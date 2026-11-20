import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import PanelDiaTemplate from './PanelDiaTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

const coordinacion = {
  bebesActivos: 5,
  voluntariasConAsistenciaHoy: 3,
  bebesAsignados: 2,
  abrazosHoy: { finalizados: 4, enCurso: 1 },
  abrazosColgados: 0,
  voluntariasEsperadasHoy: [{ idVoluntaria: 1, nombre: 'Ana', turno: 'Mañana', presente: true }],
  fecha: '2026-11-20',
};
const cobertura = {
  porcentajeCobertura: 75,
  bebesConAbrazoFinalizadoHoy: 3,
  totalBebesActivos: 4,
  bebesSinAbrazoHoy: [],
};

describe('PanelDiaTemplate', () => {
  it('muestra el header del panel', () => {
    renderWithProviders(<PanelDiaTemplate coordinacion={coordinacion} cobertura={cobertura} cargando={false} />);
    expect(screen.getByText('Panel del día')).toBeInTheDocument();
  });

  it('renderiza los KPIs con sus valores', () => {
    renderWithProviders(<PanelDiaTemplate coordinacion={coordinacion} cobertura={cobertura} cargando={false} />);
    expect(screen.getByText('Bebés activos')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Abrazos finalizados')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('En curso')).toBeInTheDocument();
  });

  it('muestra el porcentaje de cobertura', () => {
    renderWithProviders(<PanelDiaTemplate coordinacion={coordinacion} cobertura={cobertura} cargando={false} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('con 0 bebés sin abrazo muestra el mensaje de éxito', () => {
    renderWithProviders(<PanelDiaTemplate coordinacion={coordinacion} cobertura={cobertura} cargando={false} />);
    expect(screen.getByText(/todos los bebés recibieron su abrazo/i)).toBeInTheDocument();
  });

  it('lista los bebés que todavía no fueron abrazados', () => {
    const cob = {
      ...cobertura,
      bebesSinAbrazoHoy: [{ idBebe: 9, nombre: 'Beto', apellido: 'Luz', nombreSala: 'NEO A', estadoBebe: 'Sin abrazar' }],
    };
    renderWithProviders(<PanelDiaTemplate coordinacion={coordinacion} cobertura={cob} cargando={false} />);
    expect(screen.getByText('Beto Luz')).toBeInTheDocument();
    expect(screen.getByText('NEO A')).toBeInTheDocument();
    expect(screen.queryByText(/todos los bebés recibieron su abrazo/i)).not.toBeInTheDocument();
  });

  it('muestra las voluntarias esperadas por turno con su estado de llegada', () => {
    renderWithProviders(<PanelDiaTemplate coordinacion={coordinacion} cobertura={cobertura} cargando={false} />);
    expect(screen.getByText('Mañana')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Llegó')).toBeInTheDocument();
    expect(screen.getByText(/1 de 1 llegaron/i)).toBeInTheDocument();
  });
});
