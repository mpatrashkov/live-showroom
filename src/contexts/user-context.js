import {createContext} from 'react'

let defaultUser = {isAdmin: false,username: '', isLoggedIn: false, userId: ''}
const {Consumer: UserConsumer,Provider: UserProvider} = createContext(defaultUser)

export {
    UserConsumer,
    UserProvider,
    defaultUser
}
