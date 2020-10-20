import styled from 'styled-components';
import MuiAvatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

export const Container = styled.div`
  margin-top: ${props => props.theme.spacing(8)}px;
  display: flex;
  flex-direction: column;
  align-items: center;

  form {
    width: 100%;
    margin-top: ${props => props.theme.spacing(1)}px;
  }
`;

export const Avatar = styled(MuiAvatar)`
  margin: ${props => props.theme.spacing(1)}px;
  background-color: ${props => props.theme.palette.secondary.main};
`;

export const SubmitButton = styled(Button)`
  margin: ${props => props.theme.spacing(3, 0, 2)};
`;
