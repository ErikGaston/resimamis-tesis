import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const DialogInsumo = (props) => {
    const { title, content, actions, open, setOpen, setModel, style, classes, widthPaper, ...other } = props;

    return (
        <Dialog
            fullScreen
            open={open}
            PaperProps={{
                style: {
                    minWidth: '260px',
                    maxWidth: '800px',
                    width: widthPaper
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
            <DialogTitle sx={{ m: 0, p: 2 }} >
                {title}
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
    )
}

export default DialogInsumo;