import axios from 'axios';
import {isEmpty} from "../utils/utils";

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

export const getNote = (id) => {
    return axios.get(`/api/1.0/notes/${id}`);
};

export const saveNote = (note) => {
    if (isEmpty(note.id)) {
        return addNote(note);
    } else {
        return updateNote(note);
    }
};

export const addNote = (note) => {
    return axios.post('/api/1.0/notes', note);
};

export const updateNote = (note) => {
    return axios.put('/api/1.0/notes/' + note.id, note);
};

export const deleteNote = (noteId) => {
    return axios.delete('/api/1.0/notes/' + noteId);
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

