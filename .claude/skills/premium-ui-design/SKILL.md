---
name: "premium-ui-design"
description: Skill para diseño UI/UX premium, sistemas de diseño, tipografía avanzada, paletas de colores curadas, micro-animaciones, dark mode, y componentes visuales de alto impacto. Usar cuando se pida mejorar el diseño visual de una página, crear un sistema de tokens, agregar hover effects, gradientes, o cualquier mejora estética de alto nivel en proyectos React/Next.js con Emotion CSS.
---

# Premium UI Design — Skill

Sistema de diseño, tokens visuales, y patrones estéticos para interfaces de nivel premium en Next.js + Emotion.

## Tabla de contenidos

- [Sistema de Colores](#sistema-de-colores)
- [Tipografía Premium](#tipografía-premium)
- [Micro-animaciones CSS](#micro-animaciones-css)
- [Efectos Visuales Avanzados](#efectos-visuales-avanzados)
- [Layout y Grid Patterns](#layout-y-grid-patterns)
- [Componentes Premium Reutilizables](#componentes-premium-reutilizables)
- [Dark Mode Design Tokens](#dark-mode-design-tokens)
- [Checklist de Calidad Visual](#checklist-de-calidad-visual)

---

## Sistema de Colores

### Paleta oscura premium (estilo SaaS moderno)

```js
// theme-premium.js
export const premiumTheme = {
  // Fondos
  bg: {
    base: '#08080f',       // casi negro con tinte azul
    surface: '#0f0f1a',    // cards y contenedores
    elevated: '#161622',   // dropdowns, modals
    overlay: 'rgba(0,0,0,0.7)',
  },

  // Acento principal — azul eléctrico
  accent: {
    primary: '#0F8CFF',
    primaryLight: '#4FABFF',
    primaryDark: '#0060CC',
    secondary: '#6C63FF',  // violeta
    tertiary: '#00D4AA',   // mint (éxito/acción positiva)
  },

  // Texto
  text: {
    primary: '#F0F0FF',    // blanco suave, no puro
    secondary: '#9898B0',  // gris azulado
    muted: '#5C5C7A',
    link: '#4FABFF',
  },

  // Bordes
  border: {
    subtle: 'rgba(255,255,255,0.07)',
    default: 'rgba(255,255,255,0.12)',
    strong: 'rgba(255,255,255,0.2)',
  },

  // Gradientes
  gradient: {
    hero: 'linear-gradient(135deg, #08080f 0%, #0d1440 50%, #08080f 100%)',
    accent: 'linear-gradient(135deg, #0F8CFF 0%, #6C63FF 100%)',
    accentReverse: 'linear-gradient(135deg, #6C63FF 0%, #0F8CFF 100%)',
    card: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
    glow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(15,140,255,0.15), transparent)',
  },

  // Sombras con glow
  shadow: {
    card: '0 4px 24px rgba(0,0,0,0.4)',
    glow: '0 0 40px rgba(15,140,255,0.25)',
    glowStrong: '0 0 80px rgba(15,140,255,0.4)',
    glowPurple: '0 0 60px rgba(108,99,255,0.3)',
  },
};
```

---

## Tipografía Premium

### Importación de fuentes en `layout.jsx`

```jsx
// app/layout.jsx — importar fuentes modernas
import { Inter, Montserrat } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});
```

### Escala tipográfica display (para heroes)

```css
/* Display gigante — impacto máximo */
.text-display {
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

/* Título de sección */
.text-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Subtítulo lead */
.text-lead {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 400;
  line-height: 1.7;
  color: var(--text-secondary);
}
```

### Texto con gradiente (muy premium)

```jsx
const GradientText = styled('span')`
  background: linear-gradient(135deg, #0F8CFF 0%, #6C63FF 50%, #00D4AA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// Uso: <h1>Comprá en <GradientText>Universal Market</GradientText></h1>
```

---

## Micro-animaciones CSS

### Hover lift (tarjetas y botones)

```css
.card-hover {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.card-hover:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(15, 140, 255, 0.15);
}
```

### Shimmer loading (skeleton premium)

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.03) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}
```

### Glow pulse (badges, indicadores de estado)

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(15, 140, 255, 0.4); }
  50% { box-shadow: 0 0 20px rgba(15, 140, 255, 0.8), 0 0 40px rgba(15, 140, 255, 0.3); }
}

.glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Float (objetos que flotan suavemente)

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.float {
  animation: float 4s ease-in-out infinite;
}
```

### Gradiente animado de fondo

```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background: linear-gradient(-45deg, #0F8CFF, #6C63FF, #00D4AA, #0F8CFF);
  background-size: 400% 400%;
  animation: gradient-shift 8s ease infinite;
}
```

---

## Efectos Visuales Avanzados

### Glassmorphism dark (componente Emotion)

```jsx
import styled from '@emotion/styled';

export const GlassCard = styled('div')`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  /* Brillo interno en la parte superior */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  }
`;
```

### Noise texture overlay (efecto grain premium)

```jsx
const NoiseOverlay = styled('div')`
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
`;
```

### Aurora/spotlight de fondo (efecto muy premium)

```jsx
const AuroraBackground = styled('div')`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 60%;
    height: 80%;
    background: radial-gradient(ellipse, rgba(15, 140, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(60px);
    animation: aurora-drift 12s ease-in-out infinite alternate;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: -10%;
    width: 50%;
    height: 70%;
    background: radial-gradient(ellipse, rgba(108, 99, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(80px);
    animation: aurora-drift 15s ease-in-out infinite alternate-reverse;
  }

  @keyframes aurora-drift {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(5%, 3%) scale(1.1); }
  }
`;
```

### Bordes con gradiente animado

```jsx
const GradientBorderCard = styled('div')`
  position: relative;
  border-radius: 20px;
  padding: 1px; /* el borde es el padding del wrapper */
  background: linear-gradient(135deg, #0F8CFF, #6C63FF, #00D4AA, #0F8CFF);
  background-size: 300% 300%;
  animation: gradient-shift 5s ease infinite;

  > div {
    background: #0f0f1a;
    border-radius: 19px;
    padding: 24px;
  }
`;
```

---

## Layout y Grid Patterns

### Hero con contenido centrado y escena 3D

```jsx
const HeroWrapper = styled('section')`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroContent = styled('div')`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 860px;
  padding: 0 24px;
`;
```

### Bento Grid (patrón de cards moderno 2024/2025)

```jsx
const BentoGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 120px;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

// Card grande: 8 columnas × 3 filas
const BentoCardLarge = styled(GlassCard)`
  grid-column: span 8;
  grid-row: span 3;
`;

// Card pequeña: 4 columnas × 2 filas
const BentoCardSmall = styled(GlassCard)`
  grid-column: span 4;
  grid-row: span 2;
`;
```

### Features en 3 columnas con íconos animados

```jsx
const FeaturesGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;
```

---

## Componentes Premium Reutilizables

### Badge de "Nuevo" con glow

```jsx
const NewBadge = styled('span')`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 140, 255, 0.15);
  border: 1px solid rgba(15, 140, 255, 0.3);
  border-radius: 100px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #4FABFF;
  letter-spacing: 0.02em;
  box-shadow: 0 0 20px rgba(15, 140, 255, 0.2);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0F8CFF;
    box-shadow: 0 0 8px rgba(15, 140, 255, 0.8);
    animation: glow-pulse 2s ease-in-out infinite;
  }
`;
```

### CTA Button principal

```jsx
const CTAButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 48px;
  background: linear-gradient(135deg, #0F8CFF, #6C63FF);
  border: none;
  border-radius: 14px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 0 40px rgba(15, 140, 255, 0.4);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 60px rgba(15, 140, 255, 0.6);
  }
`;
```

### Contador animado de estadísticas

```jsx
import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ from = 0, to, duration = 2, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count.toLocaleString('es-AR')}{suffix}</span>;
}

// Uso: <AnimatedCounter to={12500} suffix="+" /> → "12.500+"
```

---

## Dark Mode Design Tokens

### Regla de oro: nunca usar negro puro ni blanco puro

```js
// ❌ EVITAR
color: '#000000';
background: '#ffffff';

// ✅ PREMIUM
color: '#F0F0FF';        // blanco suave con tinte azul frío
background: '#08080f';   // negro cálido con tinte azul
```

### Contraste mínimo para accesibilidad

- Texto primario sobre fondo base: ≥ 7:1 (AAA)
- Texto secundario sobre fondo base: ≥ 4.5:1 (AA)
- Iconos y estados: ≥ 3:1

---

## Checklist de Calidad Visual

Antes de hacer un commit de un rediseño, verificar:

- [ ] ¿La paleta de colores tiene contraste suficiente?
- [ ] ¿Los tamaños de fuente usan `clamp()` para ser responsivos?
- [ ] ¿Las animaciones tienen `prefers-reduced-motion` fallback?
- [ ] ¿Los efectos de blur (glassmorphism) tienen fallback para navegadores sin soporte?
- [ ] ¿Las sombras y glows no son tan fuertes que destruyan la legibilidad?
- [ ] ¿El diseño se ve bien en mobile (≤ 375px) y en 4K (≥ 2560px)?
- [ ] ¿Los componentes 3D tienen un fallback estático si WebGL no está disponible?
- [ ] ¿Los tiempos de animación están entre 150ms (micro) y 800ms (macro)?

```css
/* Fallback obligatorio para animaciones */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Recursos

- Paletas: https://coolors.co / https://uicolors.app
- Fuentes Google: https://fonts.google.com (Inter, Montserrat, Space Grotesk)
- Inspiración: https://motionsites.ai / https://awwwards.com / https://land-book.com
- Glassmorphism: https://ui.glass/generator/
- Gradientes: https://www.gradienta.io / https://uigradients.com
