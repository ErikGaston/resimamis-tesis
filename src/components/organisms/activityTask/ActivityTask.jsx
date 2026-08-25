import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styled from '@emotion/styled';
import img from '../../../assets/tasks/asistencia-abrazo.png';
import CardBabyHug from '../../molecules/cardBabyHug/CardBabyHug';

const GRADIENT = 'linear-gradient(90deg, #7F00FF 0%, #E100FF 100%)';

const BTN_PRIMARY = {
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.95rem',
    minHeight: 48,
    borderRadius: '12px',
    background: GRADIENT,
    boxShadow: '0 4px 14px rgba(127,0,255,0.28)',
    color: '#fff',
    justifyContent: 'space-between',
    px: 2,
    '&:hover': { opacity: 0.88, boxShadow: '0 6px 18px rgba(127,0,255,0.38)' },
    '&.Mui-disabled': { opacity: 0.42, boxShadow: 'none', color: '#fff' },
};

const BTN_SECONDARY = {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    minHeight: 48,
    borderRadius: '12px',
    border: '1.5px solid rgba(127,0,255,0.28)',
    color: '#5C27A0',
    justifyContent: 'space-between',
    px: 2,
    '&:hover': { bgcolor: 'rgba(127,0,255,0.05)', borderColor: 'rgba(127,0,255,0.45)' },
    '&.Mui-disabled': { opacity: 0.42 },
};

const BTN_TEXT = {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.92rem',
    minHeight: 46,
    borderRadius: '12px',
    color: '#5C27A0',
    justifyContent: 'flex-start',
    px: 2,
    '&:hover': { bgcolor: 'rgba(92,39,160,0.07)' },
};

const ActivityTask = ({
    check,
    salidaRegistrada,
    submitAssistence,
    submitAssistanceSalida,
    listAssignmentVolunteer,
    editHug,
    submitStartHug,
    onShowAssistanceToday,
    onShowAssistanceHistoricas,
    onAssignmentDetail,
}) => {
    const existAssigned = listAssignmentVolunteer?.length > 0;

    // Una voluntaria abraza de a un bebé por vez: con uno en curso, el resto no puede arrancar.
    const hayAbrazoEnCurso = (listAssignmentVolunteer ?? []).some((a) => {
        const estado = a.estadoAsignacion
            ?? (!a.fechaHoraInicio ? 'Creada' : !a.fechaHoraFin ? 'Iniciado' : 'Finalizado');
        return estado === 'Iniciado';
    });

    return (
        <Box sx={{ px: 2.5, pt: 2, pb: 2 }}>

            {/* ── ASISTENCIA ── */}
            <SectionLabel>Asistencia</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    onClick={submitAssistence}
                    // El backend admite un solo ingreso por día: con la jornada
                    // cerrada, volver a habilitar entrada daría 400.
                    disabled={check || salidaRegistrada}
                    endIcon={
                        <CheckCircleIcon sx={{ color: check ? '#fff' : 'rgba(255,255,255,0.55)' }} />
                    }
                    sx={BTN_PRIMARY}
                >
                    Registrar entrada
                </Button>
                {typeof submitAssistanceSalida === 'function' && (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={submitAssistanceSalida}
                        disabled={!check}
                        endIcon={
                            <CheckCircleIcon
                                sx={{ color: salidaRegistrada ? '#2E7D32' : 'rgba(127,0,255,0.3)' }}
                            />
                        }
                        sx={BTN_SECONDARY}
                    >
                        Registrar salida
                    </Button>
                )}
                {salidaRegistrada && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5, pt: 0.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
                        <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(21,44,112,0.85)' }}>
                            Jornada de hoy registrada. Podés volver a marcar entrada mañana.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* ── ACTIVIDAD ── */}
            {(typeof onShowAssistanceToday === 'function' ||
                typeof onShowAssistanceHistoricas === 'function') && (
                <>
                    <SectionLabel>Actividad</SectionLabel>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
                        {typeof onShowAssistanceToday === 'function' && (
                            <Button fullWidth variant="text" onClick={onShowAssistanceToday} sx={BTN_TEXT}>
                                Asistencias de hoy
                            </Button>
                        )}
                        {typeof onShowAssistanceHistoricas === 'function' && (
                            <Button fullWidth variant="text" onClick={onShowAssistanceHistoricas} sx={BTN_TEXT}>
                                Mi histórico de asistencias
                            </Button>
                        )}
                    </Box>
                </>
            )}

            {/* ── ABRAZOS DEL DÍA ── */}
            <SectionLabel>Abrazos del día</SectionLabel>
            {check ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
                    {listAssignmentVolunteer?.map((item) => (
                        <CardBabyHug
                            key={item.idAsignacion ?? item.id}
                            item={item}
                            editHug={editHug}
                            submitStartHug={submitStartHug}
                            onAssignmentDetail={onAssignmentDetail}
                            hayAbrazoEnCurso={hayAbrazoEnCurso}
                        />
                    ))}
                    {!existAssigned && (
                        <TextImage>No hay asignaciones para el día de hoy.</TextImage>
                    )}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt: 1 }}>
                    <StyledImage src={img} alt="Asistencia y abrazo" />
                    <TextImage>
                        Marcá tu asistencia para que la coordinadora pueda asignarte tareas.
                    </TextImage>
                </Box>
            )}
        </Box>
    );
};

export default ActivityTask;

const SectionLabel = styled(Typography)`
    color: rgba(21, 44, 112, 0.72);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 10px;
`;

const StyledImage = styled('img')`
    width: 144px;
    height: 100px;
    flex-shrink: 0;
    margin-top: 8px;
`;

const TextImage = styled('span')`
    color: rgba(21, 44, 112, 0.7);
    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
    letter-spacing: 0.7px;
    margin-top: 16px;
    max-width: 280px;
`;
