import React, { useEffect, useState } from 'react';
import { Box, Button, Switch, Typography } from '@mui/material';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useDispatch } from 'react-redux';
import { activarPush, desactivarPush, soportaPush, suscripcionActual } from '../../../utils/push';
import { probarPush } from '../../../services/notificaciones';
import { showToast } from '../../../redux/actions/toastActions';
import { resolveApiErrorMessage } from '../../../utils/apiErrorMessage';

const MENSAJES = {
  denegado: 'El navegador bloqueó las notificaciones. Habilitalas desde la configuración del sitio.',
  'no-soportado': 'Este navegador no admite notificaciones. En iPhone, agregá la app a la pantalla de inicio.',
  'no-configurado': 'Las notificaciones todavía no están configuradas en el servidor.',
};

/** Bloque de Mi perfil para activar las notificaciones push en este dispositivo. */
const PushToggle = () => {
  const dispatch = useDispatch();
  const [activo, setActivo] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const soportado = soportaPush();

  useEffect(() => {
    let vivo = true;
    suscripcionActual()
      .then((s) => { if (vivo) setActivo(Boolean(s) && Notification.permission === 'granted'); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  const toast = (message, severity) => dispatch(showToast({ message, severity }));

  const cambiar = async () => {
    if (ocupado) return;
    setOcupado(true);
    try {
      if (activo) {
        await desactivarPush();
        setActivo(false);
        toast('Notificaciones desactivadas en este dispositivo.', 'info');
      } else {
        const r = await activarPush();
        if (r === 'ok') {
          setActivo(true);
          toast('Notificaciones activadas. Te avisamos cuando te asignen un bebé.', 'success');
        } else {
          toast(MENSAJES[r], 'warning');
        }
      }
    } catch (err) {
      toast(resolveApiErrorMessage(err), 'error');
    } finally {
      setOcupado(false);
    }
  };

  const probar = async () => {
    if (ocupado) return;
    setOcupado(true);
    try {
      const r = await probarPush();
      toast(r?.enviados ? 'Te mandamos una notificación de prueba.' : 'No hay dispositivos activos.', r?.enviados ? 'success' : 'info');
    } catch (err) {
      toast(resolveApiErrorMessage(err), 'error');
    } finally {
      setOcupado(false);
    }
  };

  return (
    <Box sx={{ mx: 2.5, mb: 2, p: 2, borderRadius: '12px', border: '1px solid rgba(143,0,255,0.15)', bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <NotificationsActiveOutlinedIcon sx={{ color: '#7F00FF' }} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: '#152C70', fontWeight: 600, fontSize: '0.95rem' }}>Notificaciones</Typography>
          <Typography sx={{ color: 'rgba(21,44,112,0.7)', fontSize: '0.8rem' }}>
            {soportado
              ? 'Aviso en este dispositivo cuando te asignan un bebé.'
              : MENSAJES['no-soportado']}
          </Typography>
        </Box>
        <Switch
          checked={activo}
          onChange={cambiar}
          disabled={!soportado || ocupado}
          inputProps={{ 'aria-label': 'Activar notificaciones en este dispositivo' }}
          color="secondary"
        />
      </Box>
      {activo && (
        <Button size="small" onClick={probar} disabled={ocupado} sx={{ mt: 1, textTransform: 'none', color: '#7F00FF' }}>
          Enviar notificación de prueba
        </Button>
      )}
    </Box>
  );
};

export default PushToggle;
