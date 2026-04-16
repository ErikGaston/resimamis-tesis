/**
 * Estilos compartidos para listados: placeholder legible (mejor contraste sobre blanco) y búsqueda coherente.
 */
export const listSearchTextFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: '#4a4f5c',
    opacity: 1,
  },
};

/** Altura del BottomNavigation (debe coincidir con `BottomNavigation` styled). */
export const BOTTOM_NAV_HEIGHT_REM = 3.75;

/** Separación del FAB sobre la barra inferior. */
export const fabBottomAboveNav = `calc(${BOTTOM_NAV_HEIGHT_REM}rem + 24px)`;
