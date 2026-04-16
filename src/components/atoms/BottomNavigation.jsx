import React, { useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigationCustom = ({ tabs = [] }) => {
  const [selectedValue, setSelectedValue] = React.useState(tabs[0]?.value ?? '');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue);
    navigate('/' + newValue);
  };

  useEffect(() => {
    const lastPart = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
    if (lastPart === 'home' || lastPart === '' || lastPart === 'overview') {
      setSelectedValue(tabs[0]?.value ?? 'home');
      return;
    }
    if (lastPart === 'tareas') {
      setSelectedValue('tareas');
      return;
    }
    if (lastPart === 'estadisticas') {
      setSelectedValue('estadisticas');
    }
  }, [location.pathname, tabs]);

  return (
    <BottomNavigation
      value={selectedValue}
      onChange={handleChange}
      showLabels
      aria-label="Navegación principal"
      sx={{
        bgcolor: '#8F00FF',
        height: '3.75rem',
        pt: 0.25,
        '& .MuiBottomNavigationAction-root': {
          color: 'rgba(255,255,255,0.92)',
          minWidth: 0,
          maxWidth: 'none',
          py: 0.5,
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.92)',
            opacity: 1,
            mt: 0.5,
          },
          '&.Mui-selected': {
            color: '#FFEB3B',
            '& .MuiBottomNavigationAction-label': {
              color: '#FFEB3B',
              fontSize: '0.7rem',
            },
          },
        },
      }}
    >
      {tabs.map(({ label, value, icon, iconSelected }) => (
        <BottomNavigationAction
          key={value}
          label={label}
          value={value}
          icon={value === selectedValue ? iconSelected : icon}
          aria-current={selectedValue === value ? 'page' : undefined}
        />
      ))}
    </BottomNavigation>
  );
};

export default BottomNavigationCustom;
