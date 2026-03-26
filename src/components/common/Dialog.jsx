import { Dialog as BaseDialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react'
import Button from './Button';

const Dialog = ({
  onClose = () => {}, 
  handleOk = () => {}, 
  handleCancel = () => {}, 
  open = false,
  title,
  textPrimaryButton,
  textSecondaryButton,
  showSecundaryButton,
  disabledPrimaryButton=false,
  children,
  maxWidth,
  actions,
  ...other
}) => {


  return (
    <BaseDialog
      fullWidth
      maxWidth={maxWidth ? maxWidth :'xs'}
      open={open}
      {...other}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
       {children}
      </DialogContent>
      <DialogActions>
      {actions ? 
        actions() :
        <>
          {showSecundaryButton &&
            <Button variant={'outlined'} color={'error'} onClick={handleCancel}>
              {textSecondaryButton ? textSecondaryButton : 'Cancelar'}
            </Button>
          }
          <Button disabled={disabledPrimaryButton} variant={'contained'} onClick={handleOk}>
            {textPrimaryButton ? textPrimaryButton : 'Aceptar'}
          </Button>
        </>
      }
      </DialogActions>
    </BaseDialog>
  )
}

export default Dialog