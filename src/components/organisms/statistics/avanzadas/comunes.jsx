import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';

export const NAVY = '#152C70';
export const VIOLET = '#8F00FF';
export const TEXTO_SECUNDARIO = 'rgba(21,44,112,0.75)';

export function SinDatos({ titulo = 'Sin datos disponibles', detalle }) {
    return (
        <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography sx={{ color: '#5A6478', fontSize: 14 }}>{titulo}</Typography>
            {detalle && (
                <Typography sx={{ color: TEXTO_SECUNDARIO, fontSize: 12, mt: 0.75, px: 2 }}>{detalle}</Typography>
            )}
        </Box>
    );
}

export function TarjetasNumero({ items }) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 1, mb: 2 }}>
            {items.map(({ label, valor, detalle }) => (
                <Box key={label} sx={{ p: 1.25, borderRadius: '12px', border: '1px solid rgba(21,44,112,0.1)', bgcolor: '#faf8fc' }}>
                    <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>{valor}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: TEXTO_SECUNDARIO, mt: 0.25, lineHeight: 1.25 }}>{label}</Typography>
                    {detalle && <Typography sx={{ fontSize: '0.7rem', color: TEXTO_SECUNDARIO }}>{detalle}</Typography>}
                </Box>
            ))}
        </Box>
    );
}

/** Chips de opción única ("Últimos 30 días", "7 días"…) en una fila, arriba del contenido. */
export function SelectorOpciones({ opciones, valor, onCambiar, etiqueta }) {
    return (
        <Box sx={{ mb: 2 }}>
            {etiqueta && <Typography sx={{ fontSize: '0.8rem', color: TEXTO_SECUNDARIO, mb: 0.75 }}>{etiqueta}</Typography>}
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {opciones.map((o) => (
                    <Chip
                        key={o.valor}
                        label={o.label}
                        clickable
                        onClick={() => onCambiar(o.valor)}
                        sx={{
                            height: 36,
                            fontWeight: 600,
                            bgcolor: valor === o.valor ? '#7A659B' : 'transparent',
                            color: valor === o.valor ? '#fff' : '#7A659B',
                            border: '1px solid #7A659B',
                            '&:hover': { bgcolor: valor === o.valor ? '#6A549A' : 'rgba(122,101,155,0.08)' },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}

export const PERIODOS = [
    { valor: 30, label: '30 días' },
    { valor: 90, label: '90 días' },
    { valor: 365, label: '1 año' },
];

export const rangoUltimosDias = (dias) => ({
    fechaDesde: dayjs().subtract(dias - 1, 'day').format('YYYY-MM-DD'),
    fechaHasta: dayjs().format('YYYY-MM-DD'),
});

export function BarraPorcentaje({ porcentaje, color = VIOLET }) {
    const valor = Math.max(0, Math.min(100, Number(porcentaje) || 0));
    return (
        <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(143,0,255,0.08)', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${valor}%`, bgcolor: color, borderRadius: 3 }} />
        </Box>
    );
}

export function FilaLista({ titulo, subtitulo, derecha, children }) {
    return (
        <Box sx={{ py: 1.1, px: 0.25, borderBottom: '1px solid rgba(21,44,112,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 600, color: NAVY, fontSize: '0.92rem' }}>{titulo}</Typography>
                    {subtitulo && <Typography noWrap sx={{ fontSize: '0.78rem', color: TEXTO_SECUNDARIO }}>{subtitulo}</Typography>}
                </Box>
                {derecha}
            </Box>
            {children && <Box sx={{ mt: 0.75 }}>{children}</Box>}
        </Box>
    );
}
