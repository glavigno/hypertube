import React, { useEffect, useState, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import AppContext from '../../../contexts/AppContext';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Modal from '@material-ui/core/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { actionLogin } from '../../../actions/authActions';
import HypertubeLogo from '../../../Logo';

const Hero = styled.section`
  min-height: 100vh;
  background: url('https://res.cloudinary.com/dif6rqidm/image/upload/v1568709608/wallpaper_clear_dark.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  position: relative;
`;
const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;
const LoginSection = styled.section`
  display: flex;
  justify-content: center;
  padding: 10% 0;
`;
const FormContainer = styled.section`
  flex-basis: 400px;
  padding: 50px;
  background-color: ${props => props.theme.color.black};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0px 42px 60px rgba(0, 0, 0, 0.25);
  h1 {
    font-size: 2rem;
    text-align: center;
    font-family: Roboto;
    color: ${props => props.theme.color.white};
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const SubmitButton = styled.button`
  text-decoration: none;
  cursor: pointer;
  border: none;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  background-color: ${props => props.theme.color.red};
  width: 150px;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 1.1em;
  font-weight: medium;
  &:hover {
    background-color: #C50C15;
  }
`;
const LineBreak = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  border: inset 1px rgb(0,0,0,0.2);
`;
const Login42 = styled.div`
  cursor: pointer;
  padding: 3px;
  text-decoration: none;
  border: none;
  display: grid;
  grid-template-columns: 2fr 8fr;
  align-items: center;
  height: 60px;
  margin: 0 auto;
  margin-top: 40px;
  background-color: #DBDBDB;
  width: 280px;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius};
  color: black;
  font-family: Roboto;
  font-size: 1em;
  font-weight: 500;
  &:hover {
    background-color: #BFBFBF;
  }
`;
const TextButton = styled.p`
  text-align: left;
  margin-left: 20px;
`;
const LoginGoogle = styled.a`
  cursor: pointer;
  padding: 3px;
  text-decoration: none;
  border: none;
  display: grid;
  grid-template-columns: 2fr 8fr;
  align-items: center;
  height: 60px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: #4081EC;
  width: 280px;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 1em;
  font-weight: 500;
  &:hover {
    background-color: #1F62CF;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.color.white};
  border-radius: 3px;
  height: 100%;
`;
const Redirect = styled.section`
  margin-top: 100px;
  color: ${props => props.theme.color.textGrey};
  font-weight: 500;
  text-align: center;
  a {
    text-decoration: none;
    color: ${props => props.theme.color.textGrey};
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    text-decoration: underline;
    &:hover {
      color: ${props => props.theme.color.red};
    }
  }
`;
const ResetButton = styled.span`
  color: ${props => props.theme.color.textGrey};
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.color.red};
  }
`;
const ModalSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  outline: none;
`;
const ModalContainer = styled.section`
  flex-basis: 550px;
  padding: 50px;
  background-color: ${props => props.theme.color.black};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0px 42px 60px rgba(0, 0, 0, 0.25);
  outline: none;
  color: ${props => props.theme.color.white};
  h1 {
    font-size: 1.5rem;
    text-align: center;
    font-family: Roboto;
  }
`;

const StyledTextField = styled(TextField) `
  label {
    color: ${props => props.theme.color.white};
    &.MuiFormLabel-root.Mui-focused {
      color: ${props => props.theme.color.white};
    }
  }
  div {
    color: ${props => props.theme.color.white};
    &::after {
      border-bottom: 2px solid ${props => props.theme.color.white};
    }
  }
`;
const StyledInputLabel = styled(InputLabel) `
  label {
    color: ${props => props.theme.color.white};
  }
  &.MuiFormLabel-root {
    color: ${props => props.theme.color.white};
  }
  &.MuiFormLabel-root.Mui-focused {
    color: ${props => props.theme.color.white};
  }
`;
const StyledInput = styled(Input) `
  input {
    color: ${props => props.theme.color.white};
  }
  div {
    button {
      color: ${props => props.theme.color.white};
    }
  }
  &.MuiInput-underline::after {
    border-bottom: 2px solid ${props => props.theme.color.white};
  }
`;

const ErrorBox = styled.section`
  background-color: ${props => props.theme.color.ultraLightRed};
  color: red;
  padding: 5px;
  width: 60%;
  border: solid 0.5px red;
  border-radius: ${props => props.theme.borderRadius};
  margin: 0 auto;
  margin-top: 40px;
  text-align: center;
  p {
    font-size: 0.8rem;
  }
`;

export default function PageLogin(props) {

  const { toggleConnected, socket } = useContext(AppContext);
  const [values, setValues] = useState({
    username: '',
    password: '',
    email: '',
    resetPasswordError: false,
    resetPasswordHelper: null,
    showPassword: false,
    error: false,
    errorMsg: '',
    resetPasswordSubmited: false,
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleFocus = () => {
    setValues({ ...values, resetPasswordError: false, resetPasswordHelper: '', error: false });
  };
  const toggleShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleSubmit = async event => {
    try {
      event.preventDefault();
      const credentials = {username: values.username, password: values.password};
      const res = await axios.post(`/auth/login`, credentials);
      if (res.data.authToken) {
        await actionLogin(res.data.authToken);
        props.history.push('/home');
        toggleConnected();
      }
    } catch(err) {
      if (err.response && err.response && err.response.data) {
        setValues({ ...values, error: true, errorMsg: err.response.data.errorMsg});
      }
    }
  };

  const emailIsOk = email => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email));
  }

  const handleResetPasswordSubmit = event => {
    event.preventDefault();
    if (!emailIsOk(values.email)) {
      setValues({ ...values, resetPasswordError: true, resetPasswordHelper: 'Enter a proper email' });
    } else {
      try {
        axios.post(`/users/resetPasswordEmail`, {email: values.email})
        setValues({ ...values, resetPasswordSubmited: true });
      } catch(err) {
        console.log(err);
      }
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleEmailBlur = event => {
    if (!emailIsOk(event.target.value)) {
      setValues({ ...values, resetPasswordError: true, resetPasswordHelper: 'Enter a proper email' });
    }
  };

  useEffect(() => {
    return () => {if (socket) socket.off('redirect')};
  }, [socket])

  const startOAuth = provider => {
    const popup = window.open(`http://localhost:5000/api/auth/${provider}?socketId=${socket.id}`, '');
    if (socket) {
      socket.on('redirect', data => {
        // console.log('redirect OK');
        // console.log(data.authToken);
        localStorage.setItem('authToken', data.authToken);
        toggleConnected();
        popup.close();
      });
    }
  }

  return (
    <Hero>
      <LogoContainer>
        <HypertubeLogo />
      </LogoContainer>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
      >
      <ModalSection>
        <ModalContainer>
          <p style={{textAlign: 'right'}}>
            <FontAwesomeIcon 
              style={{color: 'lightgray', cursor: 'pointer'}}
              icon={faTimes}
              onClick={handleClose}
            />
          </p>
          {values.resetPasswordSubmited && 
            <Fragment>
              <h1>Check your inbox <span aria-label="Inbox" role="img" >📥</span></h1>
              <p style={{textAlign: 'center', justify: 'center'}}>
                If the address "{values.email}" is related to a Matcha account, an email has been sent to reset your password.
              </p>
            </Fragment>
          }
          {!values.resetPasswordSubmited && 
          <Fragment>
            <h1>Forgot Password</h1>
            <p>We will send you an email with instructions on how to reset your password.</p>
            <Form noValidate autoComplete="off" onSubmit={handleResetPasswordSubmit}>
              <StyledTextField
                id="standard-email"
                label="Email"
                required={true}
                onChange={handleChange('email')}
                onFocus={handleFocus}
                onBlur={handleEmailBlur}
                error={values.resetPasswordError}
                helperText={values.resetPasswordHelper}
                margin="normal"
              />
              <SubmitButton type="submit">
                <p>Email me</p>
              </SubmitButton>
            </Form>
          </Fragment>
          }
        </ModalContainer>
      </ModalSection>
      </Modal>
      <LoginSection>
        <FormContainer>
          <h1>Login</h1>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <StyledTextField
              id="standard-username"
              label="Username"
              value={values.username}
              onChange={handleChange('username')}
              onFocus={handleFocus}
              margin="normal"
            />
            <FormControl>
              <StyledInputLabel htmlFor="adornment-password">Password</StyledInputLabel>
              <StyledInput
                id="standard-password"
                type={values.showPassword ? 'text' : 'password'}
                onChange={handleChange('password')}
                onFocus={handleFocus}
                error={values.passwordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" onClick={toggleShowPassword}>
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{color: 'red'}} id="password-helper-text">{values.passwordHelper}</FormHelperText>
            </FormControl>
            { values.error && 
              <ErrorBox>
                <p> <span aria-label="Attention" role="img" >⚠️</span> {values.errorMsg}</p>
              </ErrorBox>
            }
            <SubmitButton type="submit">
              <p>Login</p>
            </SubmitButton>
          </Form>
          <LineBreak></LineBreak>
          {socket && 
            <Fragment>
              <Login42 onClick={() => startOAuth('42')}>
                <Logo>
                  <img width="30px" alt="42 &quot;G&quot; Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"/>
                </Logo>
                <TextButton>Continue with 42</TextButton>
              </Login42>
              <LoginGoogle onClick={() => startOAuth('google')}>
                <Logo>
                  <img width="30px" alt="Google &quot;G&quot; Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"/>
                </Logo>
                <TextButton>Continue with Google</TextButton>
              </LoginGoogle>
            </Fragment>
          }
          <Redirect>
            <p>Forgot your password ? <ResetButton onClick={handleOpen}>Reset via your email</ResetButton></p>
            <p>Not a member yet ? <Link to="/signup">Signup now</Link></p>
          </Redirect>
        </FormContainer>
      </LoginSection>
    </Hero>
  );
}