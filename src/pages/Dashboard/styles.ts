import styled from 'styled-components';
import MuiAvatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import MuiPaper from '@material-ui/core/Paper';

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

export const Paper = styled(MuiPaper)`
  width: 100%;
  padding: ${props => props.theme.spacing(3, 3)};

  & + div {
    margin-top: ${props => props.theme.spacing(3)}px;
  }
`;
