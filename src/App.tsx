import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from './pages/home/Home';
import Header from './components/header/Header';
import Showroom from './pages/showroom/Showroom';
import AddModel from './pages/add-models/AddModel';
import AddMaterial from './pages/add-material/AddMaterial';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import { UserProvider } from './contexts/user-context';
import Playground from './pages/playground/Playground';

interface AppState {
    user: any
}

class App extends React.Component<{}, AppState> {
    constructor(props) {
        super(props)

        this.state = {
            user: {
              isLoggedIn: localStorage.getItem("token") !== null,
              isAdmin: localStorage.getItem('isAdmin'),
              username: localStorage.getItem('username') || '',
              userId: localStorage.getItem('userId') || '',
              updateUser: this.updateUser
            }
          }
    }

    updateUser = (user) => {
        this.setState({
          user
        })
      }

    render() {
        return (
            <Router>
                <UserProvider value={{ user: this.state.user, updateUser: this.updateUser, isAdmin: this.state.user.isAdmin, username: this.state.user.username, userId: this.state.user.userId, isLoggedIn: this.state.user.isLoggedIn }}>
                <div className="App">
                    <Header />
                    <Switch>
                        <Route path="/" exact>
                            <Home />
                        </Route>
                        <Route path="/showroom" exact>
                            <Showroom />
                        </Route>
                        <Route path="/playground" exact>
                            <Playground />
                        </Route>
                        <Route path="/add/model" exact>
                            <AddModel />
                        </Route>
                        <Route path="/add/material" exact>
                            <AddMaterial />
                        </Route>
                        <Route path="/signin" exact>
                            <Login />
                        </Route>
                        <Route path="/signup" exact>
                            <Register />
                        </Route>
                    </Switch>
                </div>
                </UserProvider>
            </Router>
        );
    }
}

export default App;
