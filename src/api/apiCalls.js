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

export const addNote = (note) => {
    return axios.post('/api/1.0/notes', note);
};

export const listNotes = (param = {page: 0, size: 100}) => {
    const path = `/api/1.0/notes?page=${param.page || 0}&size=${param.size || 100}`;
    return axios.get(path);
};

export const addCategory = (category) => {
    return axios.post('/api/1.0/categories', category);
};

export const listCategories = () => {
    return axios.get('/api/1.0/categories');
};

export const deleteCategory = (categoryId) => {
    return axios.delete('/api/1.0/categories/' + categoryId);
};

