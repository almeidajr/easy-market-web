import React from 'react';

import { SnackbarProvider } from './snackbar';
import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children }) => (
  <SnackbarProvider>
    <AuthProvider>{children}</AuthProvider>
  </SnackbarProvider>
);

export default AppProvider;
