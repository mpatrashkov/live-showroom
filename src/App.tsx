import React from 'react';
import logo from './logo.svg';
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

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/showroom" exact>
                        <Showroom />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
