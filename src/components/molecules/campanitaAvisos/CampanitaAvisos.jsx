import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, Button, CircularProgress, IconButton, Popover, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AxiosInstance from '../../../redux/interceptor/interceptor';
import { isCoordinadoraSession } from '../../../utils/coordinadoraRole';
import { getIdVolunteer } from '../../../utils/localStorage';
import { activarPush, desactivarPush, soportaPush, suscripcionActual } from '../../../utils/push';

const NAVY = '#152C70';
const VIOLET = '#7F00FF';
const CADA_MS = 2 * 60 * 1000;

const balanceo = keyframes`
  0%, 100% { transform: rotate(0); }
  15% { transform: rotate(14deg); }
  30% { transform: rotate(-12deg); }
  45% { transform: rotate(8deg); }
  60% { transform: rotate(-5deg); }
  75% { transform: rotate(2deg); }
`;

const TONOS = {
  error: { color: '#C62828', fondo: 'rgba(198,40,40,0.09)' },
  warning: { color: '#B26A00', fondo: 'rgba(237,108,2,0.11)' },
  info: { color: VIOLET, fondo: 'rgba(127,0,255,0.09)' },
};

const datos = (r) => r?.data?.data ?? r?.data ?? null;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

/** Avisos del momento según el rol. Cada pedido que falla se ignora: la campanita nunca rompe la pantalla. */
async function buscarAvisos(esCoord) {
  const avisos = [];
  if (esCoord) {
    const [stock, hoy, cobertura] = await Promise.allSettled([
      AxiosInstance.get('/insumo/bajoStockMinimo'),
      AxiosInstance.get('/dashboard/coordinacion/hoy'),
      AxiosInstance.get('/dashboard/coordinacion/cobertura-hoy'),
    ]);
    const bajos = stock.status === 'fulfilled' ? datos(stock.value) ?? [] : [];
    if (Array.isArray(bajos) && bajos.length > 0) {
      avisos.push({
        id: 'stock', tono: 'warning', icono: Inventory2OutlinedIcon, ruta: '/insumos',
        titulo: plural(bajos.length, 'insumo bajo el mínimo', 'insumos bajo el mínimo'),
        detalle: bajos.slice(0, 3).map((i) => `${i.nombre}: ${i.stockActual}`).join(' · '),
      });
    }
    const h = hoy.status === 'fulfilled' ? datos(hoy.value) : null;
    if (h?.abrazosColgados > 0) {
      avisos.push({
        id: 'colgados', tono: 'error', icono: HourglassBottomRoundedIcon, ruta: '/coordinacion',
        titulo: plural(h.abrazosColgados, 'abrazo sin finalizar', 'abrazos sin finalizar'),
        detalle: 'Quedaron abiertos de días anteriores. Cerralos desde Coordinación.',
      });
    }
    if (h?.abrazosHoy?.enCurso > 0) {
      avisos.push({
        id: 'encurso', tono: 'info', icono: FavoriteRoundedIcon, ruta: '/panel',
        titulo: plural(h.abrazosHoy.enCurso, 'abrazo en curso ahora', 'abrazos en curso ahora'),
        detalle: 'Mirá el detalle en el Panel del día.',
      });
    }
    const c = cobertura.status === 'fulfilled' ? datos(cobertura.value) : null;
    const sinAbrazo = c?.bebesSinAbrazoHoy?.length ?? 0;
    if (sinAbrazo > 0) {
      avisos.push({
        id: 'sinabrazo', tono: 'info', icono: ChildCareRoundedIcon, ruta: '/panel',
        titulo: plural(sinAbrazo, 'bebé sin abrazo hoy', 'bebés sin abrazo hoy'),
        detalle: c.bebesSinAbrazoHoy.slice(0, 3).map((b) => `${b.nombre} ${b.apellido ?? ''}`.trim()).join(' · '),
      });
    }
  } else {
    const id = getIdVolunteer();
    if (id) {
      try {
        const lista = datos(await AxiosInstance.get(`/asignacion/listarAsignacionesHoyVoluntaria/${id}`)) ?? [];
        (Array.isArray(lista) ? lista : [])
          .filter((a) => a.nombreBebe && !a.fechaHoraFin)
          .forEach((a) => avisos.push({
            id: `asig-${a.idAsignacion}`,
            tono: a.fechaHoraInicio ? 'info' : 'warning',
            icono: a.fechaHoraInicio ? FavoriteRoundedIcon : ChildCareRoundedIcon,
            ruta: '/tareas',
            titulo: a.fechaHoraInicio ? `Abrazo en curso con ${a.nombreBebe}` : `Te asignaron a ${a.nombreBebe}`,
            detalle: a.nombreSala ? `Sala ${a.nombreSala}` : 'Abrilo desde Tareas.',
          }));
      } catch { /* sin avisos */ }
    }
  }
  return avisos;
}

