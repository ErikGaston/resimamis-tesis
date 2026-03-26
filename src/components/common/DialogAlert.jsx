import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from './Button';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogAlert = ({
  message ='', 
  open,
  title,
  handleAccept= () => {}, 
  handleCancel = () => {},
  children
}) => {

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCancel}
        aria-describedby="alert-dialog"
        maxWidth={'xs'}
        sx={{'& .MuiPaper-root':{padding:2}}}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-message">
           {message}
           {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={'contained'} onClick={handleAccept}>Aceptar</Button>
          <Button variant={'outlined'} color={'error'} onClick={handleCancel}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogAlert;