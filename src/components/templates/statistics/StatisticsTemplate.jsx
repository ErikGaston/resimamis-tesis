import React from 'react'
import AddchartIcon from '@mui/icons-material/Addchart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { PageHeader } from '../../common/PageHeader';
import { ChartHugMonth } from '../../organisms/statistics/ChartHugMonth';
import { ChartLocalitiesMother } from '../../organisms/statistics/ChartLocalitiesMother';
import { ChartSupplies } from '../../organisms/statistics/ChartSupplies';
import { ChartAssignmentMonth } from '../../organisms/statistics/ChartAssignmentMonth';

const CHART_OPTIONS = [
    { id: 1, label: 'Edades de las madres', icon: AddchartIcon },
    { id: 2, label: 'Localidades de las madres', icon: AddchartIcon },
    { id: 3, label: 'Insumos más utilizados', icon: AddchartIcon },
    { id: 4, label: 'Abrazos por mes', icon: AddchartIcon },
    { id: 5, label: 'Duración de abrazos', icon: AccessTimeIcon },
];

const StatisticsTemplate = (props) => {
    const {
        stateChart,
        setStateChart,
        generateChart,
        valueChart,
        statisticsMonthMother,
        statisticsLocalities,
        statisticsSupplies,
        statisticsAssignment,
        statisticsDurationHug,
    } = props;

    const durationRows = React.useMemo(() => {
        if (statisticsDurationHug == null) return null;
        const raw = statisticsDurationHug?.data ?? statisticsDurationHug;
        if (Array.isArray(raw)) return raw;
        const nested = raw?.listadoAbrazos ?? raw?.abrazos ?? raw?.duraciones;
        return Array.isArray(nested) ? nested : [];
    }, [statisticsDurationHug]);

    return (
        <div style={{ height: '100%' }}>
            <PageHeader title="Estadísticas" />
            <ContainerButtons>
                {CHART_OPTIONS.map(({ id, label, icon: Icon }) => (
                    <Button
                        key={id}
                        fullWidth
                        onClick={() => generateChart(id)}
                        sx={{
                            textTransform: 'none',
                            border: '1.5px solid rgba(143,0,255,0.25)',
                            borderRadius: '12px',
                            py: 1.5,
                            px: 2,
                            mb: 1.25,
                            justifyContent: 'flex-start',
                            gap: 1.5,
                            bgcolor: '#fff',
                            boxShadow: '0 2px 8px rgba(21,44,112,0.06)',
                            '&:hover': { bgcolor: 'rgba(143,0,255,0.04)', borderColor: '#8F00FF' },
                        }}
                    >
                        <Icon sx={{ color: '#8F00FF', fontSize: 22, flexShrink: 0 }} />
                        <Typography sx={{ color: '#152C70', fontSize: '0.95rem', fontWeight: 500, textAlign: 'left' }}>
                            {label}
                        </Typography>
                    </Button>
                ))}
            </ContainerButtons>

            <Dialog
                open={stateChart === 'OPEN'}
                onClose={() => setStateChart('')}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: '16px', m: 2 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#152C70', fontSize: '1rem' }}>
                        {CHART_OPTIONS.find((o) => o.id === valueChart)?.label ?? 'Estadística'}
                    </Typography>
                    <IconButton onClick={() => setStateChart('')} aria-label="Cerrar" size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ px: 2, pt: 0.5, pb: 3 }}>
                    {valueChart === 1 && <ChartHugMonth statisticsMonthMother={statisticsMonthMother} />}
                    {valueChart === 2 && <ChartLocalitiesMother statisticsLocalities={statisticsLocalities} />}
                    {valueChart === 3 && <ChartSupplies statisticsSupplies={statisticsSupplies} />}
                    {valueChart === 4 && <ChartAssignmentMonth statisticsAssignment={statisticsAssignment} />}
                    {valueChart === 5 && (
                        <Box sx={{ pt: 1 }}>
                            {durationRows === null ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress sx={{ color: '#8F00FF' }} />
                                </Box>
                            ) : durationRows.length === 0 ? (
                                <Typography sx={{ color: 'rgba(21,44,112,0.55)', textAlign: 'center', py: 3, fontSize: '0.9rem' }}>
                                    Sin datos de duración disponibles.
                                </Typography>
                            ) : (
                                durationRows.map((row, i) => {
                                    const mins = row.duracionMinutos ?? row.minutos ?? row.duracion;
                                    const id = row.idAsignacion ?? row.id ?? i + 1;
                                    return (
                                        <Box
                                            key={id}
                                            sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(21,44,112,0.07)' }}
                                        >
                                            <Typography sx={{ fontSize: '0.88rem', color: '#152C70', fontWeight: 500 }}>
                                                Abrazo #{id}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.88rem', color: '#7A659B', fontWeight: 600 }}>
                                                {mins != null ? `${Number(mins).toFixed(0)} min` : '—'}
                                            </Typography>
                                        </Box>
                                    );
                                })
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StatisticsTemplate;

const ContainerButtons = styled('div')`
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
`;