// Compartido entre pantallas: cada cabecera monta su campanita y no tiene que volver a pedir todo.
// La clave es la sesión: si entra otra persona sin recargar, no ve los avisos de la anterior.
let memoria = { t: 0, avisos: null, sesion: null };
const sesionActual = () => localStorage.getItem('token');
const recordados = () => (memoria.sesion === sesionActual() ? memoria.avisos : null);

/**
 * Campanita de avisos que acompaña la cabecera de todas las pantallas.
 * Muestra el globito con la cantidad de avisos y, al tocarla, el detalle con acceso directo
 * y el botón para activar las notificaciones push en este dispositivo.
 */
const CampanitaAvisos = ({ color = '#fff' }) => {
  const navigate = useNavigate();
  const esCoord = isCoordinadoraSession();
  const [ancla, setAncla] = useState(null);
  const [avisos, setAvisos] = useState(recordados);
  const [cargando, setCargando] = useState(false);
  const [push, setPush] = useState(soportaPush() ? 'cargando' : 'no-soportado');
  const [mensajePush, setMensajePush] = useState('');

  // Evita setState tras desmontar: la campanita monta en cada cabecera y sus
  // pedidos async pueden resolver después de navegar a otra pantalla.
  const montado = useRef(true);
  useEffect(() => () => { montado.current = false; }, []);

  const refrescar = useCallback(async (forzar = false) => {
    if (!forzar && recordados() && Date.now() - memoria.t < CADA_MS) {
      setAvisos(memoria.avisos);
      return;
    }
    setCargando(true);
    try {
      const nuevos = await buscarAvisos(esCoord);
      memoria = { t: Date.now(), avisos: nuevos, sesion: sesionActual() };
      if (montado.current) setAvisos(nuevos);
    } finally {
      if (montado.current) setCargando(false);
    }
  }, [esCoord]);

  useEffect(() => {
    refrescar();
    const id = setInterval(() => refrescar(true), CADA_MS);
    return () => clearInterval(id);
  }, [refrescar]);

  useEffect(() => {
    if (!soportaPush()) return;
    suscripcionActual()
      .then((s) => { if (montado.current) setPush(s && Notification.permission === 'granted' ? 'activo' : 'inactivo'); })
      .catch(() => { if (montado.current) setPush('inactivo'); });
  }, []);

  const abrir = (e) => {
    setAncla(e.currentTarget);
    refrescar(true);
  };

  const ir = (ruta) => {
    setAncla(null);
    navigate(ruta);
  };

  const activar = async () => {
    setMensajePush('');
    try {
      const r = await activarPush();
      if (r === 'ok') setPush('activo');
      else setMensajePush(r === 'denegado'
        ? 'El navegador bloqueó las notificaciones. Habilitalas desde la configuración del sitio.'
        : 'Este dispositivo no permite notificaciones todavía.');
    } catch {
      setMensajePush('No se pudo activar. Probá de nuevo en un rato.');
    }
  };

  const desactivar = async () => {
    setMensajePush('');
    try {
      await desactivarPush();
      setPush('inactivo');
    } catch {
      setMensajePush('No se pudo desactivar. Probá de nuevo en un rato.');
    }
  };

  const cantidad = avisos?.length ?? 0;
  const urgentes = avisos?.filter((a) => a.tono !== 'info').length ?? 0;
  const Icono = cantidad > 0 ? NotificationsActiveRoundedIcon : NotificationsNoneRoundedIcon;

  return (
    <>
      <IconButton
        onClick={abrir}
        aria-label={cantidad > 0 ? `Avisos: ${cantidad}` : 'Avisos'}
        sx={{ color, width: 44, height: 44, '&:hover': { backgroundColor: 'rgba(255,255,255,0.14)' } }}
      >
        <Badge
          badgeContent={cantidad}
          max={9}
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: urgentes > 0 ? '#FF3D71' : '#FFB020',
              color: '#fff', fontWeight: 700, fontSize: 11, minWidth: 18, height: 18,
              border: '2px solid', borderColor: color === '#fff' ? '#8F00FF' : '#fff',
            },
          }}
        >
          <Icono sx={{ fontSize: 26, transformOrigin: '50% 8%', animation: urgentes > 0 ? `${balanceo} 1.4s ease-in-out 0.3s 2` : 'none' }} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(ancla)}
        anchorEl={ancla}
        onClose={() => setAncla(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 'min(340px, calc(100vw - 24px))', borderRadius: '18px', mt: 1, overflow: 'hidden', boxShadow: '0 12px 32px rgba(21,44,112,0.22)' } } }}
      >
        <Box sx={{ px: 2, py: 1.5, background: 'linear-gradient(90deg, #6a00cc 0%, #8F00FF 60%, #a54dff 100%)', color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsActiveRoundedIcon sx={{ fontSize: 22 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>Avisos</Typography>
          {cargando && <CircularProgress size={16} sx={{ color: '#fff' }} />}
        </Box>

        <Box sx={{ maxHeight: '55vh', overflowY: 'auto', p: 1 }}>
          {avisos === null && (
            <Typography sx={{ color: 'rgba(21,44,112,0.7)', fontSize: 14, textAlign: 'center', py: 3 }}>Buscando avisos…</Typography>
          )}
          {avisos?.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
              <CheckCircleRoundedIcon sx={{ fontSize: 40, color: '#2E7D32' }} />
              <Typography sx={{ color: NAVY, fontWeight: 600, mt: 0.5 }}>Todo en orden por ahora</Typography>
              <Typography sx={{ color: 'rgba(21,44,112,0.7)', fontSize: 13 }}>
                {esCoord ? 'No hay faltantes ni abrazos pendientes.' : 'Cuando te asignen un bebé lo vas a ver acá.'}
              </Typography>
            </Box>
          )}
          {avisos?.map((a) => {
            const t = TONOS[a.tono] ?? TONOS.info;
            const I = a.icono;
            return (
              <Box
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => ir(a.ruta)}
                onKeyDown={(e) => { if (e.key === 'Enter') ir(a.ruta); }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, borderRadius: '12px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(127,0,255,0.05)' } }}
              >
                <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: t.fondo, color: t.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <I sx={{ fontSize: 21 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ color: NAVY, fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{a.titulo}</Typography>
                  {a.detalle && (
                    <Typography sx={{ color: 'rgba(21,44,112,0.7)', fontSize: 12.5, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.detalle}
                    </Typography>
                  )}
                </Box>
                <ChevronRightRoundedIcon sx={{ color: 'rgba(21,44,112,0.35)' }} />
              </Box>
            );
          })}
        </Box>

        {push !== 'no-soportado' && push !== 'cargando' && (
          <Box sx={{ borderTop: '1px solid rgba(21,44,112,0.08)', px: 2, py: 1.5, bgcolor: '#faf8fc' }}>
            {push === 'activo' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#2E7D32', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.75, flex: 1 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 18 }} /> Notificaciones activadas
                </Typography>
                <Button size="small" onClick={desactivar} sx={{ textTransform: 'none', color: 'rgba(21,44,112,0.75)', fontWeight: 600, borderRadius: '10px' }}>
                  Desactivar
                </Button>
              </Box>
            ) : (
              <>
                <Typography sx={{ color: NAVY, fontSize: 13, mb: 1 }}>
                  Recibí un aviso en el celular aunque la app esté cerrada.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={activar}
                  startIcon={<NotificationsActiveRoundedIcon />}
                  sx={{ textTransform: 'none', borderRadius: '12px', bgcolor: VIOLET, fontWeight: 600, minHeight: 42, '&:hover': { bgcolor: '#6a00cc' } }}
                >
                  Activar notificaciones
                </Button>
                {mensajePush && <Typography sx={{ color: '#B26A00', fontSize: 12.5, mt: 1 }}>{mensajePush}</Typography>}
              </>
            )}
          </Box>
        )}
      </Popover>
    </>
  );
};

export default CampanitaAvisos;
