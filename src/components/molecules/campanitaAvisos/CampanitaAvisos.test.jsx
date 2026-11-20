import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// El setup mockea la campanita globalmente (para silenciar act() en tests ajenos);
// acá la queremos REAL.
vi.unmock('./CampanitaAvisos');
import CampanitaAvisos from './CampanitaAvisos';

describe('CampanitaAvisos', () => {
  beforeEach(() => localStorage.clear());

  it('renderiza el botón de avisos (sin sesión no pide nada ni rompe)', async () => {
    render(
      <MemoryRouter>
        <CampanitaAvisos />
      </MemoryRouter>,
    );
    expect(await screen.findByRole('button', { name: 'Avisos' })).toBeInTheDocument();
  });
});
