import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Alert, Box, Button, Chip, CircularProgress, IconButton, Paper, TextField, Typography } from '@mui/material';
import Footer from '../../components/molecules/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { clearAsistente, getAsistenteEstado, postAsistentePregunta } from '../../redux/actions/asistenteActions';
import { isCoordinadoraSession } from '../../utils/coordinadoraRole';
import AsistenteTexto from '../../components/molecules/asistenteTexto/AsistenteTexto';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

/** Texto que manda cada botón: el back lo reconoce como confirmación o como negativa. */
const TEXTO_CONFIRMAR = 'Sí, confirmo.';
const TEXTO_CANCELAR = 'No, cancelá.';

const NAVY = '#152C70';
const VIOLET = '#8F00FF';
const MAX_PREGUNTA = 2000;
/** El backend acepta hasta 20 mensajes de historial. */
const MAX_HISTORIAL = 20;

export const AsistentePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isCoord = isCoordinadoraSession();
    const data = useSelector((state) => state.asistenteReducer);

    const [pregunta, setPregunta] = useState('');
    const [mensajes, setMensajes] = useState([]);
    /** Preguntas usadas hoy y tope diario; null hasta saberlo. */
    const [uso, setUso] = useState(null);
    const [limiteAlcanzado, setLimiteAlcanzado] = useState(false);
    const finRef = useRef(null);
    const esperandoRef = useRef(false);

    useEffect(() => {
        if (!isCoord) return;
        dispatch(getAsistenteEstado());
        return () => dispatch(clearAsistente());
    }, [dispatch, isCoord]);

    // La respuesta llega por el store; se agrega al hilo una sola vez.
    useEffect(() => {
        if (!esperandoRef.current || !data?.ultimaRespuesta) return;
        esperandoRef.current = false;
        const payload = data.ultimaRespuesta.data ?? data.ultimaRespuesta;
        setMensajes((prev) => [...prev, {
            rol: 'assistant',
            contenido: payload.respuesta ?? '',
            herramientas: payload.herramientasUsadas ?? [],
            accionPendiente: payload.accionPendiente ?? null,
        }]);
        if (payload.limiteDiario != null) {
            setUso({ hoy: payload.preguntasHoy ?? 0, limite: payload.limiteDiario });
            if (payload.limiteDiario > 0 && (payload.preguntasHoy ?? 0) >= payload.limiteDiario) setLimiteAlcanzado(true);
        }
    }, [data?.ultimaRespuesta]);

    useEffect(() => {
        if (!data?.error) return;
        esperandoRef.current = false;
        // 429: ya hizo todas las preguntas del día.
        if (data.error?.status === 429) setLimiteAlcanzado(true);
    }, [data?.error]);

    useEffect(() => {
        const e = data?.estado?.data;
        if (e?.limiteDiario != null) {
            setUso({ hoy: e.preguntasHoy ?? 0, limite: e.limiteDiario });
            if (e.limiteDiario > 0 && (e.preguntasHoy ?? 0) >= e.limiteDiario) setLimiteAlcanzado(true);
        }
    }, [data?.estado]);

    useEffect(() => {
        finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [mensajes, data?.consultando]);

    // El reducer guarda el body del envelope ({ data }), así que el payload va
    // un nivel más adentro.
    const estado = data?.estado?.data;
    const habilitado = estado?.habilitado === true;
    const sugerencias = estado?.quePuedeConsultar ?? [];

    const bloqueado = !habilitado || limiteAlcanzado;

    const enviar = (texto, { accionConfirmada } = {}) => {
        const t = (texto ?? pregunta).trim();
        if (!t || data?.consultando || bloqueado) return;

        const historial = mensajes
            .slice(-MAX_HISTORIAL)
            .map((m) => ({ rol: m.rol, contenido: m.contenido }));

        // Una vez respondida, la acción pendiente ya no se puede confirmar de nuevo.
        setMensajes((prev) => [...prev.map((m) => (m.accionPendiente ? { ...m, accionPendiente: null } : m)), { rol: 'user', contenido: t }]);
        setPregunta('');
        esperandoRef.current = true;
        dispatch(postAsistentePregunta({ pregunta: t, historial, ...(accionConfirmada ? { accionConfirmada } : {}) }));
    };

    if (!isCoord) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>El asistente es solo para coordinadoras.</Alert>
                <Button variant="contained" onClick={() => navigate('/overview')} sx={{ textTransform: 'none', minHeight: 44 }}>
                    Volver al inicio
                </Button>
            </Box>
        );
    }

    return (
        // El compositor va anclado abajo, así que la página se acota a la
        // altura visible y reserva el alto del footer fijo.
        <Box sx={{
            display: 'flex', flexDirection: 'column', width: '100%',
            height: 'var(--app-vh, 100dvh)', overflow: 'hidden',
            // border-box: sin esto el padding se suma al alto y el compositor
            // se va abajo del footer.
            boxSizing: 'border-box',
            pb: 'calc(3.75rem + env(safe-area-inset-bottom, 0px))',
        }}>
            <PageHeader title="Asistente" />

            <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2, pb: 1, minHeight: 0 }}>
                {data?.estado && !habilitado && (
                    <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        El asistente no está disponible en este momento.
                    </Alert>
                )}

                {mensajes.length === 0 && (
                    <Box sx={{ textAlign: 'center', pt: 3 }}>
                        <SmartToyOutlinedIcon sx={{ fontSize: 52, color: 'rgba(143,0,255,0.35)' }} />
                        <Typography sx={{ fontWeight: 700, color: NAVY, mt: 1, fontSize: '1rem' }}>
                            Preguntá sobre el programa
                        </Typography>
                        <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.875rem', mt: 0.5, px: 1 }}>
                            Consulta los datos del día en tiempo real. Solo genera asignaciones o manda avisos si vos lo confirmás.
                        </Typography>

                        {sugerencias.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center', mt: 2 }}>
                                {sugerencias.slice(0, 6).map((s) => (
                                    <Chip
                                        key={s}
                                        label={s}
                                        onClick={() => enviar(s)}
                                        sx={{
                                            bgcolor: 'rgba(143,0,255,0.07)',
                                            color: '#5F1FA8',
                                            fontWeight: 600,
                                            fontSize: '0.8125rem',
                                            height: 34,
                                            '&:hover': { bgcolor: 'rgba(143,0,255,0.14)' },
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                )}

                {mensajes.map((m, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: m.rol === 'user' ? 'flex-end' : 'flex-start', mb: 1.25 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                maxWidth: '85%',
                                px: 1.75,
                                py: 1.25,
                                borderRadius: m.rol === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                bgcolor: m.rol === 'user' ? VIOLET : '#faf8fc',
                                border: m.rol === 'user' ? 'none' : '1px solid rgba(143,0,255,0.12)',
                            }}
                        >
                            {m.rol === 'user' ? (
                                <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.55, color: '#fff', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                                    {m.contenido}
                                </Typography>
                            ) : (
                                <AsistenteTexto texto={m.contenido} />
                            )}
                            {m.accionPendiente && (
                                <Box sx={{ display: 'flex', gap: 1, mt: 1.25 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<CheckIcon />}
                                        disabled={data?.consultando || bloqueado}
                                        onClick={() => enviar(TEXTO_CONFIRMAR, { accionConfirmada: m.accionPendiente })}
                                        sx={{ textTransform: 'none', fontWeight: 700, bgcolor: VIOLET, borderRadius: '10px', '&:hover': { bgcolor: '#7A00D6' } }}
                                    >
                                        Confirmar
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<CloseIcon />}
                                        disabled={data?.consultando || bloqueado}
                                        onClick={() => enviar(TEXTO_CANCELAR)}
                                        sx={{ textTransform: 'none', fontWeight: 600, color: NAVY, borderColor: 'rgba(21,44,112,0.3)', borderRadius: '10px' }}
                                    >
                                        Cancelar
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                ))}

                {data?.consultando && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                        <CircularProgress size={16} sx={{ color: VIOLET }} />
                        <Typography sx={{ fontSize: '0.875rem', color: 'rgba(21,44,112,0.75)' }}>
                            Consultando los datos…
                        </Typography>
                    </Box>
                )}
                <div ref={finRef} />
            </Box>

            {(limiteAlcanzado || (uso && uso.limite > 0)) && (
                <Typography sx={{ px: 2, pt: 0.75, fontSize: '0.75rem', textAlign: 'right', color: limiteAlcanzado ? '#C23814' : 'rgba(21,44,112,0.6)', bgcolor: '#fff' }}>
                    {limiteAlcanzado
                        ? 'Llegaste al límite de preguntas de hoy. Mañana podés seguir.'
                        : `${uso.hoy} de ${uso.limite} preguntas hoy`}
                </Typography>
            )}

            <Box sx={{ px: 2, pt: 1, pb: 1.5, display: 'flex', gap: 1, alignItems: 'flex-end', bgcolor: '#fff', borderTop: '1px solid rgba(21,44,112,0.08)' }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    size="small"
                    placeholder="Escribí tu pregunta…"
                    value={pregunta}
                    disabled={bloqueado || data?.consultando}
                    onChange={(e) => setPregunta(e.target.value.slice(0, MAX_PREGUNTA))}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
                <IconButton
                    onClick={() => enviar()}
                    disabled={bloqueado || data?.consultando || !pregunta.trim()}
                    aria-label="Enviar pregunta"
                    sx={{
                        width: 48, height: 48, flexShrink: 0,
                        bgcolor: VIOLET, color: '#fff',
                        '&:hover': { bgcolor: '#7A00D6' },
                        '&.Mui-disabled': { bgcolor: 'rgba(143,0,255,0.25)', color: '#fff' },
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>

            <Footer />
        </Box>
    );
};

export default AsistentePage;
