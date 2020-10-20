import React, { useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import LinkIcon from '@material-ui/icons/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { Container, Avatar, SubmitButton } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useSnackbar } from '../../hooks/snackbar';
import api from '../../services/api';
import Input from '../../components/Input';

interface FormData {
  url: string;
}

interface Nfce {
  accessKey: string;
}

const Dashboard: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { user, signOut } = useAuth();
  const { createSnackbar } = useSnackbar();

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

  return (
    <Container>
      <Avatar>
        <LinkIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Bem vindo - {user.name}
      </Typography>
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
    </Container>
  );
};

export default Dashboard;
