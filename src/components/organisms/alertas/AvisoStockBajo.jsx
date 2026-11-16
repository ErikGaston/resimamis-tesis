import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const MAX_VISIBLES = 4;

/** Insumos en o por debajo del stock mínimo. No se muestra nada si no hay ninguno. */
const AvisoStockBajo = ({ insumos, onVerInsumos, sx }) => {
    if (!Array.isArray(insumos) || insumos.length === 0) return null;
    const visibles = insumos.slice(0, MAX_VISIBLES);
    const resto = insumos.length - visibles.length;

    return (
        <Alert
            severity="warning"
            icon={<Inventory2OutlinedIcon />}
            sx={{ borderRadius: '12px', alignItems: 'flex-start', ...sx }}
            action={onVerInsumos ? (
                <Button color="inherit" size="small" onClick={onVerInsumos} sx={{ textTransform: 'none', fontWeight: 700, minHeight: 44 }}>
                    Ver insumos
                </Button>
            ) : null}
        >
            <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>
                {insumos.length === 1 ? '1 insumo bajo el stock mínimo' : `${insumos.length} insumos bajo el stock mínimo`}
            </AlertTitle>
            <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
                {visibles.map((i) => (
                    <Typography component="li" key={i.idInsumo} sx={{ fontSize: '0.875rem' }}>
                        <strong>{i.nombre}</strong>: {i.stockActual} {i.stockActual === 0 ? '(sin stock)' : `(mínimo ${i.stockMinimo})`}
                    </Typography>
                ))}
            </Box>
            {resto > 0 && (
                <Typography sx={{ fontSize: '0.8rem', mt: 0.5 }}>y {resto} más.</Typography>
            )}
        </Alert>
    );
};

export default AvisoStockBajo;
