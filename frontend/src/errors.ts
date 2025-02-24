
export class CookieNotFound extends Error {
    
    constructor(name: string) {
        super(`cookie ${name} not found!`)
    }
}


export class UnSecureContext extends Error {
    constructor() {
        super(`clipboard cannot be accessed in unsecure context!`)
    }
}