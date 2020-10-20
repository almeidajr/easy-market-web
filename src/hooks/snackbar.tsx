import React, {
  createContext,
  useState,
  useCallback,
  SyntheticEvent,
  useContext,
  ReactNode,
} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { Color } from '@material-ui/lab/Alert';

export interface SnackbarData {
  message: ReactNode;
  severity?: Color;
}

interface SnackbarContextData {
  createSnackbar: (data: SnackbarData) => void;
}

const SnackbarContext = createContext<SnackbarContextData>(
  {} as SnackbarContextData,
);

const SnackbarProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ReactNode>(null);
  const [severity, setSeverity] = useState<Color | undefined>(undefined);

  const createSnackbar = useCallback(
    ({ message: newMessage, severity: newSeverity }: SnackbarData) => {
      setMessage(newMessage);
      setSeverity(newSeverity);
      setOpen(true);
    },
    [],
  );

  const handleClose = useCallback((event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }, []);

  return (
    <SnackbarContext.Provider value={{ createSnackbar }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={severity}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

function useSnackbar(): SnackbarContextData {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  return context;
}

export { SnackbarProvider, useSnackbar };
