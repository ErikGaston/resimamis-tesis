import { styled } from '@mui/material'
import React from 'react'

const CustomCard = styled('div')({
  background: '#FFFFFF 0% 0% no-repeat padding-box',
  boxShadow: '0px 3px 6px #00000029',
  borderRadius: '8px',
  opacity: 1,
})

export const Card = ({children}) => {
  return (
    <CustomCard>
      {children}
    </CustomCard>
  )
}
