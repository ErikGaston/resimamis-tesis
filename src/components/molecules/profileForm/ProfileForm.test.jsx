import { render, screen, fireEvent } from '@testing-library/react';
import ProfileForm from './ProfileForm';

const model = { nombre: 'Ana', apellido: 'Pérez', dni: '38123456', mail: 'ana@mail.com', celular: '3511234567' };

describe('ProfileForm', () => {
  it('renderiza los campos con sus valores', () => {
    const { container } = render(<ProfileForm model={model} edit />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(container.querySelector('input[name="nombre"]')).toHaveValue('Ana');
    expect(container.querySelector('input[name="mail"]')).toHaveValue('ana@mail.com');
  });

  it('sin edición los campos quedan deshabilitados', () => {
    const { container } = render(<ProfileForm model={model} edit={false} />);
    expect(container.querySelector('input[name="nombre"]')).toBeDisabled();
  });

  it('actualiza el modelo al editar el nombre', () => {
    const setModel = vi.fn();
    const { container } = render(<ProfileForm model={model} setModel={setModel} edit />);
    fireEvent.change(container.querySelector('input[name="nombre"]'), {
      target: { value: 'Ani', name: 'nombre' },
    });
    expect(setModel).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Ani' }));
  });

  it('en myProfile oculta el campo DNI', () => {
    const { container } = render(<ProfileForm model={model} edit myProfile />);
    expect(container.querySelector('input[name="dni"]')).toBeNull();
  });
});
