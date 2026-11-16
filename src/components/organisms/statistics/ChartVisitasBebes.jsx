import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const VIOLET = '#7A659B';
const NAVY = '#152C70';

export function ChartVisitasBebes({ bebes, estadisticas, onConsultar }) {
    const [desde, setDesde] = useState(() => dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
    const [hasta, setHasta] = useState(() => dayjs().format('YYYY-MM-DD'));
    const [idBebe, setIdBebe] = useState('');
    const rangoInvalido = !desde || !hasta || dayjs(hasta).isBefore(dayjs(desde));

    const porBebe = estadisticas?.porBebe ?? [];
    const data = {
        labels: porBebe.map((b) => b.nombreBebe),
        datasets: [{
            label: 'Visitas',
            data: porBebe.map((b) => b.cantidad),
            backgroundColor: 'rgba(143, 0, 255, 0.68)',
            borderColor: 'rgba(143, 0, 255, 1)',
            borderWidth: 1,
            borderRadius: 4,
        }],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} visitas` } } },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0, color: '#555' }, grid: { color: 'rgba(0,0,0,0.06)' }, title: { display: true, text: 'Visitas' } },
            x: { ticks: { color: '#555', autoSkip: false, maxRotation: 60 }, grid: { display: false } },
        },
    };

    return (
        <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                <TextField label="Desde *" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
                <TextField
                    label="Hasta *"
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={!!desde && !!hasta && rangoInvalido}
                    helperText={!!desde && !!hasta && rangoInvalido ? 'Anterior a "desde"' : ''}
                />
            </Box>
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel id="visitas-bebe" shrink>Bebé</InputLabel>
                <Select labelId="visitas-bebe" label="Bebé" notched displayEmpty value={idBebe} onChange={(e) => setIdBebe(e.target.value)}>
                    <MenuItem value="">Todos</MenuItem>
                    {(bebes ?? []).map((b) => (
                        <MenuItem key={b.id} value={String(b.id)}>{[b.nombre, b.apellido].filter(Boolean).join(' ')}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                variant="contained"
                fullWidth
                disabled={rangoInvalido}
                sx={{ bgcolor: VIOLET, '&:hover': { bgcolor: '#6A549A' }, textTransform: 'none', minHeight: 44, mb: 2 }}
                onClick={() => onConsultar({ fechaDesde: desde, fechaHasta: hasta, ...(idBebe ? { idBebe: Number(idBebe) } : {}) })}
            >
                Generar estadística
            </Button>

            {estadisticas && (porBebe.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#5A6478', fontSize: 14 }}>No hay visitas para los filtros seleccionados.</Typography>
                </Box>
            ) : (
                <>
                    <Typography sx={{ color: NAVY, fontWeight: 700, mb: 1 }}>
                        Total del período: {estadisticas.totalVisitas} {estadisticas.totalVisitas === 1 ? 'visita' : 'visitas'}
                    </Typography>
                    <Box sx={{ position: 'relative', height: 280 }}>
                        <Bar options={options} data={data} />
                    </Box>
                </>
            ))}
        </Box>
    );
}

export default ChartVisitasBebes;
