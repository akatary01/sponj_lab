import { permsType, userType } from "./types"
import { constructUrl, defaultFetchHeaders } from "../utils"

export const url = `${process.env.REACT_APP_BACKEND_URL}/user`

export async function getUser(): Promise<userType> {
    const user = (await (await fetch(constructUrl(url, {}), {
        method: "GET",
        credentials: "include",
        headers: defaultFetchHeaders()
    })).json()) as userType

    return user
}

export async function getMbPerms(mid: string): Promise<permsType> {
    return (await (await fetch(constructUrl(`${url}/perms/mb`, {mid}), {
        method: "GET",
        credentials: "include",
        headers: defaultFetchHeaders()
    })).json())
}

export async function setCsrfToken(): Promise<string> {
    return (await (await fetch(`${url}/csrf`, {method: "GET", credentials: "include"})).json()).csrftoken
}