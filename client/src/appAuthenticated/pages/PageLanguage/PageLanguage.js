import React, { useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import AppContext from '../../../contexts/AppContext';
import { actionLogout } from '../../../actions/authActions';

const Hero = styled.section`
  min-height: 100vh;
  background: url('https://res.cloudinary.com/dif6rqidm/image/upload/v1568709608/wallpaper_clear_dark.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
`;
const LoginSection = styled.section`
  display: flex;
  justify-content: center;
  padding-top: 10%;
`;
const FormContainer = styled.section`
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

const LanguagesSection = styled.section`

`;
const Language = styled.div`
  display: grid;
  grid-template-columns: 2fr 8fr 2fr;
  align-content: center;
  width: 90%;
  border-radius: ${props => props.theme.borderRadius};
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  :hover {
    background-color: dimGray;
  }
`;
const LanguageTitle = styled.p`
  color: white;
  align-self: center;
  font-size: 1rem;
  font-family: Roboto;
  font-weight: 700;
  margin-left: 30px;
`;
const Flag = styled.img`
  width: 60px;
`;


export default function PageLanguage() {

  const { t, setT, EN, FR, ES, DE, RU, setLocale, locale, toggleConnected } = useContext(AppContext);

  const authToken = localStorage.getItem('authToken');

  const handleChangeLanguage = async newLocale => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      if (newLocale === 'EN') setT(EN);
      if (newLocale === 'FR') setT(FR);
      if (newLocale === 'ES') setT(ES);
      if (newLocale === 'DE') setT(DE);
      if (newLocale === 'RU') setT(RU);
      try {
        axios.post(`/users/setLocale?authToken=${authToken}`, { newLocale });
      } catch(err) {
        console.log(err);
        if (err.response && err.response.status === 401) actionLogout(toggleConnected);
      }
    }
  };

  return (
    <Hero>
      <LoginSection>
        <FormContainer>
          <h1>{t.language.chooseALanguage}</h1>
          <LanguagesSection>
            <Language 
              onClick={() => handleChangeLanguage('EN')} 
              style={locale === 'EN' ? {backgroundColor: 'dimGray'} : {}}
            >
              <Flag src={'http://res.cloudinary.com/dif6rqidm/image/upload/united-kingdom'}></Flag>
              <LanguageTitle>{t.language.english}</LanguageTitle>
            </Language>
            <Language 
              onClick={() => handleChangeLanguage('FR')} 
              style={locale === 'FR' ? {backgroundColor: 'dimGray'} : {}}
            >
              <Flag src={'http://res.cloudinary.com/dif6rqidm/image/upload/france'}></Flag>
              <LanguageTitle>{t.language.french}</LanguageTitle>
            </Language>
            <Language 
              onClick={() => handleChangeLanguage('ES')} 
              style={locale === 'ES' ? {backgroundColor: 'dimGray'} : {}}
            >
              <Flag src={'http://res.cloudinary.com/dif6rqidm/image/upload/spain'}></Flag>
              <LanguageTitle>{t.language.spanish}</LanguageTitle>
            </Language>
            <Language 
              onClick={() => handleChangeLanguage('DE')} 
              style={locale === 'DE' ? {backgroundColor: 'dimGray'} : {}}
            >
              <Flag src={'http://res.cloudinary.com/dif6rqidm/image/upload/germany'}></Flag>
              <LanguageTitle>{t.language.german}</LanguageTitle>
            </Language>
            <Language 
              onClick={() => handleChangeLanguage('RU')} 
              style={locale === 'RU' ? {backgroundColor: 'dimGray'} : {}}
            >
              <Flag src={'http://res.cloudinary.com/dif6rqidm/image/upload/russia'}></Flag>
              <LanguageTitle>{t.language.russian}</LanguageTitle>
            </Language>
          </LanguagesSection>
        </FormContainer>
      </LoginSection>
    </Hero>
  );
}
