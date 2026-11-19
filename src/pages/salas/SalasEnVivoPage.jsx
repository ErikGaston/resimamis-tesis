import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Typography,
} from '@mui/material';
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, pointerWithin, useDraggable, useDroppable, useSensor, useSensors,
} from '@dnd-kit/core';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PageHeader } from '../../components/common/PageHeader';
import PageScrollMain from '../../components/common/PageScrollMain';
import Footer from '../../components/molecules/Footer';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';
import { showToast } from '../../redux/actions/toastActions';
import { resolveApiErrorMessage } from '../../utils/apiErrorMessage';
import { asignarVoluntariaABebe, cargarSalasEnVivo, moverBebeDeSala } from '../../services/salasEnVivo';

const NAVY = '#152C70';
const PURPLE = '#7F00FF';
const SIN_SALA = 'sin-sala';
const REFRESCO_MS = 30000;

const ESTADO_UI = {
  libre: { label: 'Sin abrazar', bg: 'rgba(237,108,2,0.12)', color: '#B35400' },
  asignado: { label: 'Asignado', bg: 'rgba(127,0,255,0.12)', color: PURPLE },
  abrazando: { label: 'Abrazando', bg: 'rgba(46,125,50,0.14)', color: '#2E7D32' },
};

const capital = (s) => String(s ?? '').replace(/(^|\s)(\p{L})/gu, (m, esp, letra) => esp + letra.toUpperCase());
const nombreCompleto = (o) => capital([o?.nombre, o?.apellido].filter(Boolean).join(' ').trim()) || 'Sin nombre';
const nombreCorto = (o) => {
  const ap = (o?.apellido ?? '').trim();
  return [o?.nombre, ap ? `${ap[0]}.` : ''].filter(Boolean).join(' ').trim() || 'Sin nombre';
};

/**
 * Destino = lo que está justo debajo del puntero, y solo entre los destinos válidos para lo que se
 * arrastra (voluntaria → bebé sin asignar, bebé → sala). Con la detección por defecto, soltar sobre
 * un bebé ya asignado terminaba asignando al bebé de al lado.
 */
const destinoBajoPuntero = (args) => {
  const tipo = args.active?.data?.current?.tipo;
  const prefijo = tipo === 'vol' ? 'bebe-' : tipo === 'mov' ? 'sala-' : null;
  if (!prefijo) return [];
  return pointerWithin({
    ...args,
    droppableContainers: args.droppableContainers.filter((c) => String(c.id).startsWith(prefijo)),
  });
};

const nombreDe = (d) => (d?.tipo === 'vol' ? nombreCompleto(d.voluntaria) : d?.bebe ? nombreCompleto(d.bebe) : d?.sala?.nombre ?? '');

/** Avisos para lectores de pantalla (la librería los trae en inglés). */
const ACCESIBILIDAD = {
  screenReaderInstructions: {
    draggable: 'Para arrastrar, presioná espacio o enter. Movete con las flechas y soltá con espacio o enter. Escape cancela.',
  },
  announcements: {
    onDragStart: ({ active }) => `Arrastrando ${nombreDe(active.data.current)}.`,
    onDragOver: ({ active, over }) => (over ? `${nombreDe(active.data.current)} está sobre ${nombreDe(over.data.current)}.` : `${nombreDe(active.data.current)} no está sobre un destino.`),
    onDragEnd: ({ active, over }) => (over ? `${nombreDe(active.data.current)} soltado sobre ${nombreDe(over.data.current)}.` : `${nombreDe(active.data.current)} soltado.`),
    onDragCancel: ({ active }) => `Se canceló el arrastre de ${nombreDe(active.data.current)}.`,
  },
};

/** Asignación de hoy que todavía no terminó (creada o en curso). */
const estaAbierta = (a) => !a?.fechaHoraFin && a?.estadoAsignacion !== 'Finalizado' && a?.idBebe != null;

