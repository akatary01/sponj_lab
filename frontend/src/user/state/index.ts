import { userType } from "../types"

export interface UserState {
    id: string
    name: string
    email: string
    isAuthenticated: boolean
    
    init: () => void

    signout: () => void
    signin: (email: string, password: string) => void
    signup: (user: Partial<userType>, password: string) => void
}

export const selector = (state: UserState) => ({
    id: state.id,
    name: state.name,
    email: state.email,
    isAuthenticated: state.isAuthenticated,

    init: state.init,

    signin: state.signin,
    signup: state.signup,
    signout: state.signout,
})