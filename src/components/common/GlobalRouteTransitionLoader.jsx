import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../atoms/loading/Loading';

const TRANSITION_MS = 350;

/**
 * Overlay que aparece en cada cambio de ruta (incluyendo botón atrás).
 * Cubre el gap entre que el componente monta y su useEffect dispara showLoading(true).
 * Si la API tarda más de TRANSITION_MS, el loader propio de la página toma el relevo.
 */
export default function GlobalRouteTransitionLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const isFirst = useRef(true);

  useEffect(() => {
    // No mostrar en la carga inicial — cada página maneja su propio loading
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), TRANSITION_MS);
    return () => clearTimeout(timerRef.current);
  }, [location.key]);

  if (!visible) return null;
  return <Loading />;
}
