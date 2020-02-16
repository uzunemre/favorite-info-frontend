import React from 'react';
import {Route, Switch} from 'react-router-dom';
import TopBar from '../components/TopBar';
import HomePage from "../pages/HomePage";
import UserSignupPage from "../pages/UserSignUpPage";
import LoginPage from '../pages/LoginPage';
import {CategoryEditPage} from "../pages/CategoryEditPage";
import {NoteEditPage} from "../pages/NoteEditPage";

function App() {
    return (
        <div>
            <TopBar/>
            <div className="container">
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/signup" component={UserSignupPage}/>
                    <Route path="/categories" component={CategoryEditPage}/>
                    <Route path="/notes" component={NoteEditPage}/>
                </Switch>
            </div>
        </div>
    );
}

export default App;
