import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import "./header.scss"

export default class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <div className="site-logo"><Icon type="solution" /> LIVE SHOWROOM</div>
                <Menu className="site-nav" mode="horizontal">
                    <Menu.Item>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/showrrom">Showroom</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/playground">Playground</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/shop">Shop</Link>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}