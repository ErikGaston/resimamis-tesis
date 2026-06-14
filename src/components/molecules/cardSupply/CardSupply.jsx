import React from 'react';
import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const CardSupply = ({ first, second, textColor, stockActual, stockMinimo, stockMaximo }) => {
    const isLow = stockActual != null && stockMinimo != null && Number(stockActual) <= Number(stockMinimo);
    const progress =
        stockActual != null && stockMaximo != null && Number(stockMaximo) > 0
            ? Math.min(100, Math.round((Number(stockActual) / Number(stockMaximo)) * 100))
            : null;

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                p: '12px 16px',
                borderRadius: '14px',
                border: isLow
                    ? '1.5px solid rgba(194,24,91,0.35)'
                    : '1.5px solid rgba(143,0,255,0.10)',
                bgcolor: isLow ? 'rgba(194,24,91,0.03)' : '#fff',
                boxShadow: '0 2px 10px rgba(21,44,112,0.06)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: progress != null ? 0.75 : 0 }}>
                <Typography
                    sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#152C70', flex: 1, pr: 1 }}
                    noWrap
                >
                    {first}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                    {isLow && <WarningAmberIcon sx={{ fontSize: 15, color: '#C2185B' }} />}
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: textColor ?? '#152C70' }}>
                        {second}
                    </Typography>
                </Box>
            </Box>
            {progress != null && (
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 5,
                        borderRadius: 3,
                        bgcolor: 'rgba(21,44,112,0.08)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: isLow ? '#C2185B' : '#8F00FF',
                            borderRadius: 3,
                        },
                    }}
                />
            )}
        </Paper>
    );
};

export default CardSupply;
