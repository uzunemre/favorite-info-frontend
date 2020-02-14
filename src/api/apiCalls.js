import axios from 'axios';

export const setAuthorizationHeader = ({username, password, isLoggedIn}) => {
    if (isLoggedIn) {
        axios.defaults.headers.common['Authorization'] = `Basic ${btoa(
            username + ':' + password
        )}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const signup = (user) => {
    return axios.post('/api/1.0/users', user);
};

export const login = (user) => {
    return axios.post('/api/1.0/login', {}, {auth: user});
};

export const addCategory = (category) => {
    return axios.post('/api/1.0/categories', category);
};
