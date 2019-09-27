import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import cloudinary from 'cloudinary-core';
import AppContext from '../../../contexts/AppContext';
import { actionLogout } from '../../../actions/authActions';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Hero = styled.section`
  min-height: 100vh;
  background: url('https://res.cloudinary.com/dif6rqidm/image/upload/v1568709608/wallpaper_clear_dark.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
`;
const ProfileSection = styled.section`
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
  position: relative;
  h1 {
    font-size: 2rem;
    text-align: center;
    font-family: Roboto;
    color: ${props => props.theme.color.white};
  }
`;
const Edit = styled.p`
  color: gray;
  font-size: 1rem;
  font-family: Roboto;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 50px;
  &:hover {
    color: ${props => props.theme.color.red};
  }
`;
const LineBreak = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  border: inset 1px rgb(0,0,0,0.2);
`;
const Field = styled.div`
  margin-left: 20px;
`;
const Title = styled.p`
  color: gray;
  font-size: 0.8rem;
  font-family: Roboto;
  font-weight: 700;
  margin-top: 30px;
`;
const Value = styled.p`
  margin: 10px 0;
  font-size: 1.2rem;
  font-family: Roboto;
  font-weight: 900;
  color: ${props => props.theme.color.white};
  word-break: break-word;
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
  background-color: black;
`;

export default function PageMyProfile() {

  const { t, toggleConnected } = useContext(AppContext);
  const authToken = localStorage.getItem('authToken');
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    avatarPublicId: '',
  });

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      try{
        const res = await axios.get(`/users?authToken=${authToken}`);
        const { username, email, firstName, lastName, avatarPublicId } = res.data.user;
        if (isSubscribed) {
          setUser({ username, email, firstName, lastName, avatarPublicId })
        }
      } catch(err) {
        console.log(err);
        if (err.response && err.response.status === 401) actionLogout(toggleConnected);
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken, toggleConnected]);

  return (
    <Hero>
      <ProfileSection>
        <Container>
          <Link to="/myProfileEdit">
            <Edit>{t.myProfile.edit}</Edit>
          </Link>
          <h1>{t.myProfile.profile}</h1>
          <AvatarContainer>
            <Avatar src={cloudinaryCore.url(user.avatarPublicId)}/>
          </AvatarContainer>
          <Field>
            <Title>{t.myProfile.username}</Title>
            <Value>{user.username}</Value>
          </Field>
          <LineBreak></LineBreak>
          <Field>
            <Title>{t.myProfile.email}</Title>
            <Value>{user.email}</Value>
          </Field>
          <LineBreak></LineBreak>
          <Field>
            <Title>{t.myProfile.firstName}</Title>
            <Value>{user.firstName}</Value>
          </Field>
          <LineBreak></LineBreak>
          <Field>
            <Title>{t.myProfile.lastName}</Title>
            <Value>{user.lastName}</Value>
          </Field>
        </Container>
      </ProfileSection>
    </Hero>
  );
}
