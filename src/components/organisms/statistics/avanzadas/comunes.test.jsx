import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import {
  SinDatos,
  TarjetasNumero,
  SelectorOpciones,
  BarraPorcentaje,
  FilaLista,
  PERIODOS,
  rangoUltimosDias,
} from './comunes';

describe('comunes', () => {
  describe('rangoUltimosDias', () => {
    it('devuelve fechaDesde/fechaHasta en formato YYYY-MM-DD', () => {
      const rango = rangoUltimosDias(30);
      expect(rango.fechaHasta).toBe(dayjs().format('YYYY-MM-DD'));
      expect(rango.fechaDesde).toBe(dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
    });
  });

  describe('PERIODOS', () => {
    it('expone los períodos estándar', () => {
      expect(PERIODOS.map((p) => p.valor)).toEqual([30, 90, 365]);
    });
  });

  describe('SinDatos', () => {
    it('renderiza título por defecto y detalle opcional', () => {
      render(<SinDatos detalle="Detalle extra" />);
      expect(screen.getByText('Sin datos disponibles')).toBeInTheDocument();
      expect(screen.getByText('Detalle extra')).toBeInTheDocument();
    });

    it('acepta un título custom', () => {
      render(<SinDatos titulo="Nada acá" />);
      expect(screen.getByText('Nada acá')).toBeInTheDocument();
    });
  });

  describe('TarjetasNumero', () => {
    it('renderiza una tarjeta por ítem', () => {
      render(<TarjetasNumero items={[{ label: 'Total', valor: 42 }]} />);
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('SelectorOpciones', () => {
    it('dispara onCambiar con el valor del chip clickeado', () => {
      const onCambiar = vi.fn();
      render(
        <SelectorOpciones
          opciones={[{ valor: 7, label: '7 días' }, { valor: 30, label: '30 días' }]}
          valor={7}
          onCambiar={onCambiar}
          etiqueta="Período"
        />,
      );
      fireEvent.click(screen.getByText('30 días'));
      expect(onCambiar).toHaveBeenCalledWith(30);
    });
  });

  describe('BarraPorcentaje', () => {
    it('renderiza sin romper con un porcentaje válido', () => {
      const { container } = render(<BarraPorcentaje porcentaje={50} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('tolera valores fuera de rango o no numéricos', () => {
      const { container } = render(<BarraPorcentaje porcentaje={999} />);
      expect(container.firstChild).toBeInTheDocument();
      render(<BarraPorcentaje porcentaje="no-num" />);
    });
  });

  describe('FilaLista', () => {
    it('renderiza título, subtítulo y contenido a la derecha', () => {
      render(
        <FilaLista titulo="Ana" subtitulo="Sala A" derecha={<span>99%</span>}>
          <span>barra</span>
        </FilaLista>,
      );
      expect(screen.getByText('Ana')).toBeInTheDocument();
      expect(screen.getByText('Sala A')).toBeInTheDocument();
      expect(screen.getByText('99%')).toBeInTheDocument();
      expect(screen.getByText('barra')).toBeInTheDocument();
    });
  });
});
