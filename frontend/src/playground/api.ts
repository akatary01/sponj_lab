// custom imports
import { constructUrl, defaultFetchHeaders } from "../utils"
import { meshType, playgroundType, geoType, styleType } from "./types"

const playgroundUrl = `${process.env.REACT_APP_BACKEND_URL}/playground`

export async function getPlayground(id: string): Promise<playgroundType> {
    return await (await fetch(constructUrl(playgroundUrl, {id}), {
        method: "GET", 
        credentials: "include",
        headers: defaultFetchHeaders()
    })).json()
}

export async function generateMesh(uid: string, pid: string, geos: geoType[], styles: styleType[] = []): Promise<void> {
    await fetch(constructUrl(`${playgroundUrl}/mesh/generate`, {uid, pid}), {
        method: "POST",
        credentials: "include",
        headers: defaultFetchHeaders(),
        body: JSON.stringify({geos, styles, is_sketch: false}),
    })
}

export async function segmentMesh(uid: string, mid: string): Promise<void> {
    await fetch(constructUrl(`${playgroundUrl}/mesh/segment`, {uid, mid}), {
        method: "POST",
        credentials: "include",
        headers: defaultFetchHeaders()
    })
}

export async function getMesh(id: string): Promise<meshType> {
    return await (await fetch(constructUrl(`${playgroundUrl}/mesh`, {id}), {
        method: "GET", 
        credentials: "include",
        headers: defaultFetchHeaders()
    })).json()
}

export async function initMesh(id: string): Promise<meshType> {
    const mesh = await getMesh(id)

    const segments = []
    for (let i = 0; i < mesh.segments.length; i++) {
        segments.push(await initMesh(mesh.segments[i].id))
    }

    mesh.segments = segments
    // TODO: temperary until we update backend to support vertex selection
    return {
        ...mesh,
        unselected: {
            faces: mesh.faces,
            colors: mesh.colors,
            vertices: mesh.vertices,
        },

        selected: {id: `${id}-selected`},
    } as meshType
} 