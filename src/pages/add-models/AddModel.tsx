import React from 'react';
import "./addModel.scss";
import { serverUrl } from '../../config/config';
import { Steps } from 'antd'
import { Form, Button } from 'react-bootstrap'
import withUserContext from '../../hocs/WithUserContext';
import { Redirect } from 'react-router-dom';
import { Spin } from 'antd'

const { Step } = Steps;

interface AddModelState {
    file: any,
    type: string,
    image: any,
    currentStep: number,
    name: string,
    types: any,
    fileInputText: string,
    imageInputText: string,
    loading: boolean
}

interface AddModelProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: any,
    isLoggedIn: boolean
}

class AddModel extends React.Component<AddModelProperties, AddModelState> {
    constructor(props: any) {
        super(props)

        this.state = {
            file: null,
            type: '',
            image: null,
            currentStep: 0,
            name: '',
            types: [],
            fileInputText: 'Choose Model...',
            imageInputText: 'Choose Image...',
            loading: false
        }
    }

    onChangeFileHandler = (e: any) => {
        this.setState({
            file: e.target.files[0],
            fileInputText: e.target.files[0].name
        })
    }

    onChangeNameHandler = (e: any) => {
        this.setState({
            name: e.target.value
        })
    }

    onChangeImageHandler = (e: any) => {
        this.setState({
            image: e.target.files[0],
            imageInputText: e.target.files[0].name
        })
    }

    onChangeTypeHandler = (e: any) => {
        this.setState({
            type: e.target.value
        })
    }

    onSubmitImageHandler = (e: any) => {
        e.preventDefault()
        const { image, name } = this.state;
        this.setState({
            loading: true
        }, () => {
            let data = new FormData()
            data.append('file', image)
            fetch(`${serverUrl}/model/upload/image/${name}`, {
                method: 'POST',
                body: data
            }).then((res) => {
                const currentStep = this.state.currentStep + 1;
                this.setState({ currentStep, loading: false });
            })
        })
    }

    onSubmitHandler = (e: any) => {
        e.preventDefault()
        const { file, type, name } = this.state;
        this.setState({
            loading: true
        }, () => {
            let data = new FormData()
            data.append('file', file)
            data.append('type', type)
            data.append('name', name)
            fetch(`${serverUrl}/model/upload`, {
                method: 'POST',
                body: data
            }).then((res) => {
                const currentStep = this.state.currentStep + 1;
                this.setState({ currentStep, loading: false });
            })
        })

    }

    onReset = (e: any) => {
        this.setState({
            currentStep: 0
        })
    }

    render() {
        if (this.props.isAdmin != "true") {
            return (
                <Redirect to="/" />
            )
        }
        return (
            <div>
                <Steps className="steps" current={this.state.currentStep}>
                    <Step title="Upload Model" />
                    <Step title="Upload Image" />
                    <Step title="You're done" />
                </Steps>
                <Spin spinning={this.state.loading}>
                    <div className="step-content">
                        {
                            this.state.currentStep === 0 ? (
                                <Form onSubmit={this.onSubmitHandler} className="upload-model">
                                    <Form.Group className="form-group">
                                        <Form.Label>Model</Form.Label>
                                        <label className="file">
                                            <input name="file" type="file" id="file" aria-label="File browser example" onChange={this.onChangeFileHandler} />
                                            <span className="file-custom">{this.state.fileInputText}</span>
                                        </label>
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control placeholder="Enter Model Name..." className="form-control" type="text" name="name" onChange={this.onChangeNameHandler} />
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control placeholder="Choose Type..." className="form-control" as="select" name="type" onChange={this.onChangeTypeHandler}>
                                            <option>Choose Type...</option>
                                            {
                                                this.state.types.map((t) => (
                                                    <option value={t.name}>{t.name}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Control className="form-control btn btn-primary" type="submit" />
                                    </Form.Group>
                                </Form>
                            ) : null
                        }
                        {
                            this.state.currentStep === 1 ? (
                                <Form onSubmit={this.onSubmitImageHandler} className="upload-image">
                                    <Form.Group className="form-group">
                                        <Form.Label>Image</Form.Label>
                                        <label className="file">
                                            <input name="image" type="file" id="image" aria-label="File browser example" onChange={this.onChangeImageHandler} />
                                            <span className="file-custom">{this.state.imageInputText}</span>
                                        </label>
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Control className="form-control btn btn-primary" type="submit" />
                                    </Form.Group>
                                </Form>
                            ) : null
                        }
                        {
                            this.state.currentStep === 2 ? (
                                <div className="finish">
                                    <h2>Congratulations! You Have Successfully Added A New Model!</h2>
                                    <p>Go to the showroom to see what you have uploaded! Do you want to add another model? Simply click the button below!</p>
                                    <Button variant="success" size="lg" onClick={this.onReset}>
                                        {"<--"} Add Another Model
                                </Button>
                                </div>
                            ) : null
                        }
                    </div>
                </Spin>
            </div>
        )
    }

    async componentDidMount() {
        let typesAsRequest = await fetch(`${serverUrl}/type/all`)

        let typesAsJSON = await typesAsRequest.json()
        let types = await typesAsJSON.types;
        this.setState({
            types: types
        })
    }
}

export default withUserContext(AddModel)