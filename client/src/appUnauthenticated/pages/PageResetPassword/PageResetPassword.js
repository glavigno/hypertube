import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
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
const Section = styled.section`
  display: flex;
  justify-content: center;
  padding-top: 10%;
`;
const Container = styled.section`
  flex-basis: 400px;
  padding: 50px;
  background-color: ${props => props.theme.color.black};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.1);
  color: ${props => props.theme.color.white};
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
  border: none;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  background-color: ${props => props.theme.color.red};
  width: 50%;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 1em;
`;
const Redirect = styled.section`
  color: black;
  font-weight: 500;
  text-align: center;
  a {
    text-decoration: none;
    color: white;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    text-decoration: underline;
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

export default function PageResetPassword(props) {
  const [isError, setIsError] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelper, setPasswordHelper] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    if (passwordIsOk(password)) {
      const params = { 
        emailHash: props.match.params.emailHash,
        newPassword: password,
      };
      axios.post(`/users/resetPassword`, params)
      .then(res => { if (res.status === 200) setIsSuccess(true); })
      .catch(error => {
        if (error.response.status === 401) {
          setIsError(true);
        } else {
          setPasswordError(true);
          setPasswordHelper('Minimum 6 characters, at least three of those four categories: uppercase, lowercase, number and special character');
        }
      })
    }
  };

  const passwordIsOk = password => {
    const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
    return regex.test(String(password));
  }

  const handleBlur = event => {
    if (!passwordIsOk(event.target.value)) {
      setPasswordError(true);
      setPasswordHelper('Minimum 6 characters, at least three of those four categories: uppercase, lowercase, number and special character');
    } else {
      setPasswordError(false);
      setPasswordHelper('');
    }
  };
  const handleChange = event => setPassword(event.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      try {
        await axios.post('/users/emailHashIsValid', {emailHash: props.match.params.emailHash});
        if (isSubscribed) setIsError(false);
      } catch(error) {}
      if (isSubscribed) setIsLoading(false);
    }
    fetchData();
    return () => isSubscribed = false;
  }, [props.match.params.emailHash]);

  return (
    <Hero>
      <LogoContainer>
        <HypertubeLogo />
      </LogoContainer>
      <Section>
        <Container>
        {!isLoading && isError && 
          <Fragment>
            <h1>Sorry but the link you provided is not working</h1>
            <Redirect>
              <p><Link to="/login">Login</Link></p>
            </Redirect>
          </Fragment>
        }
        {!isLoading && isSuccess &&
          <Fragment>
            <h1>Your new password has been set</h1>
            <Redirect>
              <p><Link to="/login">Login</Link></p>
            </Redirect>
          </Fragment>
        }
        {!isLoading && !isError && !isSuccess && 
          <Fragment>
            <h1>Reset your password</h1>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <FormControl required={true}>
                <StyledInputLabel htmlFor="adornment-password">New Password</StyledInputLabel>
                <StyledInput
                  id="standard-password"
                  type={showPassword ? 'text' : 'password'}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={passwordError}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="Toggle password visibility" onClick={toggleShowPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText style={{color: 'red'}} id="password-helper-text">{passwordHelper}</FormHelperText>
              </FormControl>
              <SubmitButton type="submit">
                <p>Change password</p>
              </SubmitButton>
            </Form>
          </Fragment>
        }
        </Container>
      </Section>
    </Hero>
  );
}