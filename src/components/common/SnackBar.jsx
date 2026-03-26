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
    <>
      {open && 
        <Snackbar 
          anchorOrigin={{ vertical: 'top', horizontal: 'center', }} 
          open={open}
          autoHideDuration={autoHideDuration ? autoHideDuration : 6000} 
          onClose={handleClose}
        >
          <Alert
            variant={variant} 
            sx={{ width: '100%' }}
            color={error ? 'error' : null } 
            onClose={handleClose} 
            severity={severity ? severity : 'success'} 
            >
            {message}
          </Alert> 
      </Snackbar>}
    </>
  )
}

export default SnackBar