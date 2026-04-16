import { Box } from '@mui/material';
import { APP_SCROLL_BOTTOM_PADDING } from '../../helpers/const/appLayout';

/**
 * Área principal con scroll vertical y espacio bajo el footer fijo.
 */
export default function PageScrollMain({ children, sx = {} }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        pb: APP_SCROLL_BOTTOM_PADDING,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
