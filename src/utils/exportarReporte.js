import dayjs from 'dayjs';

/**
 * Exportación de las estadísticas: a Excel (.xlsx) a partir de los datos que devolvió el back,
 * y a PDF con la impresión del navegador ("Guardar como PDF") sobre lo que se ve en pantalla.
 */

const MAX_HOJA = 31; // Excel no admite nombres de hoja más largos.

/** "cantidadAbrazos" → "Cantidad abrazos". */
export const humanizar = (clave) => {
    const s = String(clave)
        .replace(/_/g, ' ')
        .replace(/([a-záéíóúñ0-9])([A-ZÁÉÍÓÚÑ])/g, '$1 $2')
        .trim()
        .toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const esEscalar = (v) => v == null || ['string', 'number', 'boolean'].includes(typeof v);

const valorCelda = (v) => {
    if (v == null) return '';
    if (typeof v === 'boolean') return v ? 'Sí' : 'No';
    if (typeof v === 'number') return v;
    if (Array.isArray(v)) return v.map((x) => (esEscalar(x) ? valorCelda(x) : JSON.stringify(x))).join(', ');
    if (typeof v === 'object') return Object.entries(v).map(([k, x]) => `${humanizar(k)}: ${valorCelda(x)}`).join(' · ');
    return String(v);
};

/** Quita el sobre { data } que usan algunas respuestas del back. */
const desenvolver = (datos) => {
    let d = datos;
    for (let i = 0; i < 3 && d && !Array.isArray(d) && typeof d === 'object' && 'data' in d; i++) d = d.data;
    return d;
};

const tablaDeObjetos = (nombre, lista) => {
    const columnas = [];
    lista.forEach((fila) => {
        if (fila && typeof fila === 'object') Object.keys(fila).forEach((k) => { if (!columnas.includes(k)) columnas.push(k); });
    });
    if (columnas.length === 0) {
        return { nombre, columnas: ['Valor'], filas: lista.map((x) => [valorCelda(x)]) };
    }
    return {
        nombre,
        columnas: columnas.map(humanizar),
        filas: lista.map((fila) => columnas.map((c) => valorCelda(fila?.[c]))),
    };
};

/**
 * Convierte la respuesta de una estadística en tablas: una lista de objetos es una tabla; un
 * objeto da una tabla "Resumen" con sus valores sueltos y una tabla más por cada lista que tenga.
 */
export const aTablas = (datos) => {
    const d = desenvolver(datos);
    if (d == null) return [];
    if (Array.isArray(d)) return d.length ? [tablaDeObjetos('Datos', d)] : [];
    if (typeof d !== 'object') return [{ nombre: 'Datos', columnas: ['Valor'], filas: [[valorCelda(d)]] }];

    const resumen = [];
    const tablas = [];
    Object.entries(d).forEach(([clave, valor]) => {
        if (Array.isArray(valor)) {
            if (valor.length) tablas.push(tablaDeObjetos(humanizar(clave), valor));
        } else if (valor && typeof valor === 'object') {
            Object.entries(valor).forEach(([k, v]) => {
                if (Array.isArray(v)) {
                    if (v.length) tablas.push(tablaDeObjetos(humanizar(`${clave} ${k}`), v));
                } else resumen.push([`${humanizar(clave)} - ${humanizar(k).toLowerCase()}`, valorCelda(v)]);
            });
        } else {
            resumen.push([humanizar(clave), valorCelda(valor)]);
        }
    });
    if (resumen.length) tablas.unshift({ nombre: 'Resumen', columnas: ['Dato', 'Valor'], filas: resumen });
    return tablas;
};

const nombreArchivo = (titulo, ext) =>
    `${String(titulo || 'reporte').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}-${dayjs().format('YYYY-MM-DD')}.${ext}`;

const nombreHoja = (nombre, usados) => {
    let base = String(nombre).replace(/[\\/?*[\]:]/g, ' ').slice(0, MAX_HOJA).trim() || 'Hoja';
    let n = base;
    let i = 2;
    while (usados.has(n)) n = `${base.slice(0, MAX_HOJA - 3)} ${i++}`;
    usados.add(n);
    return n;
};

/** Descarga un .xlsx con una hoja por tabla. Devuelve false si no había datos. */
export const exportarExcel = async (titulo, datos) => {
    const tablas = aTablas(datos);
    if (tablas.length === 0) return false;
    const { default: writeExcelFile } = await import('write-excel-file/browser');
    const usados = new Set();
    const hojas = tablas.map((t) => ({
        sheet: nombreHoja(t.nombre, usados),
        stickyRowsCount: 1,
        columns: t.columnas.map((c, i) => ({
            width: Math.min(50, Math.max(c.length, ...t.filas.map((f) => String(f[i] ?? '').length)) + 2),
        })),
        data: [
            t.columnas.map((c) => ({ value: c, fontWeight: 'bold' })),
            ...t.filas.map((f) => f.map((v) => ({ value: v === '' ? null : v }))),
        ],
    }));
    await writeExcelFile(hojas).toFile(nombreArchivo(titulo, 'xlsx'));
    return true;
};

/**
 * Abre la vista de impresión con el contenido del reporte (los gráficos se pasan a imagen) para
 * guardarlo como PDF. Devuelve false si el navegador bloqueó la ventana.
 */
export const exportarPdf = (titulo, nodo) => {
    if (!nodo) return false;
    const copia = nodo.cloneNode(true);
    // Los canvas clonados salen vacíos: se reemplazan por la imagen del original.
    const originales = nodo.querySelectorAll('canvas');
    copia.querySelectorAll('canvas').forEach((c, i) => {
        const img = document.createElement('img');
        try { img.src = originales[i].toDataURL('image/png'); } catch { return; }
        img.style.maxWidth = '100%';
        c.replaceWith(img);
    });
    copia.querySelectorAll('button, input, [role="combobox"], .no-imprimir').forEach((el) => el.remove());

    const estilos = [...document.querySelectorAll('style, link[rel="stylesheet"]')].map((el) => el.outerHTML).join('');
    const ventana = window.open('', '_blank');
    if (!ventana) return false;
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    ventana.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(nombreArchivo(titulo, 'pdf').replace(/\.pdf$/, ''))}</title>${estilos}
<style>body{font-family:system-ui,sans-serif;margin:24px;color:#152C70;background:#fff}h1{font-size:20px;margin:0 0 4px}.fecha{font-size:12px;color:#555;margin-bottom:16px}img{page-break-inside:avoid}</style>
</head><body><h1>Resimamis — ${esc(titulo)}</h1><div class="fecha">Generado el ${dayjs().format('DD/MM/YYYY HH:mm')}</div>${copia.outerHTML}</body></html>`);
    ventana.document.close();
    const imprimir = () => { ventana.focus(); ventana.print(); };
    // Se espera a que carguen las imágenes de los gráficos.
    if (ventana.document.readyState === 'complete') setTimeout(imprimir, 300);
    else ventana.addEventListener('load', () => setTimeout(imprimir, 300));
    return true;
};
