import React from 'react';
import "./addModel.scss";

interface AddModelState {
    file: any;
}

export default class AddModel extends React.Component<{}, AddModelState> {
    constructor(props:any) {
        super(props)

        this.state = {
            file: null
        }
    }

    onChangeHandler = (e:any) => {
        this.setState({
            file: e.target.files[0]
        })
    }

    onSubmitHandler = (e:any) => {
        e.preventDefault()
        let data = new FormData()
        data.append('file', this.state.file)
        fetch('http://localhost:9999/upload', {
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
                    <input type="file" name="file" onChange={this.onChangeHandler} /> 
                    <input type="submit" />
                </form>
            </div>
        )
    }
}