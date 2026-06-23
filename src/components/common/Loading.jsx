import { Backdrop, CircularProgress } from '@mui/material'

export const Loading = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: '#7A659B',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
