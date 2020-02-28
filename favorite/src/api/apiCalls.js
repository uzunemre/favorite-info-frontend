import axios from 'axios';
import {isEmpty} from "../utils/utils";


var axiosInstance = axios.create({
    baseURL: 'https://favorite-info-backend.herokuapp.com',
    /* other custom settings */
});

export const setAuthorizationHeader = ({username, password, isLoggedIn}) => {
    if (isLoggedIn) {
        axiosInstance.defaults.headers.common['Authorization'] = `Basic ${btoa(
            username + ':' + password
        )}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export const signup = (user) => {
    return axiosInstance.post('/api/1.0/users', user);
};

export const login = (user) => {
    return axiosInstance.post('/api/1.0/login', {}, {auth: user});
};

export const getNote = (id) => {
    return axiosInstance.get(`/api/1.0/notes/${id}`);
};

export const getRandomNote = () => {
    return axiosInstance.get(`/api/1.0/notes/random-note`);
};

export const saveNote = (note) => {
    if (isEmpty(note.id)) {
        return addNote(note);
    } else {
        return updateNote(note);
    }
};

export const addNote = (note) => {
    return axiosInstance.post('/api/1.0/notes', note);
};

export const updateNote = (note) => {
    return axiosInstance.put('/api/1.0/notes/' + note.id, note);
};

export const deleteNote = (noteId) => {
    return axiosInstance.delete('/api/1.0/notes/' + noteId);
};

export const getNotes = (param = {page: 0, size: 100}) => {
    const path = `/api/1.0/notes?page=${param.page || 0}&size=${param.size || 100}`;
    return axiosInstance.get(path);
};

export const addCategory = (category) => {
    return axiosInstance.post('/api/1.0/categories', category);
};

export const getCategories = () => {
    return axiosInstance.get('/api/1.0/categories');
};

export const deleteCategory = (categoryId) => {
    return axiosInstance.delete('/api/1.0/categories/' + categoryId);
};

