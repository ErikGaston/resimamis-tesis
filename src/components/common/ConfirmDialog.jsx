import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const BTN_SX = { minHeight: 48, flex: 1, textTransform: 'none', fontWeight: 600, borderRadius: 2 };

/**
 * Confirmación de una acción destructiva. Los botones van a ancho completo y
 * 48px porque se usan con una mano en el hospital, y separados para que no se
 * confunda "Cancelar" con la acción destructiva.
 */
export function ConfirmDialog({
    open,
    title = 'Confirmar baja',
    message,
    confirmLabel = 'Dar de baja',
    onConfirm,
    onCancel,
}) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { maxWidth: 400, width: 'calc(100% - 32px)', mx: 'auto', borderRadius: 3 } }}
        >
            <DialogTitle sx={{ fontWeight: 700, color: '#152C70', pb: 1 }}>{title}</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: 'rgba(21,44,112,0.85)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1.5 }}>
                <Button onClick={onCancel} variant="outlined" sx={{ ...BTN_SX, color: '#4A148C', borderColor: 'rgba(21,44,112,0.25)' }}>
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" sx={BTN_SX}>
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
