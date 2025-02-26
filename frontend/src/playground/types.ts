// custom imports
import { Material, Mesh, Quaternion, Vector3 } from "three"

// third party

export type meshStatusType = "segmenting" | "regenerating" | "ready" | "error"
export type meshJsonType = {
    id: string 

    faces: number[][]
    colors: number[][]
    vertices: number[][]
}

export type meshType = Mesh & meshJsonType & {
    title: string
    material: Material  
    
    gif: string 
    url: string
    normals: number[][]
    
    status: meshStatusType
    segments: meshType[] 

    selected: meshJsonType
    unselected: meshJsonType
} 

export type playgroundType = {
    id: string,
    title: string, 
    meshes: meshType[]
}

export type playgroundModeType = "mesh" | "wireframe"

export type meshToolType = "rotate" | "translate" | "scale"
export type playgroundToolType = meshToolType | "grab" | "segment" | "stylize" | "vertexSelector"

export type meshTransformType = {
    scale: Vector3
    position: Vector3
    quaternion: Quaternion
}

export type geoType = {
    img?: string
    prompt?: string
    strength?: number
}

export type styleType = {
    img?: string
    prompt?: string
    strength?: number
}