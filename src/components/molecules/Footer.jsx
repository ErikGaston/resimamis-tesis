import React from 'react'
import BottomNavigationCustom from '../atoms/BottomNavigation'
import { Box } from '@mui/material'
import home from '../../assets/home/home.svg'
import homeSelected from '../../assets/home/homeSelected.svg'
import task from '../../assets/home/task.svg'
import taskSelected from '../../assets/home/taskSelected.svg'
import metrics from '../../assets/home/metrics.svg'
import metricsSelected from '../../assets/home/metricsSelected.svg'

const Footer = () => {
  const tabs = [
    {
      label: 'Inicio',
      value: 'home',
      icon: <img src={home} alt="home" />,
      iconSelected: <img src={homeSelected} alt="home" />
    },
    {
      label: 'Tareas',
      value: 'tareas',
      icon: <img src={task} alt="tareas" />,
      iconSelected: <img src={taskSelected} alt="home" />
    },
    {
      label: 'Estadisticas',
      value: 'estadisticas',
      icon: <img src={metrics} alt="estadisticas" />,
      iconSelected: <img src={metricsSelected} alt="home" />
    },
  ]
  return (
    <Box
      component={'footer'}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width:
          '100%',
        alignContent: 'center'
      }}>
      <BottomNavigationCustom tabs={tabs} />
    </Box>
  )
}

export default Footer