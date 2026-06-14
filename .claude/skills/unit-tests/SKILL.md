---
name: unit-tests
description: Escribir tests unitarios y de integración con Jest + React Testing Library en web-universal-market. Usar al pedir "test unitario", "test de este componente/hook/util", cubrir lógica, agregar tests al cambiar comportamiento, o aumentar coverage. Cubre mocking de RTK Query/Axios y componentes MUI.
---

# unit-tests — Jest + React Testing Library

Stack de test del repo: **Jest + RTL + `@testing-library/user-event`** sobre jsdom (`jest.config.js` con `next/jest`, `setupFilesAfterEach: src/setupTests.js`, alias `@/ → raíz`). Tests junto al código: `*.test.js`. Comandos: `yarn test` (watch), `yarn test:ci`.

## Pirámide (adaptada a este repo)
- **Unitario (50–60%):** utils puros (`utils/*.js`), hooks (`hooks/*.js`), atoms presentacionales.
- **Integración (25–35%):** templates/organisms que combinan componentes + estado + llamadas (mockeadas). Es donde más valor hay acá (las páginas son controladores con mucha lógica).
- **E2E (10–15%):** Playwright (ver skill `e2e-playwright`), fuera de Jest.

## Reglas
- **Probar QUÉ hace el código, no CÓMO.** Tests que sobreviven refactors internos. Sin acoplar a detalles de implementación ni a estilos (`styled`).
- **Naming:** `should_<resultado>_when_<condición>` (ej. `should_disable_add_when_stock_is_zero`). Evitar "test 1".
- **Patrón AAA** (Arrange-Act-Assert). Una conducta por test; varios `expect` ok.
- **Queries RTL por prioridad:** `getByRole` → `getByLabelText` → `getByPlaceholderText` → **`getByTestId`** (los `data-testid` de la rule 05 son válidos como último recurso semántico). Para texto cambiante usar regex (`/agregar/i`).
- **Interacción:** preferí `userEvent` sobre `fireEvent` (`const user = userEvent.setup()`).
- **Async:** `await screen.findByText(...)`, `await waitForElementToBeRemoved(...)`, `await waitFor(() => expect(mockFn).toHaveBeenCalled())`. Nunca timeouts arbitrarios.
- **Determinismo:** sin `Date.now()`/random reales (mockear); datos de test controlados; cada test aislado (`afterEach(cleanup)` lo da RTL; resetear mocks con `jest.clearAllMocks()` en `afterEach`).

## Qué mockear en ESTE repo
- **RTK Query / endpoints:** mockear el hook que usa el componente, no el HTTP real:
```js
jest.mock('@/src/redux/api/apiSlice', () => ({
  ...jest.requireActual('@/src/redux/api/apiSlice'),
  useGetProductsQuery: jest.fn(),
}))
import { useGetProductsQuery } from '@/src/redux/api/apiSlice'
beforeEach(() => useGetProductsQuery.mockReturnValue({ data: { data: [] }, isLoading: false }))
```
  Recordá la forma de respuesta del backend: `res.data.data` (envoltorio `{ error, data }`).
- **Axios / interceptor:** para utils que lo usen, `jest.mock('@/src/redux/interceptor/interceptor')`.
- **`next/navigation`:** `jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }), useParams: () => ({}), usePathname: () => '/' }))`.
- **`translateErrorMessage`:** dejar el real (es puro) y testear que el mensaje al usuario sea el esperado.

## Render con providers (componentes conectados)
Si el componente usa Redux/LoadingContext, envolvelo. Helper sugerido en `src/test-utils.jsx`:
```jsx
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from '@/src/redux/store' // o configureStore de prueba con apiSlice
export const renderWithProviders = (ui, { store = makeStore() } = {}) =>
  render(<Provider store={store}>{ui}</Provider>)
```
Para atoms puros (Button, Textfield) alcanza `render(<Button .../>)` sin providers.

## Cobertura
- Cubrí: **happy path**, **errores** (inputs inválidos, fallo de mutation → toast/diálogo), **edge cases** (carrito vacío, stock 0, listas vacías → Skeleton/empty state).
- Opcional, si se decide medir: `coverageThreshold` 80% (branches/functions/lines) en `jest.config.js`. Hoy no está configurado.

## Ejemplos
**Util puro:**
```js
import { numberFormat } from '@/src/utils/numberFormat'
describe('numberFormat', () => {
  it('should_format_thousands_with_separator', () => {
    expect(numberFormat(1234567)).toBe('1.234.567')
  })
})
```
**Componente con interacción:**
```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/src/components/atoms/Button/Button'
it('should_call_onClick_when_clicked', async () => {
  const onClick = jest.fn()
  render(<Button onClick={onClick} dataTestId="x.btn">Agregar</Button>)
  await userEvent.click(screen.getByTestId('x.btn'))
  expect(onClick).toHaveBeenCalledTimes(1)
})
```

## Antes de cerrar
Corré `yarn test:ci`. **Agregá/actualizá tests cuando cambie comportamiento** (regla del CLAUDE.md). Si el cambio toca un endpoint o flujo, alineá con la rule correspondiente.
