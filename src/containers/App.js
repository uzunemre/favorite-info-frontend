import React from 'react';
import {Route, Switch} from 'react-router-dom';
import TopBar from '../components/TopBar';
import HomePage from "../pages/HomePage";
import UserSignupPage from "../pages/UserSignUpPage";
import LoginPage from '../pages/LoginPage';
import {CategoryAddPage} from "../pages/CategoryAddPage";

function App() {
    return (
        <div>
            <TopBar/>
            <div className="container">
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/signup" component={UserSignupPage}/>
                    <Route path="/addCategory" component={CategoryAddPage}/>
                </Switch>
            </div>
        </div>
    );
}

export default App;