/** Chip de voluntaria libre que se arrastra. */
const VoluntariaArrastrable = ({ voluntaria }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `vol-${voluntaria.idVoluntaria}`, data: { tipo: 'vol', voluntaria } });
  return (
    <Chip
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      icon={<DragIndicatorIcon sx={{ fontSize: 18 }} />}
      label={nombreCorto(voluntaria)}
      aria-label={`Arrastrar a ${nombreCompleto(voluntaria)} hacia un bebé`}
      sx={{
        touchAction: 'none', cursor: 'grab', bgcolor: '#fff', border: '1px solid rgba(127,0,255,0.35)',
        color: NAVY, fontWeight: 600, opacity: isDragging ? 0.35 : 1, height: 36,
      }}
    />
  );
};

/** Tarjeta de bebé: recibe voluntarias y se puede arrastrar (por la manija) a otra sala. */
const TarjetaBebe = ({ bebe, asignacion, arrastrandoVoluntaria }) => {
  const estado = asignacion ? (asignacion.fechaHoraInicio ? 'abrazando' : 'asignado') : 'libre';
  const recibe = estado === 'libre';
  const drop = useDroppable({ id: `bebe-${bebe.id}`, data: { tipo: 'bebe', bebe }, disabled: !recibe });
  const drag = useDraggable({ id: `mov-${bebe.id}`, data: { tipo: 'mov', bebe } });
  const ui = ESTADO_UI[estado];
  const resaltar = arrastrandoVoluntaria && recibe;

  return (
    <Box
      ref={drop.setNodeRef}
      sx={{
        p: 1.25, mb: 1, borderRadius: '12px', bgcolor: drop.isOver ? 'rgba(127,0,255,0.08)' : '#fff',
        border: drop.isOver ? `2px dashed ${PURPLE}` : resaltar ? '1px dashed rgba(127,0,255,0.5)' : '1px solid rgba(21,44,112,0.1)',
        opacity: drag.isDragging ? 0.4 : 1, transition: 'background-color 120ms, border-color 120ms',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          ref={drag.setNodeRef}
          {...drag.attributes}
          {...drag.listeners}
          size="small"
          aria-label={`Mover a ${nombreCompleto(bebe)} a otra sala`}
          sx={{ touchAction: 'none', cursor: 'grab', color: 'rgba(21,44,112,0.45)', p: 0.5 }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
        <ChildCareIcon sx={{ fontSize: 20, color: PURPLE }} />
        <Typography sx={{ flex: 1, minWidth: 0, fontWeight: 600, color: NAVY, fontSize: '0.92rem', textTransform: 'capitalize' }} noWrap>
          {nombreCompleto(bebe)}
        </Typography>
        <Chip size="small" label={ui.label} sx={{ bgcolor: ui.bg, color: ui.color, fontWeight: 700, height: 22, fontSize: '0.7rem' }} />
      </Box>
      {asignacion && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75, ml: 4.5 }}>
          <PersonOutlineIcon sx={{ fontSize: 16, color: ui.color }} />
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(21,44,112,0.8)' }}>{asignacion.nombreVoluntaria}</Typography>
        </Box>
      )}
      {!asignacion && resaltar && (
        <Typography sx={{ fontSize: '0.75rem', color: PURPLE, mt: 0.5, ml: 4.5 }}>Soltá acá para asignar</Typography>
      )}
    </Box>
  );
};

