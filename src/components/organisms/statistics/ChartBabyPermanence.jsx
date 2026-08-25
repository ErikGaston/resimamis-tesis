import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChildCareOutlinedIcon from '@mui/icons-material/ChildCareOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Button, Paper, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DatePickerCustomized from '../../atoms/datePicker/DatePickerCustomized';
import {
    buildPermanenceHistogram,
    filterByIngreso,
    formatDias,
    normalizeBabyPermanence,
    summarizePermanence,
} from '../../../utils/babyPermanence';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLOR_BARRA = 'rgba(143, 0, 255, 0.68)';
const COLOR_BARRA_BORDE = 'rgba(143, 0, 255, 1)';

function StatTile({ icon: Icon, label, value, color }) {
    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                px: 1.5,
                py: 1.25,
                borderRadius: '12px',
                bgcolor: '#faf8fc',
                border: '1px solid rgba(143,0,255,0.1)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                <Icon sx={{ fontSize: 16, color }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(21,44,112,0.72)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color, lineHeight: 1.2 }}>
                {value}
            </Typography>
        </Box>
    );
}

export function ChartBabyPermanence({ statisticsPermanencia }) {
    const [desde, setDesde] = React.useState(null);
    const [hasta, setHasta] = React.useState(null);

    const bebes = React.useMemo(
        () => normalizeBabyPermanence(statisticsPermanencia),
        [statisticsPermanencia],
    );
    const filtrados = React.useMemo(
        () => filterByIngreso(bebes, desde, hasta),
        [bebes, desde, hasta],
    );
    const resumen = React.useMemo(() => summarizePermanence(filtrados), [filtrados]);
    const histograma = React.useMemo(() => buildPermanenceHistogram(filtrados), [filtrados]);

    if (!bebes?.length) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#5A6478', fontSize: 14 }}>Sin datos disponibles</Typography>
                <Typography sx={{ color: 'rgba(21,44,112,0.72)', fontSize: 12, mt: 0.75, px: 2 }}>
                    Se necesitan bebés activos con fecha de ingreso a NEO cargada.
                </Typography>
            </Box>
        );
    }

    const hayFiltro = Boolean(desde || hasta);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${ctx.parsed.y} ${ctx.parsed.y === 1 ? 'bebé' : 'bebés'}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#555' },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: { ticks: { color: '#555', font: { size: 11 } }, grid: { display: false } },
        },
    };

    const data = {
        labels: histograma.map((b) => b.label),
        datasets: [{
            label: 'Bebés',
            data: histograma.map((b) => b.cantidad),
            backgroundColor: COLOR_BARRA,
            borderColor: COLOR_BARRA_BORDE,
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
        }],
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 1.5, mb: 1.5, borderRadius: '12px', border: '1px solid rgba(143,0,255,0.12)' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.75)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
                    Período de ingreso a NEO
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 130 }}>
                        <DatePickerCustomized
                            label="Desde"
                            inputFormat="DD/MM/YYYY"
                            value={desde}
                            onChange={setDesde}
                            maxDate={hasta ?? undefined}
                            disableFuture
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 130 }}>
                        <DatePickerCustomized
                            label="Hasta"
                            inputFormat="DD/MM/YYYY"
                            value={hasta}
                            onChange={setHasta}
                            minDate={desde ?? undefined}
                            disableFuture
                        />
                    </Box>
                </Box>
                {hayFiltro && (
                    <Button
                        size="small"
                        onClick={() => { setDesde(null); setHasta(null); }}
                        sx={{ mt: 0.5, textTransform: 'none', color: '#8F00FF', fontSize: '0.75rem' }}
                    >
                        Limpiar período
                    </Button>
                )}
            </Paper>

            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                <StatTile icon={AccessTimeIcon} label="Promedio" value={formatDias(resumen.promedio)} color="#8F00FF" />
                <StatTile icon={ChildCareOutlinedIcon} label="Bebés" value={resumen.total} color="#152C70" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <StatTile icon={TrendingDownIcon} label="Mínimo" value={formatDias(resumen.minimo)} color="#0E9B2F" />
                <StatTile icon={TrendingUpIcon} label="Máximo" value={formatDias(resumen.maximo)} color="#C53814" />
            </Box>

            {resumen.total === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#5A6478', fontSize: 14 }}>
                        Ningún bebé ingresó en el período seleccionado
                    </Typography>
                </Box>
            ) : (
                <>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(21,44,112,0.75)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.75 }}>
                        Distribución de permanencia
                    </Typography>
                    <Box sx={{ position: 'relative', height: 260 }}>
                        <Bar options={options} data={data} />
                    </Box>
                </>
            )}

            <Typography sx={{ color: 'rgba(21,44,112,0.75)', fontSize: '0.8125rem', mt: 1.5, lineHeight: 1.5 }}>
                Días transcurridos desde el ingreso a NEO hasta hoy. Incluye únicamente bebés
                activos: los que ya egresaron no forman parte de esta estadística.
            </Typography>
        </Box>
    );
}
