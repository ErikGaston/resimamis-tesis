import React from 'react';
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { RouterApp } from './routes/RouterApp'
import { ReactQueryDevtools } from 'react-query/devtools'
import { baseTheme } from './helpers/theme'
import { createTheme, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: false
//     },
//     mutations: {
//       retry: false
//     },
//   }
// })

const theme = createTheme(baseTheme);

import configureStore from "./redux/store";
const store = configureStore();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* <QueryClientProvider client={queryClient}> */}
        <BrowserRouter>
          <RouterApp />
        </BrowserRouter>
        {/* </QueryClientProvider> */}
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
