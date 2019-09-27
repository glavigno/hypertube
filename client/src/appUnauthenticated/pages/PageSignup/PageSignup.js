import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import HypertubeLogo from '../../../Logo';
import AppContext from '../../../contexts/AppContext';
import cloudinary from 'cloudinary-core';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Hero = styled.section`
  min-height: 100vh;
  background: url('https://res.cloudinary.com/dif6rqidm/image/upload/v1568709608/wallpaper_clear_dark.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
`;
const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;
const SignupSection = styled.section`
  display: flex;
  justify-content: center;
  padding: 10% 0;
`;
const FormContainer = styled.section`
  flex-basis: 400px;
  padding: 50px;
  background-color: ${props => props.theme.color.black};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.1);
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
  width: 50%;
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
const Login42 = styled.a`
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

const AvatarContainer = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Avatar = styled.img`
  height: 200px;
  width: 150px;
  object-fit:cover;
  border-radius: ${props => props.theme.borderRadius};
  margin: 0 auto;
`;
const UploadLabel = styled.label`
  text-decoration: none;
  cursor: pointer;
  border: none;
  display: grid;
  grid-template-columns: 2fr 8fr;
  align-items: center;
  text-align: center;
  padding: 15px 1px;
  margin: 20px auto;
  background-color: gray;
  width: 170px;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 0.9em;
  font-weight: bold;
  &:hover {
    background-color: #C50C15;
  }
`;

