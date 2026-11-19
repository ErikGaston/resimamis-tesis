import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const NAVY = '#152C70';
const VIOLET = '#7F00FF';

/** Links internos que escribe el asistente: [Juana Pérez](bebe:12). */
const RUTAS = {
  bebe: (id) => `/bebe/perfil/${id}`,
  voluntaria: (id) => `/voluntaria/perfil/${id}`,
  madre: (id) => `/madre/perfil/${id}`,
};

const INLINE = /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

/** Negritas y links. Todo se arma con elementos de React: nada de HTML crudo. */
function inline(texto, clave) {
  return String(texto).split(INLINE).filter((p) => p !== '').map((parte, i) => {
    const k = `${clave}-${i}`;
    if (parte.startsWith('**') && parte.endsWith('**') && parte.length > 4) {
      return <strong key={k}>{parte.slice(2, -2)}</strong>;
    }
    const link = parte.match(LINK);
    if (link) {
      const [, etiqueta, destino] = link;
      const [tipo, id] = destino.split(':');
      if (RUTAS[tipo] && /^\d+$/.test(id ?? '')) {
        return (
          <Link key={k} to={RUTAS[tipo](id)} style={{ color: VIOLET, fontWeight: 600, textDecoration: 'underline' }}>
            {etiqueta}
          </Link>
        );
      }
      // Links externos o mal armados: solo el texto.
      return <React.Fragment key={k}>{etiqueta}</React.Fragment>;
    }
    return <React.Fragment key={k}>{parte}</React.Fragment>;
  });
}

const esFilaTabla = (l) => /^\s*\|.*\|\s*$/.test(l);
const esSeparadorTabla = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
const celdas = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const ITEM_UL = /^\s*[-*•]\s+(.*)$/;
const ITEM_OL = /^\s*(\d+)[.)]\s+(.*)$/;

/** Arma bloques (párrafo, lista, tabla) a partir del texto del asistente. */
function bloques(texto) {
  const lineas = String(texto ?? '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  while (i < lineas.length) {
    const l = lineas[i];
    if (!l.trim()) { i += 1; continue; }
    if (esFilaTabla(l)) {
      const filas = [];
      while (i < lineas.length && esFilaTabla(lineas[i])) {
        if (!esSeparadorTabla(lineas[i])) filas.push(celdas(lineas[i]));
        i += 1;
      }
      out.push({ tipo: 'tabla', filas });
      continue;
    }
    if (ITEM_UL.test(l) || ITEM_OL.test(l)) {
      const ordenada = ITEM_OL.test(l);
      const items = [];
      while (i < lineas.length && (ordenada ? ITEM_OL.test(lineas[i]) : ITEM_UL.test(lineas[i]))) {
        const m = lineas[i].match(ordenada ? ITEM_OL : ITEM_UL);
        items.push(ordenada ? m[2] : m[1]);
        i += 1;
      }
      out.push({ tipo: ordenada ? 'ol' : 'ul', items });
      continue;
    }
    const parrafo = [];
    while (i < lineas.length && lineas[i].trim() && !esFilaTabla(lineas[i]) && !ITEM_UL.test(lineas[i]) && !ITEM_OL.test(lineas[i])) {
      parrafo.push(lineas[i]);
      i += 1;
    }
    out.push({ tipo: 'p', lineas: parrafo });
  }
  return out;
}

const AsistenteTexto = ({ texto }) => (
  <Box sx={{ color: NAVY, fontSize: '0.9375rem', lineHeight: 1.55, overflowWrap: 'anywhere', '& > *:not(:last-child)': { mb: 1 } }}>
    {bloques(texto).map((b, bi) => {
      if (b.tipo === 'p') {
        return (
          <Typography key={bi} component="p" sx={{ fontSize: 'inherit', lineHeight: 'inherit', color: 'inherit', m: 0 }}>
            {b.lineas.map((l, li) => (
              <React.Fragment key={li}>{li > 0 && <br />}{inline(l, `${bi}-${li}`)}</React.Fragment>
            ))}
          </Typography>
        );
      }
      if (b.tipo === 'ul' || b.tipo === 'ol') {
        const Lista = b.tipo;
        return (
          <Box key={bi} component={Lista} sx={{ m: 0, pl: 2.5, '& li': { mb: 0.25 } }}>
            {b.items.map((it, ii) => <li key={ii}>{inline(it, `${bi}-${ii}`)}</li>)}
          </Box>
        );
      }
      const [encabezado, ...resto] = b.filas;
      return (
        <Box key={bi} sx={{ overflowX: 'auto', border: '1px solid rgba(143,0,255,0.15)', borderRadius: '10px' }}>
          <Box component="table" sx={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {(encabezado ?? []).map((c, ci) => (
                  <Box key={ci} component="th" sx={{ textAlign: 'left', p: '6px 8px', bgcolor: 'rgba(143,0,255,0.07)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {inline(c, `${bi}-h${ci}`)}
                  </Box>
                ))}
              </tr>
            </thead>
            <tbody>
              {resto.map((fila, fi) => (
                <tr key={fi}>
                  {fila.map((c, ci) => (
                    <Box key={ci} component="td" sx={{ p: '6px 8px', borderTop: '1px solid rgba(143,0,255,0.08)' }}>
                      {inline(c, `${bi}-${fi}-${ci}`)}
                    </Box>
                  ))}
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      );
    })}
  </Box>
);

export default AsistenteTexto;
