import { render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { baseTheme } from '../helpers/theme';

// El theme de la app extiende MUI con claves custom (theme.shadow.*, etc.) que
// muchos componentes leen. Sin ThemeProvider, el render explota.
const theme = createTheme(baseTheme);

export function renderWithTheme(ui, options) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
    ...options,
  });
}

// Para páginas conectadas a Redux: store de test inerte (el estado queda fijo en
// preloadedState; los dispatch no lo mutan) + ThemeProvider. Devuelve el store para
// poder espiar dispatch con vi.spyOn(store, 'dispatch').
export function renderWithProviders(ui, { preloadedState = {}, store, ...options } = {}) {
  const testStore = store ?? createStore((state = preloadedState) => state, preloadedState);
  const Wrapper = ({ children }) => (
    <Provider store={testStore}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  );
  return { store: testStore, ...render(ui, { wrapper: Wrapper, ...options }) };
}
