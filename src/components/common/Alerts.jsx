import { Alert, Slide, Stack } from '@mui/material'
import React from 'react'

export const Alerts = ({ variant, message, severity, open }) => {
  return (
    <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
      <Alert variant={variant} severity={severity}>
        {message}
      </Alert>
      {/* <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      </Slide> */}
    </Stack>
  )
}
