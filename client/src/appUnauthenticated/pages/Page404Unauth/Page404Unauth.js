import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import HypertubeLogo from '../../../Logo';

const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;
const Hero = styled.section`
  min-height: 100vh;
  background: url('https://res.cloudinary.com/dif6rqidm/image/upload/v1568709608/wallpaper_shining_carpet_dark.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
`;
const Container = styled.section`
  margin-top: 20%;
  text-align: center;
  p {
    color: white;
    font-size: 1.6em;
    font-weight: 700;
    font-family: Roboto;
  }
`;
const Title = styled.h1`
  color: white;
  font-size: 10em;
  font-weight: 100;
  font-family: Roboto;
  margin-bottom: 50px;
`;
const Nothing = styled.h2`
  color: white;
  font-size: 1.3em;
  font-weight: 100;
  font-family: Roboto;
`;
const LoginLink = styled(Link)`
  cursor: pointer;
  border: none;
  color: white;
`;

export default function Page404Unauth(props) {

  return (
    <Hero>
      <LogoContainer>
        <HypertubeLogo />
      </LogoContainer>
      <Container>
        <Title>404</Title>
        <Nothing>There's nothing here</Nothing>
        <p>Go back to <LoginLink to="/login">Login</LoginLink></p>
      </Container>
    </Hero>
  );
}