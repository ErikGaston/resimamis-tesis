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
 * El backend agrupa por (mes, año). Los despliegues anteriores a agosto 2026 no
 * exponían `anio` en el DTO: ahí dos años distintos llegan como dos entradas con
 * el mismo mes y sin forma de distinguirlas, así que se suman.
 */
function acumularPorMes(statisticsAssignment) {
    const registros = [];

    for (const registro of statisticsAssignment ?? []) {
        const mes = Number(registro?.mes);
        if (!Number.isInteger(mes) || mes < 1 || mes > 12) continue;

        const anio = Number(registro?.anio);
        registros.push({
            mes,
            anio: Number.isInteger(anio) && anio > 0 ? anio : null,
            cantidad: Number(registro?.cantidadAsignaciones) || 0,
        });
    }

    if (!registros.length) return [];
    if (registros.some((r) => r.anio === null)) return acumularSoloPorMes(registros);

    const totales = new Map();
    for (const r of registros) {
        const clave = r.anio * 12 + (r.mes - 1);
        totales.set(clave, (totales.get(clave) ?? 0) + r.cantidad);
    }

    return rellenarHuecos(totales, (clave) => ({
        mes: (clave % 12) + 1,
        anio: Math.floor(clave / 12),
    }));
}

function acumularSoloPorMes(registros) {
    const totales = new Map();
    for (const r of registros) {
        totales.set(r.mes, (totales.get(r.mes) ?? 0) + r.cantidad);
    }
    return rellenarHuecos(totales, (mes) => ({ mes, anio: null }));
}

// Saltear un mes sin registros lo dibujaría contiguo al siguiente y falsearía la
// pendiente de la línea (Jun y Ago se verían a un mes de distancia).
function rellenarHuecos(totales, describir) {
    const claves = [...totales.keys()];
    const puntos = [];
    for (let clave = Math.min(...claves); clave <= Math.max(...claves); clave++) {
        puntos.push({ ...describir(clave), cantidad: totales.get(clave) ?? 0 });
    }
    return puntos;
}

function etiquetaCorta(punto, mostrarAnio) {
    const mes = NOMBRES_MES_CORTO[punto.mes - 1];
    return mostrarAnio ? `${mes} ${String(punto.anio).slice(-2)}` : mes;
}

function tituloMes(punto) {
    const mes = NOMBRES_MES[punto.mes - 1];
    return punto.anio ? `${mes} ${punto.anio}` : mes;
}

export function ChartAssignmentMonth({ title, statisticsAssignment }) {
    const puntos = acumularPorMes(statisticsAssignment);
    const mostrarAnio = new Set(puntos.map((p) => p.anio)).size > 1;

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
                    title: (items) => tituloMes(puntos[items[0].dataIndex]),
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
        labels: puntos.map((p) => etiquetaCorta(p, mostrarAnio)),
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
