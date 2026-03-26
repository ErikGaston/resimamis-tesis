import { Button as ButtonBase, styled } from '@mui/material'
import React from 'react'

const CustonButton = styled(ButtonBase)(({ theme }) => ({
  boxShadow: theme.shadow.bottom,
  borderRadius: '0.5rem',
  opacity: 1,
  textTransform: 'none',
  fontWeight: theme.typography.weight.semibolder,
  fontSize: theme.typography.size.little,
  padding: 8
}))

const Button = (props) => {
  const { children, color, variant, fullWidth } = props
  return (
    <CustonButton
      sx={{ textJustify: 'inter-word' }}
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </CustonButton>
  )
}

export default Button
