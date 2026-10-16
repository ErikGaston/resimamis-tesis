import React from 'react'
import { SvgIcon } from '@mui/material'

const SvgCustom = ({
  children
}) => {
  return (
    <SvgIcon>
      {children}
    </SvgIcon>
  )
}

export default SvgCustom