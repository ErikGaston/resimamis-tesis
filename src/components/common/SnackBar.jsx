import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const SnackBar = ({
  open = false, 
  message='',
  error,
  autoHideDuration, 
  setAlert = () => {}, 
  severity,
  variant
}) => {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert({ open:false, message:'', error:false });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={autoHideDuration ?? 6000}
      onClose={handleClose}
      sx={{ zIndex: 10050 }}
    >
      <Alert
        variant={variant}
        sx={{ width: '100%' }}
        color={error ? 'error' : undefined}
        onClose={handleClose}
        severity={severity ?? 'success'}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackBar