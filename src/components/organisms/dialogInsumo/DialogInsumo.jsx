import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const DialogInsumo = (props) => {
    const { title, content, actions, open, setOpen, setModel, style, classes, widthPaper, fullScreen = true, ...other } = props;

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen?.('')}
            PaperProps={{
                style: {
                    minWidth: '260px',
                    maxWidth: '444px',
                    width: fullScreen ? widthPaper ?? '100%' : '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                },
            }}
            classes={classes}
            style={style}
            {...other}
        >
            {/* <DialogTitle sx={{ m: 0, p: 2 }} >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle> */}
            <DialogTitle sx={{ m: 0, p: 0, pt: 'calc(8px + env(safe-area-inset-top, 0px))' }} >
                {title}
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            {actions && (
                <DialogActions sx={{ pb: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    )
}

export default DialogInsumo;