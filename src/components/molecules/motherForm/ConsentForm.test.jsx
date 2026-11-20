import { render, screen, fireEvent } from '@testing-library/react';
import ConsentForm from './ConsentForm';

describe('ConsentForm', () => {
  it('renderiza el campo Motivo con su valor', () => {
    render(<ConsentForm model={{ motivo: 'Prematuro' }} setModel={() => {}} setError={() => {}} />);
    expect(screen.getByText('Motivo')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('Prematuro');
  });

  it('actualiza el modelo al tipear el motivo', () => {
    const setModel = vi.fn();
    render(<ConsentForm model={{ motivo: '' }} setModel={setModel} setError={() => {}} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bajo peso', name: 'motivo' } });
    expect(setModel).toHaveBeenCalledWith(expect.objectContaining({ motivo: 'Bajo peso' }));
  });

  it('ofrece el selector de archivo si no hay archivo cargado', () => {
    render(<ConsentForm model={{}} setModel={() => {}} setError={() => {}} />);
    expect(screen.getByText('Seleccione el archivo')).toBeInTheDocument();
  });

  it('muestra el nombre del archivo ya cargado', () => {
    render(<ConsentForm model={{ file_name: 'consentimiento.jpg' }} setModel={() => {}} setError={() => {}} />);
    expect(screen.getByText('consentimiento.jpg')).toBeInTheDocument();
  });

  it('muestra el mensaje de error recibido', () => {
    render(<ConsentForm model={{}} setModel={() => {}} error="Archivo inválido" setError={() => {}} />);
    expect(screen.getByText('Archivo inválido')).toBeInTheDocument();
  });
});
