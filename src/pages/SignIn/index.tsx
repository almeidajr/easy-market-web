import React, { useRef, useCallback } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const history = useHistory();
  const { createSnackbar } = useSnackbar();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Campo obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
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
          message: 'Ocorreu um erro de comunicação com o servidor',
        });
      }
    },
    [createSnackbar, history, signIn],
  );

  return (
    <Container>
      <Avatar>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Fazer login
      </Typography>
      <Form ref={formRef} onSubmit={handleSubmit} noValidate>
        <Input
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-mail"
          name="email"
          autoComplete="email"
          autoFocus
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
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Lembrar de mim"
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Entrar
        </SubmitButton>
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/" variant="body2">
              Esqueceu sua senha?
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="sign-up/" variant="body2">
              Criar conta
            </Link>
          </Grid>
        </Grid>
      </Form>
    </Container>
  );
};

export default SignIn;
