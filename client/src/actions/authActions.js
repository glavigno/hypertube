const axios = require('axios');

const actionLogin = (authToken) => {
    localStorage.removeItem('authToken');
    localStorage.setItem('authToken', authToken);
    return;
};

const actionIsAuthenticated = async authToken => {
    if (authToken) {
        try {
            await axios.get(`/auth/userIsAuthenticated?authToken=${authToken}`);
            return true;
        } catch(err) {
            return false;
        }
    } else {
        return false;
    }
};

const actionLogout = (toggleConnected) => {
    localStorage.removeItem('authToken');
    toggleConnected();
    return;
};

module.exports = {
    actionLogin,
    actionIsAuthenticated,
    actionLogout,
};
