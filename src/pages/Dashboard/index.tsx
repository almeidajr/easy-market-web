import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import LinkIcon from '@material-ui/icons/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import { format } from 'date-fns';
// import QrReader from 'react-qr-reader';

import { Container, Avatar, SubmitButton, Paper } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useSnackbar } from '../../hooks/snackbar';
import api from '../../services/api';
import Input from '../../components/Input';

interface TabPanelProps {
  index: number;
  value: number;
}

interface FormData {
  url: string;
}

interface Nfce {
  accessKey: string;
  sourceUrl: string;
  protocol: string;
  number: number;
  amount: string;
  icmsBasis: string;
  icmsValue: string;
  createdAt: string;
}

function a11yProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...rest
}) => {
  return (
    <Container
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && children}
    </Container>
  );
};

const Dashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [nfces, setNfces] = useState<Nfce[]>([]);

  const { user, signOut } = useAuth();
  const { createSnackbar } = useSnackbar();

  const getFirstName = useCallback(() => {
    const [firstName] = user.name.split(' ');

    return firstName;
  }, [user.name]);

  const handleChangeTab = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    (event: React.ChangeEvent<{}>, newValue: number) =>
      setSelectedTab(newValue),
    [],
  );

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          url: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post<Nfce>('nfces', data);

        createSnackbar({
          severity: 'info',
          message: `Nota fiscal com chave de acesso: ${response.data.accessKey} adicionada à base de dados`,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        createSnackbar({
          severity: 'error',
          message: 'Falha ao obter dados da nota fiscal',
        });
      }
    },
    [createSnackbar],
  );

  // const handleScan = useCallback(
  //   data => {
  //     if (data) {
  //       createSnackbar({
  //         severity: 'success',
  //         message: data,
  //       });
  //     }
  //   },
  //   [createSnackbar],
  // );

  // const handleScanError = useCallback(
  //   () =>
  //     createSnackbar({
  //       severity: 'error',
  //       message: 'Falha na leitura do QR code',
  //     }),
  //   [createSnackbar],
  // );

  useEffect(() => {
    async function loadData(): Promise<void> {
      try {
        setIsLoading(true);
        const { data } = await api.get<Nfce[]>('nfces');
        setNfces(data);
      } catch {
        createSnackbar({
          severity: 'error',
          message: 'Falha ao conectar com o servidor',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [createSnackbar, selectedTab]);

  return (
    <>
      <TabPanel value={selectedTab} index={0}>
        <Avatar>
          <LinkIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Bem vindo - {getFirstName()}
        </Typography>
        {/* <QrReader
          delay={300}
          onError={handleScanError}
          onScan={handleScan}
          style={{ width: '100%' }}
        /> */}
        <Form ref={formRef} onSubmit={handleSubmit} noValidate>
          <Input
            autoComplete="url"
            name="url"
            variant="outlined"
            required
            fullWidth
            id="url"
            label="Link da NFCE"
            autoFocus
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Salvar
          </SubmitButton>
        </Form>
        <Grid container justify="flex-end">
          <Grid item>
            <Button type="button" onClick={signOut}>
              Logout
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        {isLoading && (
          <div style={{ width: '100%' }}>
            <Typography component="h3" variant="h5">
              <Skeleton />
            </Typography>
            <Typography component="h3" variant="h5">
              <Skeleton />
            </Typography>
            <Typography component="h3" variant="h5">
              <Skeleton />
            </Typography>
            <Typography component="h3" variant="h5">
              <Skeleton />
            </Typography>
          </div>
        )}
        {!isLoading &&
          nfces.map(nfce => (
            <Paper>
              <p>
                <strong>Chave de acesso:</strong> {nfce.accessKey}
              </p>
              <p>
                <strong>Protocolo:</strong> {nfce.protocol}
              </p>
              <p>
                <strong>Número:</strong> {nfce.number}
              </p>
              <p>
                <strong>Total:</strong> R${nfce.amount}
              </p>
              <p>
                <strong>Inserido:</strong>{' '}
                {format(new Date(nfce.createdAt), 'dd/MM/yyyy')}
              </p>
              <p>
                <Link href={nfce.sourceUrl} target="_blank">
                  Link fazenda
                </Link>
              </p>
            </Paper>
          ))}
      </TabPanel>
      <AppBar position="fixed">
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          aria-label="dashboard tabs"
        >
          <Tab label="Inserir" {...a11yProps(0)} />
          <Tab label="Listar" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
    </>
  );
};

export default Dashboard;