/** Sección de una sala: recibe bebés arrastrados desde otra sala. */
const SeccionSala = ({ sala, bebes, asignacionPorBebe, arrastrando }) => {
  const id = sala ? `sala-${sala.idSala}` : `sala-${SIN_SALA}`;
  const { setNodeRef, isOver } = useDroppable({ id, data: { tipo: 'sala', sala }, disabled: !sala });
  const recibeBebe = arrastrando === 'mov' && Boolean(sala);
  return (
    <Box
      ref={setNodeRef}
      sx={{
        mb: 2, p: 1.5, borderRadius: '16px',
        bgcolor: isOver ? 'rgba(127,0,255,0.08)' : 'rgba(143,0,255,0.04)',
        border: isOver ? `2px dashed ${PURPLE}` : recibeBebe ? '1px dashed rgba(127,0,255,0.45)' : '1px solid rgba(143,0,255,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <MeetingRoomOutlinedIcon sx={{ color: PURPLE, fontSize: 20 }} />
        <Typography sx={{ fontWeight: 700, color: NAVY }}>{sala ? sala.nombre : 'Sin sala'}</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(21,44,112,0.6)' }}>
          {bebes.length} {bebes.length === 1 ? 'bebé' : 'bebés'}
        </Typography>
      </Box>
      {bebes.length === 0 ? (
        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(21,44,112,0.55)', py: 1 }}>
          {recibeBebe ? 'Soltá acá para mover el bebé a esta sala' : 'No hay bebés en esta sala'}
        </Typography>
      ) : bebes.map((b) => (
        <TarjetaBebe key={b.id} bebe={b} asignacion={asignacionPorBebe.get(b.id)} arrastrandoVoluntaria={arrastrando === 'vol'} />
      ))}
    </Box>
  );
};

const SalasEnVivoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCoord = isCoordinadoraSession();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [arrastre, setArrastre] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [confirmarMovida, setConfirmarMovida] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // En pantallas táctiles hay que mantener apretado un instante: así el dedo sigue pudiendo scrollear.
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
  );

  const cargar = useCallback(async () => {
    try {
      setDatos(await cargarSalasEnVivo());
      setError('');
    } catch (err) {
      setError(resolveApiErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    if (!isCoord) return undefined;
    cargar();
    const t = setInterval(() => { if (!document.hidden) cargar(); }, REFRESCO_MS);
    return () => clearInterval(t);
  }, [cargar, isCoord]);

  const vista = useMemo(() => {
    if (!datos) return null;
    const abiertas = datos.asignaciones.filter(estaAbierta);
    const asignacionPorBebe = new Map(abiertas.map((a) => [a.idBebe, a]));
    const ocupadas = new Set(abiertas.map((a) => a.idVoluntaria));
    const libres = datos.presentes
      .filter((v) => !ocupadas.has(v.idVoluntaria))
      .sort((a, b) => nombreCompleto(a).localeCompare(nombreCompleto(b)));
    const salasActivas = datos.salas.filter((s) => s.activa !== false);
    const idsSala = new Set(salasActivas.map((s) => s.idSala));
    const porSala = salasActivas.map((s) => ({ sala: s, bebes: datos.bebes.filter((b) => b.idSala === s.idSala) }));
    const sinSala = datos.bebes.filter((b) => !idsSala.has(b.idSala));
    return { asignacionPorBebe, libres, porSala, sinSala, totalPresentes: datos.presentes.length };
  }, [datos]);

  const toast = (message, severity) => dispatch(showToast({ message, severity }));

  const asignar = async (voluntaria, bebe) => {
    setOcupado(true);
    try {
      await asignarVoluntariaABebe(voluntaria.idVoluntaria, bebe.id);
      toast(`${nombreCompleto(voluntaria)} quedó asignada a ${nombreCompleto(bebe)}. Le avisamos.`, 'success');
    } catch (err) {
      toast(resolveApiErrorMessage(err), 'error');
    } finally {
      await cargar();
      setOcupado(false);
    }
  };

  const mover = async () => {
    const { bebe, sala } = confirmarMovida;
    setConfirmarMovida(null);
    setOcupado(true);
    try {
      await moverBebeDeSala(bebe.id, sala.idSala);
      toast(`${nombreCompleto(bebe)} pasó a ${sala.nombre}.`, 'success');
    } catch (err) {
      toast(resolveApiErrorMessage(err), 'error');
    } finally {
      await cargar();
      setOcupado(false);
    }
  };

  const alSoltar = ({ active, over }) => {
    setArrastre(null);
    if (!over || ocupado) return;
    const origen = active.data.current;
    const destino = over.data.current;
    if (origen?.tipo === 'vol' && destino?.tipo === 'bebe') {
      asignar(origen.voluntaria, destino.bebe);
    } else if (origen?.tipo === 'mov' && destino?.tipo === 'sala' && destino.sala && destino.sala.idSala !== origen.bebe.idSala) {
      setConfirmarMovida({ bebe: origen.bebe, sala: destino.sala });
    }
  };

  if (!isCoord) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>Esta sección es solo para coordinadoras.</Alert>
        <Button variant="contained" onClick={() => navigate('/overview')} sx={{ textTransform: 'none', minHeight: 44 }}>
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', maxHeight: '100dvh', minHeight: 0, overflow: 'hidden' }}>
      <PageHeader
        title="Salas en vivo"
        rightAction={(
          <IconButton onClick={cargar} aria-label="Actualizar" sx={{ color: '#fff' }} disabled={ocupado}>
            <RefreshIcon />
          </IconButton>
        )}
      />
      <PageScrollMain>
        <DndContext
          sensors={sensors}
          collisionDetection={destinoBajoPuntero}
          accessibility={ACCESIBILIDAD}
          onDragStart={({ active }) => setArrastre(active.data.current)}
          onDragCancel={() => setArrastre(null)}
          onDragEnd={alSoltar}
        >
          <Box sx={{ px: 2, pt: 2, pb: 4, position: 'relative' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!vista ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: PURPLE }} /></Box>
            ) : (
              <>
                <Box sx={{ position: 'sticky', top: 0, zIndex: 2, mb: 2, p: 1.5, borderRadius: '16px', bgcolor: '#F6F0FF', border: '1px solid rgba(127,0,255,0.15)' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: NAVY, mb: 1 }}>
                    Voluntarias libres · {vista.libres.length} de {vista.totalPresentes} presentes
                  </Typography>
                  {vista.libres.length ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {vista.libres.map((v) => <VoluntariaArrastrable key={v.idVoluntaria} voluntaria={v} />)}
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(21,44,112,0.65)' }}>
                      {vista.totalPresentes ? 'Todas las presentes ya tienen un bebé asignado.' : 'Todavía no fichó ninguna voluntaria hoy.'}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: '0.72rem', color: 'rgba(21,44,112,0.6)', mt: 1 }}>
                    Arrastrá una voluntaria sobre un bebé sin abrazar para asignarlo. Con la manija de cada bebé lo movés de sala.
                  </Typography>
                </Box>

                {vista.porSala.map(({ sala, bebes }) => (
                  <SeccionSala key={sala.idSala} sala={sala} bebes={bebes} asignacionPorBebe={vista.asignacionPorBebe} arrastrando={arrastre?.tipo} />
                ))}
                {vista.sinSala.length > 0 && (
                  <SeccionSala sala={null} bebes={vista.sinSala} asignacionPorBebe={vista.asignacionPorBebe} arrastrando={arrastre?.tipo} />
                )}
              </>
            )}
            {ocupado && (
              <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: 10 }}>
                <CircularProgress sx={{ color: PURPLE }} />
              </Box>
            )}
          </Box>
          <DragOverlay>
            {arrastre?.tipo === 'vol' && (
              <Chip label={nombreCorto(arrastre.voluntaria)} icon={<PersonOutlineIcon />} sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 700, height: 36, '& .MuiChip-icon': { color: '#fff' } }} />
            )}
            {arrastre?.tipo === 'mov' && (
              <Chip label={nombreCompleto(arrastre.bebe)} icon={<ChildCareIcon />} sx={{ bgcolor: '#fff', color: NAVY, fontWeight: 700, height: 36, border: `2px solid ${PURPLE}`, textTransform: 'capitalize' }} />
            )}
          </DragOverlay>
        </DndContext>
      </PageScrollMain>
      <Footer />

      <Dialog open={Boolean(confirmarMovida)} onClose={() => setConfirmarMovida(null)}>
        <DialogTitle sx={{ color: NAVY, fontWeight: 700 }}>Mover de sala</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: NAVY, textTransform: 'none' }}>
            ¿Pasar a <b style={{ textTransform: 'capitalize' }}>{confirmarMovida && nombreCompleto(confirmarMovida.bebe)}</b> a <b>{confirmarMovida?.sala?.nombre}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmarMovida(null)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={mover} sx={{ textTransform: 'none', bgcolor: PURPLE }}>Mover</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalasEnVivoPage;
