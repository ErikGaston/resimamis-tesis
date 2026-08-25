import React from 'react';
import { Box, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const NOMBRES_MES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const NOMBRES_MES_CORTO = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const LINE_COLOR = 'rgba(143, 0, 255, 1)';
const FILL_COLOR = 'rgba(143, 0, 255, 0.12)';

/**
 * El backend agrupa por (mes, año) pero el DTO solo expone `mes`, así que dos
 * años distintos llegan como dos entradas con el mismo mes y sin forma de
 * distinguirlas. Se suman para que la serie no muestre el mismo mes dos veces.
 */
function acumularPorMes(statisticsAssignment) {
    const totales = new Map();

    for (const registro of statisticsAssignment ?? []) {
        const mes = Number(registro?.mes);
        if (!Number.isInteger(mes) || mes < 1 || mes > 12) continue;

        const cantidad = Number(registro?.cantidadAsignaciones) || 0;
        totales.set(mes, (totales.get(mes) ?? 0) + cantidad);
    }

    return [...totales.entries()]
        .sort(([mesA], [mesB]) => mesA - mesB)
        .map(([mes, cantidad]) => ({ mes, cantidad }));
}

export function ChartAssignmentMonth({ title, statisticsAssignment }) {
    const puntos = acumularPorMes(statisticsAssignment);

    if (!puntos.length) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#5A6478', fontSize: 14 }}>Sin datos disponibles</Typography>
            </Box>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    title: (items) => NOMBRES_MES[puntos[items[0].dataIndex].mes - 1],
                    label: (ctx) => ` ${ctx.parsed.y} ${ctx.parsed.y === 1 ? 'asignación' : 'asignaciones'}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0, color: '#555' },
                grid: { color: 'rgba(0,0,0,0.06)' },
            },
            x: { ticks: { color: '#555' }, grid: { display: false } },
        },
    };

    const data = {
        labels: puntos.map((p) => NOMBRES_MES_CORTO[p.mes - 1]),
        datasets: [{
            label: 'Asignaciones',
            data: puntos.map((p) => p.cantidad),
            borderColor: LINE_COLOR,
            backgroundColor: FILL_COLOR,
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#fff',
            pointBorderColor: LINE_COLOR,
            pointBorderWidth: 2,
        }],
    };

    return (
        <Box sx={{ position: 'relative', height: 300 }}>
            <Line options={options} data={data} />
        </Box>
    );
}
