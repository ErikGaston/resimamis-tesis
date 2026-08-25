import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddchartIcon from '@mui/icons-material/Addchart';
import CloseIcon from '@mui/icons-material/Close';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { PageHeader } from '../../common/PageHeader';
import { ChartHugMonth } from '../../organisms/statistics/ChartHugMonth';
import { ChartLocalitiesMother } from '../../organisms/statistics/ChartLocalitiesMother';
import { ChartSupplies } from '../../organisms/statistics/ChartSupplies';
import { ChartAssignmentMonth } from '../../organisms/statistics/ChartAssignmentMonth';
import { ChartWeightEvolution } from '../../organisms/statistics/ChartWeightEvolution';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { ChartBabyPermanence } from '../../organisms/statistics/ChartBabyPermanence';
import { ChartDistribucionBebes } from '../../organisms/statistics/ChartDistribucionBebes';
import { RankingVoluntarias } from '../../organisms/statistics/RankingVoluntarias';
import { ChartDuracionAbrazos } from '../../organisms/statistics/ChartDuracionAbrazos';
import { normalizeBebesPorEstado, normalizeBebesPorSala, normalizeBebesRangoEdades, totalDe } from '../../../utils/dashboardDistribuciones';
import { APP_SCROLL_BOTTOM_PADDING } from '../../../helpers/const/appLayout';

const CHART_OPTIONS = [
    { id: 1, label: 'Edades de las madres', icon: AddchartIcon },
    { id: 2, label: 'Localidades de las madres', icon: AddchartIcon },
    { id: 3, label: 'Insumos más utilizados', icon: AddchartIcon },
    { id: 4, label: 'Abrazos por mes', icon: AddchartIcon },
    { id: 5, label: 'Duración de abrazos', icon: AccessTimeIcon },
    { id: 6, label: 'Evolución de peso de los bebés', icon: MonitorWeightOutlinedIcon, soloCoordinadora: true },
    { id: 7, label: 'Permanencia de los bebés', icon: AccessTimeIcon, soloCoordinadora: true },
    { id: 8, label: 'Bebés por sala', icon: AddchartIcon, soloCoordinadora: true },
    { id: 9, label: 'Bebés por estado', icon: AddchartIcon, soloCoordinadora: true },
    { id: 10, label: 'Edad de los bebés', icon: AddchartIcon, soloCoordinadora: true },
    { id: 11, label: 'Ranking de voluntarias', icon: EmojiEventsOutlinedIcon, soloCoordinadora: true },
];

// Paper del dialog mobile: centrado en columna 444px
const DIALOG_PAPER_SX = {
    maxWidth: 444,
    width: '100%',
    mx: 'auto',
    borderRadius: '16px',
    m: 2,
};

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
        statisticsDuracion,
        statisticsWeightEvolution,
        statisticsPermanencia,
        statisticsPorSala,
        statisticsPorEstado,
        statisticsRangoEdades,
        statisticsRanking,
        isCoordinadora,
    } = props;

    const chartOptions = CHART_OPTIONS.filter((o) => !o.soloCoordinadora || isCoordinadora);


    return (
        <div style={{ height: '100%' }}>
            <PageHeader title="Estadísticas" />
            <ContainerButtons>
                {chartOptions.map(({ id, label, icon: Icon }) => (
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
                maxWidth={false}
                PaperProps={{ sx: DIALOG_PAPER_SX }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#152C70', fontSize: '1rem' }}>
                        {CHART_OPTIONS.find((o) => o.id === valueChart)?.label ?? 'Estadística'}
                    </Typography>
                    <IconButton onClick={() => setStateChart('')} aria-label="Cerrar" sx={{ width: 44, height: 44 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 2, pt: '20px !important', pb: 3 }}>
                    {valueChart === 1 && <ChartHugMonth statisticsMonthMother={statisticsMonthMother} />}
                    {valueChart === 2 && <ChartLocalitiesMother statisticsLocalities={statisticsLocalities} />}
                    {valueChart === 3 && <ChartSupplies statisticsSupplies={statisticsSupplies} />}
                    {valueChart === 4 && <ChartAssignmentMonth statisticsAssignment={statisticsAssignment} />}
                    {valueChart === 6 && <ChartWeightEvolution statisticsWeightEvolution={statisticsWeightEvolution} />}
                    {valueChart === 7 && <ChartBabyPermanence statisticsPermanencia={statisticsPermanencia} />}
                    {valueChart === 8 && <ChartDistribucionBebes datos={normalizeBebesPorSala(statisticsPorSala)} total={totalDe(statisticsPorSala)} notaAlPie="Solo bebés activos, agrupados por la sala donde están internados." />}
                    {valueChart === 9 && <ChartDistribucionBebes datos={normalizeBebesPorEstado(statisticsPorEstado)} total={totalDe(statisticsPorEstado)} />}
                    {valueChart === 10 && <ChartDistribucionBebes datos={normalizeBebesRangoEdades(statisticsRangoEdades)} total={totalDe(statisticsRangoEdades)} notaAlPie="Días de vida cumplidos al día de hoy." />}
                    {valueChart === 11 && <RankingVoluntarias ranking={statisticsRanking} />}

                    {valueChart === 5 && <ChartDuracionAbrazos duracion={statisticsDuracion} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StatisticsTemplate;

const ContainerButtons = styled('div')`
    padding: 20px 16px ${APP_SCROLL_BOTTOM_PADDING};
    display: flex;
    flex-direction: column;
`;
