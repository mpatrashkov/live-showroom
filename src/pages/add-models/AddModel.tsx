import React from 'react';
import "./addModel.scss";
import { serverUrl } from '../../config/config';

interface AddModelState {
    file: any,
    type: string,
    image: any
}

export default class AddModel extends React.Component<{}, AddModelState> {
    constructor(props:any) {
        super(props)

        this.state = {
            file: null,
            type: '',
            image: null
        }
    }

    onChangeFileHandler = (e:any) => {
        console.log(e.target.files[0].name)
        this.setState({
            file: e.target.files[0]
        })
    }

    onChangeImageHandler = (e:any) => {
        this.setState({
            image: e.target.files[0]
        })
    }

    onChangeTypeHandler = (e:any) => {
        this.setState({
            type: e.target.value
        })
    }

    onSubmitImageHandler = (e:any) => {
        e.preventDefault()
        let data = new FormData()
        data.append('file', this.state.image)
        fetch(`${serverUrl}/model/upload/image/${this.state.file.name}`, {
            method: 'POST',
            body: data
        }).then((res) => { 
            console.log(res)
         })
    }

    onSubmitHandler = (e:any) => {
        e.preventDefault()
        let data = new FormData()
        data.append('file', this.state.file)
        data.append('type', this.state.type)
        fetch(`${serverUrl}/model/upload`, {
            method: 'POST',
            body: data
        }).then((res) => { 
            console.log(res)
         })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmitHandler}>
                    <input type="file" name="file" onChange={this.onChangeFileHandler} />
                    <input type="text" name="type" onChange={this.onChangeTypeHandler} />
                    <input type="submit" />
                </form>

                <form onSubmit={this.onSubmitImageHandler}>
                    <input type="file" name="image" onChange={this.onChangeImageHandler} />
                    <input type="submit" />
                </form>
            </div>
        )
    }
}