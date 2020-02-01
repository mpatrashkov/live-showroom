import React from 'react';
import './login.scss';
import { Form, Icon, Input, Button, message } from 'antd';
import { Link, Redirect } from 'react-router-dom'
import withUserContext from '../../hocs/WithUserContext';
import { serverUrl } from '../../config/config';

interface LoginStateInterface {
    username: string,
    password: string
}

interface LoginProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: boolean,
    isLoggedIn: boolean
}

class Login extends React.Component<LoginProperties, LoginStateInterface> {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: ''
        }
    }

    onPasswordChange = (e: any) => {
        this.setState({
            password: e.target.value
        })
    }

    onUsernameChange = (e: any) => {
        this.setState({
            username: e.target.value
        })
    }

    onSubmit = async (e: any) => {
        e.preventDefault();
        let data = await fetch(`${serverUrl}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        let result = await data.json()
        if (result.token) {

            localStorage.setItem('isAdmin', result.isAdmin)
            localStorage.setItem('token', result.token)
            localStorage.setItem('username', result.username)
            localStorage.setItem('userId', result.userId)

            const { updateUser } = this.props
            updateUser({
                isAdmin: localStorage.getItem('isAdmin'),
                isLoggedIn: true,
                username: result.username,
                userId: result.userId
            })
        } else {
            message.error(result.message)
        }
    }

    render() {
        if (this.props.isLoggedIn) {
            return (
                <Redirect to="/" />
            )
        }

        return (
            <div className="login-page">
                <div className="login-info">
                    <h1>Unlock Many Amazing Features!</h1>
                    <div className="login-info-img">
                        <img src="https://www.deltalight.com/frontend/files/projects/images/source/002921_REA11.jpg" alt="" />
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam soluta inventore animi. Maiores voluptates nam aspernatur unde minima nobis sint, ea harum dignissimos, numquam perspiciatis architecto ipsum a. Officia, nostrum?</p>
                </div>
                <Form className="login-form" onSubmit={this.onSubmit}>
                    <Form.Item>
                        <label htmlFor="username">Username</label>
                        <Input
                            name="username" id="username"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                            onChange={this.onUsernameChange}
                        />
                    </Form.Item>
                    <Form.Item>
                        <label htmlFor="password">Password</label>
                        <Input
                            name="password" id="password"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                            onChange={this.onPasswordChange}
                        />
                    </Form.Item>
                    <Form.Item className="form-buttons">
                        <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                        <p>Don't have an account? <Link className="register-link" to="/signup">Register now!</Link></p>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default withUserContext(Login)