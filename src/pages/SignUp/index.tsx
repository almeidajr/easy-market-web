import React, { useRef, useCallback } from 'react';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Container, Avatar, SubmitButton } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useSnackbar } from '../../hooks/snackbar';
import api from '../../services/api';
import Input from '../../components/Input';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const { createSnackbar } = useSnackbar();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          email: Yup.string()
            .required('Campo obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        createSnackbar({
          severity: 'info',
          message: 'Você já pode efetuar seu login',
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        createSnackbar({
          severity: 'error',
          message: 'Ocorreu um erro ao realizar o cadastro',
        });
      }
    },
    [createSnackbar, history],
  );

  return (
    <Container>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Criar conta
      </Typography>
      <Form ref={formRef} onSubmit={handleSubmit} noValidate>
        <Input
          autoComplete="name"
          name="name"
          variant="outlined"
          required
          fullWidth
          id="name"
          label="Nome completo"
          autoFocus
        />
        <Input
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-mail"
          name="email"
          autoComplete="email"
        />
        <Input
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Senha"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Entrar
        </SubmitButton>
        <Grid container justify="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/" variant="body2">
              Já é cadastrado? Efetuar login
            </Link>
          </Grid>
        </Grid>
      </Form>
    </Container>
  );
};

export default SignIn;
