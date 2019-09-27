import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageLogin from './pages/PageLogin/PageLogin';
import PageSignup from './pages/PageSignup/PageSignup';
import Page404Unauth from './pages/Page404Unauth/Page404Unauth';
import PageResetPassword from './pages/PageResetPassword/PageResetPassword';
import PageConfirmAccount from './pages/PageConfirmAccount/PageConfirmAccount';

const UnauthenticatedSwitch = () => (
    <Switch>
        <Route exact path='/' component={PageLogin}/>
        <Route exact path='/login' component={PageLogin}/>
        <Route exact path='/signup' component={PageSignup}/>
        <Route exact path='/resetPassword/:emailHash' component={PageResetPassword}/>
        <Route exact path='/confirm/:emailHash' component={PageConfirmAccount}/>
        <Route component={Page404Unauth}/>
    </Switch>
);

export default UnauthenticatedSwitch;
