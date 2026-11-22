import React, { useState } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../redux/api', () => ({ postAsistenteCalificar: vi.fn(() => Promise.resolve({})) }));
import { postAsistenteCalificar } from '../../redux/api';
import { CalificarRespuesta } from './AsistentePage';

const Con = () => {
  const [c, setC] = useState(0);
  return <CalificarRespuesta idRegistro={7} calificacion={c} onCambio={setC} />;
};

describe('CalificarRespuesta (voto opcional)', () => {
  beforeEach(() => postAsistenteCalificar.mockClear());

  it('no manda nada si no se toca', () => {
    render(<Con />);
    expect(postAsistenteCalificar).not.toHaveBeenCalled();
    expect(screen.queryByPlaceholderText(/qué estuvo mal/i)).toBeNull();
  });

  it('👍 vota bien y tocarlo de nuevo quita el voto', () => {
    render(<Con />);
    fireEvent.click(screen.getByLabelText('Buena respuesta'));
    expect(postAsistenteCalificar).toHaveBeenLastCalledWith({ idRegistro: 7, calificacion: 1 });
    fireEvent.click(screen.getByLabelText('Buena respuesta'));
    expect(postAsistenteCalificar).toHaveBeenLastCalledWith({ idRegistro: 7, calificacion: 0 });
  });

  it('👎 permite (si quiere) contar qué estuvo mal', () => {
    render(<Con />);
    fireEvent.click(screen.getByLabelText('Mala respuesta'));
    expect(postAsistenteCalificar).toHaveBeenLastCalledWith({ idRegistro: 7, calificacion: -1 });
    fireEvent.change(screen.getByPlaceholderText(/qué estuvo mal/i), { target: { value: 'dijo otro bebé' } });
    fireEvent.click(screen.getByText('Enviar'));
    expect(postAsistenteCalificar).toHaveBeenLastCalledWith({ idRegistro: 7, calificacion: -1, comentario: 'dijo otro bebé' });
    expect(screen.queryByPlaceholderText(/qué estuvo mal/i)).toBeNull();
  });
});
