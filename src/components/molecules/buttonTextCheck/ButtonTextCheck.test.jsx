import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonTextCheck from './ButtonTextCheck';

describe('ButtonTextCheck', () => {
  it('renderiza el texto hijo', () => {
    render(<ButtonTextCheck onClick={() => {}}>Mañana</ButtonTextCheck>);
    expect(screen.getByText('Mañana')).toBeInTheDocument();
  });

  it('dispara onClick al tocar el botón', async () => {
    const onClick = vi.fn();
    render(<ButtonTextCheck onClick={onClick}>Tarde</ButtonTextCheck>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
