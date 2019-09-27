import React, { useState, useEffect, Fragment } from 'react';
import StyledCompTheme from './StyledCompTheme.json';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AppProvider } from './contexts/AppContext';
import UnauthenticatedSwitch from './appUnauthenticated/UnauthenticatedSwitch';
import AuthenticatedSwitch from './appAuthenticated/AuthenticatedSwitch';
import { actionIsAuthenticated } from './actions/authActions';
import Header from './appAuthenticated/Header/Header';
import { BrowserRouter } from 'react-router-dom';
import EN from './translations/EN.json';
import FR from './translations/FR.json';
import ES from './translations/ES.json';
import DE from './translations/DE.json';
import RU from './translations/RU.json';
import axios from 'axios';
import io from 'socket.io-client';
import { actionLogout } from './actions/authActions';

const GlobalStyles = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
    font-family: 'Roboto', sans-serif;
  }
`;

function App(props) {
  const [connected, setConnected] = useState(false);
  const [currentMovieInfo, setCurrentMovieInfo] = useState(false);
  const [socket, setSocket] = useState(null);
  const [locale, setLocale] = useState('EN');
  const [t, setT] = useState(EN);
  const authToken = localStorage.getItem('authToken');

  const appState = {
    connected,
    setConnected,
    toggleConnected: () => {setConnected(!connected)},
    t,
    setT,
    EN,
    FR,
    ES,
    DE,
    RU,
    locale,
    setLocale,
    socket,
    currentMovieInfo,
    setCurrentMovieInfo
  };

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('connect', () => {
      // console.log(socket.id);
      setSocket(socket);
    });
  }, [])
 
  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      try {
        const userIsAuthenticated = await actionIsAuthenticated(authToken);
        if (isSubscribed && userIsAuthenticated === true) setConnected(true);
      } catch(e) {
        if (isSubscribed) setConnected(false)
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken]);

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      try {
        const res = await axios.get(`/users/getLocale?authToken=${authToken}`);
        if (res.data.locale === 'FR' && isSubscribed) setT(FR);
        if (res.data.locale === 'ES' && isSubscribed) setT(ES);
        if (res.data.locale === 'DE' && isSubscribed) setT(DE);
        if (res.data.locale === 'RU' && isSubscribed) setT(RU);
        setLocale(res.data.locale);
      } catch(err) {
        console.log(err);
        if (err.response && err.response.status === 401) actionLogout(appState.toggleConnected);
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken, appState.toggleConnected]);

  return (
    <Fragment>
      <GlobalStyles />
      <AppProvider value={appState}>
        <ThemeProvider theme={StyledCompTheme}>
          <BrowserRouter>
          {!connected ? <UnauthenticatedSwitch /> 
            :
            <div>
              <Header /> 
              <AuthenticatedSwitch /> 
            </div>
          }
          </BrowserRouter>
        </ThemeProvider>
      </AppProvider>
    </Fragment>
  );
}

export default App;
