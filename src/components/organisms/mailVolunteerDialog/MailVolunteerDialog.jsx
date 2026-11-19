import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useDispatch } from 'react-redux';
import { enviarMailVoluntaria } from '../../../services/notificaciones';
import { showToast } from '../../../redux/actions/toastActions';
import { resolveApiErrorMessage } from '../../../utils/apiErrorMessage';

const ASUNTO_MAX = 150;
const MENSAJE_MAX = 2000;

/** Plantillas para no escribir siempre lo mismo. El texto se puede editar antes de mandar. */
const PLANTILLAS = [
  {
    id: 'turno',
    label: 'Recordatorio de turno',
    asunto: 'Recordatorio de tu turno',
    mensaje: 'Te recordamos tu próximo turno de abrazos en la Neo. ¡Te esperamos!',
  },
  {
    id: 'falta',
    label: 'Te extrañamos',
    asunto: 'Te extrañamos en la Neo',
    mensaje: 'Hace unos días que no te vemos por la Neo. ¿Está todo bien? Cuando puedas, avisanos si vas a seguir viniendo.',
  },
  {
    id: 'aviso',
    label: 'Aviso general',
    asunto: 'Aviso del programa',
    mensaje: '',
  },
];

const MailVolunteerDialog = ({ open, onClose, voluntaria }) => {
  const dispatch = useDispatch();
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [plantilla, setPlantilla] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setAsunto('');
      setMensaje('');
      setPlantilla(null);
      setError('');
    }
  }, [open]);

  const elegirPlantilla = (p) => {
    setPlantilla(p.id);
    setAsunto(p.asunto);
    setMensaje(p.mensaje);
    setError('');
  };

  const enviar = async () => {
    if (enviando) return;
    if (!asunto.trim()) { setError('Escribí un asunto.'); return; }
    if (!mensaje.trim()) { setError('Escribí un mensaje.'); return; }
    setEnviando(true);
    try {
      await enviarMailVoluntaria(voluntaria.id, { asunto: asunto.trim(), mensaje: mensaje.trim() });
      dispatch(showToast({ message: `Mail enviado a ${voluntaria.nombre}.`, severity: 'success' }));
      onClose();
    } catch (err) {
      setError(resolveApiErrorMessage(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={Boolean(open)} onClose={enviando ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ color: '#152C70', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <MailOutlineIcon sx={{ color: '#7F00FF' }} /> Mail a {voluntaria?.nombre}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(21,44,112,0.7)', mb: 1.5 }}>
          Se envía a {voluntaria?.mail}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {PLANTILLAS.map((p) => (
            <Chip
              key={p.id}
              label={p.label}
              onClick={() => elegirPlantilla(p)}
              variant={plantilla === p.id ? 'filled' : 'outlined'}
              size="small"
              sx={plantilla === p.id
                ? { bgcolor: '#7F00FF', color: '#fff', '&:hover': { bgcolor: '#6a00d6' } }
                : { borderColor: 'rgba(127,0,255,0.35)', color: '#152C70' }}
            />
          ))}
        </Box>
        <TextField
          label="Asunto"
          value={asunto}
          onChange={(e) => { setAsunto(e.target.value); setError(''); }}
          fullWidth
          inputProps={{ maxLength: ASUNTO_MAX }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mensaje"
          value={mensaje}
          onChange={(e) => { setMensaje(e.target.value); setError(''); }}
          fullWidth
          multiline
          rows={5}
          inputProps={{ maxLength: MENSAJE_MAX }}
          helperText={`${mensaje.length}/${MENSAJE_MAX}`}
          FormHelperTextProps={{ sx: { textAlign: 'right', mr: 0 } }}
        />
        {error && (
          <Typography role="alert" sx={{ color: '#C23814', fontSize: '0.85rem', mt: 1 }}>{error}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={enviando} sx={{ textTransform: 'none' }}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={enviar}
          disabled={enviando}
          sx={{ textTransform: 'none', fontWeight: 700, background: 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)' }}
        >
          {enviando ? 'Enviando…' : 'Enviar mail'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MailVolunteerDialog;
