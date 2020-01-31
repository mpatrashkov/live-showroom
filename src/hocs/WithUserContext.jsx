import React from 'react'
import {UserConsumer} from '../contexts/user-context'

function withUserContext (Component){
    return class extends React.Component{
        constructor(props){
            super(props)
        }

        render() {
            return (
                <UserConsumer>
                    {
                        ({ user }) => (
                            <Component  {...this.props} updateUser={user.updateUser} userId={user.userId} username={user.username} isAdmin={user.isAdmin} isLoggedIn={user.isLoggedIn} />
                        )
                    }
                </UserConsumer>
            )
        }
    }
}

export default withUserContext