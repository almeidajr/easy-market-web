import React, { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import NoSsr from '@material-ui/core/NoSsr';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import AppProvider from './hooks';
import Routes from './routes';
import Copyright from './components/Copyright';

const App: React.FC = () => {
  const theme = useMemo(
    () => createMuiTheme({ palette: { type: 'dark' } }),
    [],
  );

  return (
    <BrowserRouter>
      <NoSsr>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppProvider>
              <Container component="main" maxWidth="xs">
                <Routes />
                <Box mt={8}>
                  <Copyright />
                </Box>
              </Container>
            </AppProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </NoSsr>
    </BrowserRouter>
  );
};

export default App;
