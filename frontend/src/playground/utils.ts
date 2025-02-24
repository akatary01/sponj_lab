// custom imports
import { meshTransformType, meshType, meshStatusType } from "./types"

// 3rd part imports
import { Mesh, Quaternion, TypedArray, Vector3 } from "three"

export function toTypedArray<T extends TypedArray>(A: any[], array: T): T {
    const {n, m} = {n: A.length, m: A[0]? A[0].length : 1}
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            array[i*m + j] = A[i][j]
        }
    }

    return array
}

export function toFloat32Array(A: any[]): Float32Array {
    const {n, m} = {n: A.length, m: A[0]? A[0].length : 1}
    const array = new Float32Array(n*m)
    return toTypedArray(A, array)
}

export function toUint32Array(A: any[]): Uint32Array {
    const {n, m} = {n: A.length, m: A[0]? A[0].length : 1}
    const array = new Uint32Array(n*m)
    return toTypedArray(A, array)
}

export function getMeshTransform(mesh: Mesh): meshTransformType {
    const scale = new Vector3()
    const position = new Vector3()
    const quaternion = new Quaternion()

    mesh.getWorldScale(scale)
    mesh.getWorldPosition(position)
    mesh.getWorldQuaternion(quaternion)

    return {scale, position, quaternion}
}

export function isTransformEqual(t1: meshTransformType, t2: meshTransformType): boolean {
    return (
        t1.scale && 
        t1.position && 
        t1.quaternion &&

        t2.scale && 
        t2.position &&
        t2.quaternion &&

        t1.scale.equals(t2.scale) && 
        t1.position.equals(t2.position) && 
        t1.quaternion.equals(t2.quaternion)
    )
}

export function subTransform(t1: meshTransformType, t2: meshTransformType): meshTransformType {
    return {
        scale: t1.scale.clone().divide(t2.scale),
        position: t1.position.clone().sub(t2.position),
        quaternion: t1.quaternion.clone().multiply(t2.quaternion.clone().invert())
    }
}

export function extractMeshTransform(mesh: Partial<meshType>): meshTransformType {
    return {
        scale: mesh.scale!,
        position: mesh.position!,
        quaternion: mesh.quaternion!
    }
}

export function dist(a: number[], b: number[], mode: "euclidean" | "manhattan" = "euclidean"): number {
    switch (mode) {
        case "manhattan":
            return a.reduce((prev, a_i, i) => prev + Math.abs(a_i - b[i]), 0)
        case "euclidean":
        default:
            return Math.sqrt(a.reduce((prev, a_i, i) => prev + Math.pow(a_i - b[i], 2), 0))
    }
}

export function closestK(A: [number, number[]][], p: number[], k: number = 1): [number, number[]][] {
    return A.map<[number, number, number[]]>(([i, a]) => [dist(a, p, "euclidean"), i, a]).sort((a_1, a_2) => a_1[0] - a_2[0]).slice(0, k).map(a => [a[1], a[2]])
}

export function isLocked(status: meshStatusType): boolean {
    switch (status) {
        case "segmenting":
        case "regenerating":
            return true
        case "ready":
        case "error":
        default:
            return false
    }
}