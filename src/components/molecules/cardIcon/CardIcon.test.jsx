import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CardIcon from './CardIcon';

const renderCard = (props) =>
  render(
    <MemoryRouter>
      <CardIcon {...props} />
    </MemoryRouter>,
  );

const base = { id: 7, name: 'Ana Pérez', dni: 47110017, context: 'madre', whatsapp: 'https://wa.me/549' };

describe('CardIcon', () => {
  it('muestra nombre y DNI y enlaza al perfil', () => {
    renderCard(base);
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('DNI 47110017')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver perfil de Ana Pérez' }))
      .toHaveAttribute('href', '/madre/perfil/7');
  });

  it('sin onAdminDelete no muestra el botón de baja', () => {
    renderCard(base);
    expect(screen.queryByRole('button', { name: /Eliminar registro/ })).not.toBeInTheDocument();
  });

  it('con onAdminDelete, el botón de baja llama al callback con el id', async () => {
    const onAdminDelete = vi.fn();
    renderCard({ ...base, id: 9, context: 'voluntaria', onAdminDelete });
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar registro de Ana Pérez' }));
    expect(onAdminDelete).toHaveBeenCalledWith(9);
  });

  it('muestra el botón de mail solo si hay onSendMail', () => {
    const onSendMail = vi.fn();
    renderCard({ ...base, onSendMail });
    expect(screen.getByRole('button', { name: 'Enviar mail a Ana Pérez' })).toBeInTheDocument();
  });
});
