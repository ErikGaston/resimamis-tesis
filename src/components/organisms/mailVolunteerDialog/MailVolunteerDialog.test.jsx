import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MailVolunteerDialog from './MailVolunteerDialog';

vi.mock('react-redux', () => ({
    useDispatch: () => vi.fn(),
}));

const voluntaria = { id: 1, nombre: 'Ana', mail: 'ana@mail.com' };

describe('MailVolunteerDialog', () => {
    it('no muestra el diálogo cuando open es false', () => {
        render(<MailVolunteerDialog open={false} onClose={() => {}} voluntaria={voluntaria} />);
        expect(screen.queryByText('Mail a Ana')).not.toBeInTheDocument();
    });

    it('muestra destinatario y plantillas cuando está abierto', () => {
        render(<MailVolunteerDialog open onClose={() => {}} voluntaria={voluntaria} />);
        expect(screen.getByText('Mail a Ana')).toBeInTheDocument();
        expect(screen.getByText('Se envía a ana@mail.com')).toBeInTheDocument();
        expect(screen.getByText('Recordatorio de turno')).toBeInTheDocument();
    });

    it('al elegir una plantilla completa el asunto', async () => {
        const user = userEvent.setup();
        render(<MailVolunteerDialog open onClose={() => {}} voluntaria={voluntaria} />);
        await user.click(screen.getByText('Recordatorio de turno'));
        expect(screen.getByDisplayValue('Recordatorio de tu turno')).toBeInTheDocument();
    });

    it('sin asunto ni mensaje muestra un error al enviar', async () => {
        const user = userEvent.setup();
        render(<MailVolunteerDialog open onClose={() => {}} voluntaria={voluntaria} />);
        await user.click(screen.getByRole('button', { name: /Enviar mail/i }));
        expect(screen.getByRole('alert')).toHaveTextContent(/Escribí un asunto/i);
    });

    it('el botón cancelar invoca onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<MailVolunteerDialog open onClose={onClose} voluntaria={voluntaria} />);
        await user.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
