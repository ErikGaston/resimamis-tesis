import React, { useEffect } from 'react'
import {
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const BottomNavigationCustom = ({
  tabs = []
}) => {
  const [selectedValue, setSelectedValue] = React.useState(tabs[0].value);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue);
    navigate('/' + newValue)
  };

  useEffect(() => {
    const currentPath = window.location.pathname; // Esto devuelve '/tareas' en tu caso
    // Para obtener solamente lo que está después de la última barra
    const lastPartOfPath = currentPath.substring(currentPath.lastIndexOf('/') + 1); // Esto devuelve 'tareas'

    if (lastPartOfPath === 'home') {
      setSelectedValue(tabs[0].value);
    }
    if (lastPartOfPath === 'tareas') {
      setSelectedValue(tabs[1].value);
    }
    if (lastPartOfPath === 'estadisticas') {
      setSelectedValue(tabs[2].value);
    }
  }, [])

  return (
    <StyledBottomNavigation value={selectedValue} onChange={handleChange}>
      {tabs.map(({ label, value, icon, iconSelected }) => (
        <StyledBottomNavigationAction
          key={value}
          label={label}
          value={value}
          icon={value === selectedValue ? iconSelected : icon}
        />
      ))}
    </StyledBottomNavigation>
  )
}

export default BottomNavigationCustom;

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  background: linear-gradient(90deg, #FFE259 0%, #FFA751 100%);
  background-clip: text;
  color:linear-gradient(90deg, #FFE259 0%, #FFA751 100%);
  -webkit-text-fill-color: transparent;
  .MuiBottomNavigationAction-label {
    font-size:12px;
    font-weight: bold;
  }
`;

const StyledBottomNavigation = styled(BottomNavigation)`
  width: '100%';
  text-align:'center';
  background:#8F00FF;
  height:3.75rem;
  padding-top:0.2rem;
   
`