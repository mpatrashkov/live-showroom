import React from 'react';
import "./add-material.scss";
import { serverUrl } from '../../config/config';
import { Form, Button } from 'react-bootstrap'
import withUserContext from '../../hocs/WithUserContext';
import { Redirect } from 'react-router-dom';
import {message} from 'antd'

interface AddMaterialState {
    file: any,
    model: string,
    fileInputText: string
}

interface AddMaterialProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: any,
    isLoggedIn: boolean
}

class AddMaterial extends React.Component<AddMaterialProperties, AddMaterialState> {
    constructor(props: any) {
        super(props)

        this.state = {
            file: null,
            model: '',
            fileInputText: 'Choose Material...'
        }
    }

    onChangeFileHandler = (e: any) => {
        this.setState({
            file: e.target.files[0]
        })
    }

    onChangeModelHandler = (e: any) => {
        this.setState({
            model: e.target.value
        })
    }

    onSubmitHandler = (e: any) => {
        e.preventDefault()
        let data = new FormData()
        data.append('file', this.state.file)
        data.append('model', this.state.model)
        fetch(`${serverUrl}/material/upload`, {
            method: 'POST',
            body: data
        }).then((res) => {
            message.success(res.message)
        })
    }

    render() {
        if (this.props.isAdmin != "true") {
            return (
                <Redirect to="/" />
            )
        }
        return (
            <React.Fragment>
                <h2 className="material-heading">Enter Material For Existing Model</h2>
                <div className="upload-material">
                    <Form onSubmit={this.onSubmitHandler} className="upload-material-form">
                        <Form.Group className="form-group">
                            <Form.Label>Material</Form.Label>
                            <label className="file">
                                <input name="file" type="file" id="file" aria-label="File browser example" onChange={this.onChangeFileHandler} />
                                <span className="file-custom">{this.state.fileInputText}</span>
                            </label>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Model Name</Form.Label>
                            <Form.Control placeholder="Enter Model Name..." className="form-control" type="text" name="model" onChange={this.onChangeModelHandler} />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Control className="form-control btn btn-primary" type="submit" />
                        </Form.Group>
                    </Form>
                </div>
            </React.Fragment >
        )
    }
}

export default withUserContext(AddMaterial)