import React from 'react';
import './register.scss';
import { Form, Input, Icon, Button, message } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import withUserContext from '../../hocs/WithUserContext';
import { serverUrl } from '../../config/config';

interface RegisterStateInterface {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string
}

interface RegisterProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: boolean,
    isLoggedIn: boolean
}

class Register extends React.Component<RegisterProperties, RegisterStateInterface> {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: ''
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

    onFirstNameChange = (e: any) => {
        this.setState({
            firstName: e.target.value
        })
    }

    onLastNameChange = (e: any) => {
        this.setState({
            lastName: e.target.value
        })
    }

    onEmailChange = (e: any) => {
        this.setState({
            email: e.target.value
        })
    }

    onSubmit = async (e: any) => {
        e.preventDefault();
        let data = await fetch(`http://${serverUrl}/auth/signup`, {
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
            console.log(result.isAdmin)
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
            <div className="register-page">
                <Form className="register-form" onSubmit={this.onSubmit}>
                    <Form.Item className="register-form-item">
                        <label htmlFor="firstName">First Name</label>
                        <Input
                            name="firstName" id="firstName"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="First Name"
                            onChange={this.onFirstNameChange}
                        />
                    </Form.Item>
                    <Form.Item className="register-form-item">
                        <label htmlFor="lastName">Last Name</label>
                        <Input
                            name="lastName" id="lastName"
                            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Last Name"
                            onChange={this.onLastNameChange}
                        />
                    </Form.Item>
                    <Form.Item className="register-form-item">
                        <label htmlFor="username">Username</label>
                        <Input
                            name="username" id="username"
                            prefix={<Icon type="profile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                            onChange={this.onUsernameChange}
                        />
                    </Form.Item>
                    <Form.Item className="register-form-item">
                        <label htmlFor="password">Password</label>
                        <Input
                            name="password" id="password"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Password"
                            type="password"
                            onChange={this.onPasswordChange}
                        />
                    </Form.Item>
                    <Form.Item className="register-form-item">
                        <label htmlFor="email">Email</label>
                        <Input
                            name="email" id="email"
                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Email"
                            type="email"
                            onChange={this.onEmailChange}
                        />
                    </Form.Item>
                    <Form.Item className="form-buttons">
                        <Button type="primary" htmlType="submit" className="register-form-button">Register</Button>
                        <p>Have an account? <Link className="login-link" to="/signin">Log in now!</Link></p>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default withUserContext(Register)