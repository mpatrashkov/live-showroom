import React from 'react';
import "./add-material.scss";
import { serverUrl } from '../../config/config';

interface AddMaterialState {
    file: any,
    model: string
}

export default class AddMaterial extends React.Component<{}, AddMaterialState> {
    constructor(props:any) {
        super(props)

        this.state = {
            file: null,
            model: ''
        }
    }

    onChangeFileHandler = (e:any) => {
        this.setState({
            file: e.target.files[0]
        })
    }

    onChangeModelHandler = (e:any) => {
        this.setState({
            model: e.target.value
        })
    }

    onSubmitHandler = (e:any) => {
        e.preventDefault()
        console.log(this.state)
        let data = new FormData()
        data.append('file', this.state.file)
        data.append('model', this.state.model)
        fetch(`${serverUrl}/material/upload`, {
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
                    <input type="text" name="model" onChange={this.onChangeModelHandler} />
                    <input type="submit" />
                </form>
            </div>
        )
    }
}