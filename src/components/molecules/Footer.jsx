import React from 'react'
import BottomNavigationCustom from '../atoms/BottomNavigation'
import { Box } from '@mui/material'
import { APP_COLUMN_MAX_WIDTH_PX } from '../../helpers/const/appLayout'
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
      label: 'Estadísticas',
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
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: APP_COLUMN_MAX_WIDTH_PX,
        alignContent: 'center',
        zIndex: 10,
      }}
    >
      <BottomNavigationCustom tabs={tabs} />
    </Box>
  )
}

export default Footer