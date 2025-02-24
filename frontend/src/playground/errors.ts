export class MeshNotFound extends Error {
    id: string

    constructor(id: string) {
        super(`mesh ${id} not found!`)
        this.id = id
    }
}
