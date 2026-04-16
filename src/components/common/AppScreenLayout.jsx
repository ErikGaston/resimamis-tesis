import { Box } from '@mui/material';
import { APP_COLUMN_MAX_WIDTH_PX } from '../../helpers/const/appLayout';

/**
 * Envuelve toda la app: columna centrada con ancho máximo igual al login (mobile-first).
 */
export default function AppScreenLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      <Box
        className="app-column"
        sx={{
          width: '100%',
          maxWidth: APP_COLUMN_MAX_WIDTH_PX,
          minHeight: '100vh',
          minWidth: 0,
          flex: '0 1 auto',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          position: 'relative',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
