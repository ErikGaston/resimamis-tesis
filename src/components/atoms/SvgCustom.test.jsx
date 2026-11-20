import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SvgCustom from './SvgCustom';

describe('SvgCustom', () => {
  it('envuelve el children dentro de un <svg>', () => {
    const { container } = render(
      <SvgCustom>
        <path data-testid="path-interno" d="M0 0h24v24H0z" />
      </SvgCustom>,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.querySelector('[data-testid="path-interno"]')).toBeInTheDocument();
  });
});
