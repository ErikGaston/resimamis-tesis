/**
 * Mantiene `--app-vh` sincronizada con el visual viewport.
 *
 * En iOS el teclado NO reduce `100dvh`: un Dialog dimensionado con dvh conserva
 * la altura completa y su footer de acciones queda tapado por el teclado. El
 * visual viewport sí refleja el alto realmente visible, así que los dialogs se
 * dimensionan con esta variable y caen a `100dvh` donde no esté disponible.
 */
const VAR_NAME = '--app-vh';

export function initAppViewportHeight() {
    if (typeof window === 'undefined') return;

    const vv = window.visualViewport;
    if (!vv) return;

    // El evento `scroll` del visual viewport se dispara también al colapsar la
    // barra de URL en iOS: sin el guard, cada uno forzaría un recálculo de
    // estilo del documento entero.
    let ultimo = null;
    const apply = () => {
        const alto = Math.round(vv.height);
        if (alto === ultimo) return;
        ultimo = alto;
        document.documentElement.style.setProperty(VAR_NAME, `${alto}px`);
    };

    apply();
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
}
