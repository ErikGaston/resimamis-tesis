import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccordionCustomized from './AccordionCustomized';

describe('AccordionCustomized', () => {
  it('muestra el summary', () => {
    render(<AccordionCustomized item={1} summary={<span>Ficha del bebé</span>} details={<p>contenido</p>} />);
    expect(screen.getByText('Ficha del bebé')).toBeInTheDocument();
  });

  it('controlado: al clickear el summary avisa onExpandedChange con el nuevo estado', async () => {
    const onExpandedChange = vi.fn();
    render(
      <AccordionCustomized
        item={1}
        expanded={false}
        onExpandedChange={onExpandedChange}
        summary={<span>Ficha del bebé</span>}
        details={<p>contenido</p>}
      />,
    );
    await userEvent.click(screen.getByText('Ficha del bebé'));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });
});