export default function PageSignup(props) {

  const { toggleConnected, socket } = useContext(AppContext);

  const [values, setValues] = useState({
    showPassword: false,
    email: null,
    firstName: null,
    lastName: null,
    username: null,
    password: null,
    emailError: false,
    firstNameError: false,
    lastNameError: false,
    usernameError: false,
    passwordError: false,
    emailHelper: null,
    firstNameHelper: null,
    lastNameHelper: null,
    passwordHelper: null,
    usernameHelper: null,
    avatarPublicId: null,
    avatarPublicIdError: false,
    avatarPublicIdHelper: null,
  });

  const valueIsOk = (name, value) => {
    const regex = {
      email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      firstName: /^[A-Za-zÀ-ÖØ-öø-ÿ-]{3,15}$/,
      lastName: /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,15}$/,
      username: /^[A-Za-zÀ-ÖØ-öø-ÿ]{5,10}$/,
      password: /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/,
    };
    return regex[name].test(String(value));
  };

  const valueError = nameArr => {    
    const errorMsg = {
      email: 'Enter a proper email',
      firstName: 'Between 3 and 15 characters, only letters and "-"',
      lastName: 'Between 3 and 15 characters, only letters',
      username: 'Between 6 and 10 characters, only letters',
      password: 'Minimum 6 characters, at least three of those four categories: uppercase, lowercase, number and special character',
      avatarPublicId: 'Please upload a picture',
    };
    const stateArr = nameArr.map(name => {return { [name]: null, [`${name+'Error'}`]: true, [`${name+'Helper'}`]: errorMsg[name] }});
    const state = stateArr.reduce((acc, curr) => {
      acc = {...acc, ...curr};
      return acc;
    }, {});
    setValues({ ...values, ...state });
  };

  const valueIsTaken = nameArr => {
    const stateArr = nameArr.map(name => {return { [name]: null, [`${name+'Error'}`]: true, [`${name+'Helper'}`]: `This ${name} is already used` }});
    const state = stateArr.reduce((acc, curr) => {
      acc = {...acc, ...curr};
      return acc;
    }, {});
    setValues({ ...values, ...state });
  };

  const emailIsUsedAsOAuth = provider => {
    setValues({ ...values, email: null, emailError: true, emailHelper: `This email is already used. Please login using your ${provider} account` });
  };

  const valueIsSet = (name, value) => {
    setValues({ ...values, [name]: value, [`${name+'Error'}`]: false, [`${name+'Helper'}`]: null });
  };

  const handleBlur = name => event => {
    if (valueIsOk(name, event.target.value)) {
      valueIsSet(name, event.target.value)
    } else {
      valueError([name]);
    }
  };

  const handleChange = name => event => {
    if (valueIsOk(name, event.target.value)) valueIsSet(name, event.target.value);
  };

  const toggleShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const newUser = { 
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        password: values.password,
        avatarPublicId: values.avatarPublicId,
      };
      const emptyFields = Object.keys(newUser).filter(key => !newUser[key]);
      if (emptyFields.length === 0) {
        axios.post(`/auth/signup`, newUser)
          .then(res => { props.history.push('/login'); })
          .catch(error => {
            const res = error.response.data;
            if (res.errors.length !== 0) valueError(res.errors);
            if (res.usedAsOAuth.length !== 0) emailIsUsedAsOAuth(res.usedAsOAuth);
            if (res.taken.length !== 0) valueIsTaken(res.taken);
          });
      } else {
        valueError(emptyFields);
      }
    } catch(error) {console.log(error);}
  }

  async function uploadAvatar(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result)
        let bytes = []
        uint.forEach((byte) => {
            bytes.push(byte.toString(16))
        })
        const hex = await bytes.join('').toUpperCase();
        if (file.size && file.size < 1000000 && (hex === '89504E47' || hex === 'FFD8FFE0')) {
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const image  = reader.result;
            const res = await axios.post(`/users/uploadAvatarSignup`, { image })
            setValues({ ...values, avatarPublicId: res.data.avatarPublicId, avatarPublicIdError: false, avatarPublicIdHelper: '' });
          }
        } else if (hex) {
            setValues({ ...values, avatarPublicId: null, avatarPublicIdError: true, avatarPublicIdHelper: 'Please upload a valid JPG or PNG picture less than 1Mo' });
        }
      }
    };
    if (file) {
      const blob = file.slice(0, 4);
      reader.readAsArrayBuffer(blob);
    }
  }

  const resetAvatarError = () => {
    setValues({ ...values, avatarPublicId: null, avatarPublicIdError: false, avatarPublicIdHelper: '' });
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
      <SignupSection>
        <FormContainer>
          <h1>Signup</h1>
          <AvatarContainer>
            <Avatar src={values.avatarPublicId ? cloudinaryCore.url(values.avatarPublicId) : 'http://res.cloudinary.com/dif6rqidm/image/upload/profilePlaceholder'}/>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="uploadFileButton"
              type="file"
              onChange={uploadAvatar}
              onClick={resetAvatarError}
            />
            <UploadLabel htmlFor="uploadFileButton"><FontAwesomeIcon style={{marginLeft: '10px', fontSize: '15px', color: 'white'}} icon={faImage}/> Upload a picture</UploadLabel>
            {values.avatarPublicIdError && <FormHelperText style={{color: '#ef3a2d'}} id="upload-helper-text">{values.avatarPublicIdHelper}</FormHelperText>}
          </AvatarContainer>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <StyledTextField
              id="standard-email"
              label="Email"
              onBlur={handleBlur('email')}
              onChange={handleChange('email')}
              error={values.emailError}
              helperText={values.emailHelper}
              margin="normal"
            />
            <StyledTextField
              id="standard-firstName"
              label="First Name"
              onBlur={handleBlur('firstName')}
              onChange={handleChange('firstName')}
              error={values.firstNameError}
              helperText={values.firstNameHelper}
              margin="normal"
            />
            <StyledTextField
              id="standard-lastName"
              label="Last Name"
              onBlur={handleBlur('lastName')}
              onChange={handleChange('lastName')}
              error={values.lastNameError}
              helperText={values.lastNameHelper}
              margin="normal"
            />
            <StyledTextField
              id="standard-username"
              label="Username"
              onBlur={handleBlur('username')}
              onChange={handleChange('username')}
              error={values.usernameError}
              helperText={values.usernameHelper}
              margin="normal"
            />
            <FormControl>
              <StyledInputLabel htmlFor="adornment-password">Password</StyledInputLabel>
              <StyledInput
                id="standard-password"
                type={values.showPassword ? 'text' : 'password'}
                onBlur={handleBlur('password')}
                onChange={handleChange('password')}
                error={values.passwordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" onClick={toggleShowPassword}>
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText style={{color: '#ef3a2d'}} id="password-helper-text">{values.passwordHelper}</FormHelperText>
            </FormControl>
            <SubmitButton type="submit">
              <p>Signup</p>
            </SubmitButton>
          </Form>
          <LineBreak></LineBreak>
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
          <Redirect>
            <p>Already a member ? <Link to="/login">Login here</Link></p>
          </Redirect>
        </FormContainer>
      </SignupSection>
    </Hero>
  );
}
