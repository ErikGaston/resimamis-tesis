import { Backdrop, CircularProgress } from '@mui/material'

export const Loading = ({open}) => {
  return (
    <Backdrop
        sx={{color: '#42DA6A', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress  sx={{mt:0}} color="inherit" />
    </Backdrop>
  )
}
