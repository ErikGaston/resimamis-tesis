import React from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { RouterApp } from './routes/RouterApp'
import { baseTheme } from './helpers/theme'
import { createTheme, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux';
import { initAppViewportHeight } from './utils/appViewportHeight';

const theme = createTheme(baseTheme);

import configureStore from "./redux/store";
import GlobalSnackBar from "./components/common/GlobalSnackBar";
import AppScreenLayout from "./components/common/AppScreenLayout";

const store = configureStore();

initAppViewportHeight();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GlobalSnackBar />
          <AppScreenLayout>
            <RouterApp />
          </AppScreenLayout>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
