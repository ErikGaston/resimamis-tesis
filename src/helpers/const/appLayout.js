/**
 * Ancho máximo de la columna principal (misma referencia que MUI Container maxWidth="xs").
 * Todas las pantallas se centran en viewport con este tope para mantener aspecto mobile-first.
 */
export const APP_COLUMN_MAX_WIDTH_PX = 444;

/** Padding inferior al hacer scroll para no tapar campos bajo el BottomNavigation fijo (~3.75rem + margen). */
export const APP_SCROLL_BOTTOM_PADDING = 'calc(3.75rem + 28px)';

/**
 * Inset derecho para FABs `position: fixed` alineados al borde interno de la columna centrada.
 * `100vw - min(100vw, maxWidth)` = ancho de los márgenes laterales en escritorio.
 */
export const fabRightInsetInColumn = `max(20px, calc((100vw - min(100vw, ${APP_COLUMN_MAX_WIDTH_PX}px)) / 2 + 20px))`;
