import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import "./header.scss"
import withUserContext from '../../hocs/WithUserContext';

interface HeaderProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: any,
    isLoggedIn: boolean
}

class Header extends React.Component<HeaderProperties> {
    render() {
        return (
            <div className="header">
                <div className="site-logo"><Icon type="solution" /> LIVE SHOWROOM</div>
                <Menu className="site-nav" mode="horizontal">
                    {
                        this.props.isLoggedIn ? (
                            <Menu.Item>
                                <span>Welcome, {this.props.username}!</span>
                            </Menu.Item>
                        ) : null
                    }
                    <Menu.Item>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/showroom">Showroom</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/playground">Playground</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/shop">Shop</Link>
                    </Menu.Item>
                    {
                        this.props.isAdmin === "true" ? (
                            <Menu.Item>
                                <Link to="/add/model">Add Model</Link>
                            </Menu.Item>
                        ) : null
                    }
                    {
                        this.props.isAdmin === "true" ? (
                            <Menu.Item>
                                <Link to="/add/material">Add Material</Link>
                            </Menu.Item>
                        ) : null
                    }
                    {
                        this.props.isLoggedIn ? (
                            <Menu.Item>
                                <a href="#" onClick={(e) => { e.preventDefault(); localStorage.clear(); window.location.href = "/signin" }}>Log out</a>
                            </Menu.Item>
                        ) : (
                                <Menu.Item>
                                    <Link to="/signin">Sign In</Link>
                                </Menu.Item>
                            )
                    }
                    {
                        this.props.isLoggedIn ? null : (
                            <Menu.Item>
                                <Link to="/signup">Sign Up</Link>
                            </Menu.Item>
                        )
                    }
                </Menu>
            </div>
        )
    }
}

export default withUserContext(Header)