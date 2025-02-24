// custom imports
import { meshType } from './types';
import { selector } from './state';
import { usePlaygroundStore } from './state/store';
import { isLocked, toFloat32Array, toUint32Array } from './utils';

// 3rd part imports
import { useMemo, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { generateUUID } from 'three/src/math/MathUtils';
import { ThreeEvent, useFrame, useThree, MeshProps } from '@react-three/fiber';
import { DoubleSide, Raycaster, Vector2, Mesh, Intersection, Object3D, Object3DEventMap, Material } from 'three';

export type XSegmentProps = MeshProps & {
    name?: string
    segment: meshType
    autoRotate?: boolean
    onVerticesSelect?: (objects: Intersection<Object3D<Object3DEventMap>>[], point: number[]) => void
}

export function XSegment({segment: {id, vertices = [], colors = [], faces = [], material, status, ...segment}, name, ref, autoRotate, onVerticesSelect,...props}: XSegmentProps) {
    const segmentRef = useRef<Mesh>(null!)
    const locked = useMemo(() => isLocked(status), [status])
    const { mode, tool, selected, select, unselect } = usePlaygroundStore(useShallow(selector))
    
    useFrame((state, delta) => {
        const material = segmentRef.current.material
        if (locked) {
            if (material instanceof Material) {
                material.transparent = true
                material.opacity = 0.6 + Math.max(-0.5, Math.sin(new Date().getTime() * .0045))
            } else {
                if (material instanceof Material) {
                    material.transparent = false
                }
            }
        }
    })

    const { camera, scene } = useThree((state) => ({ camera: state.camera, scene: state.scene }))
   
    const selectVertices = (event: ThreeEvent<PointerEvent | MouseEvent>) => {
        const mouse = new Vector2()
        const raycaster = new Raycaster()
        
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse.clone(), camera );   

        const objects = raycaster.intersectObject(segmentRef.current)

        const iPoint = segmentRef.current.worldToLocal(objects[0].point) // intersection point
        if (!iPoint) return
        onVerticesSelect?.(objects, [iPoint.x, iPoint.y, iPoint.z])
    }

    return (
        <mesh 
            {...props}
            {...segment}

            name={name}
            ref={segmentRef}
            key={generateUUID()}
            onPointerMissed={(event: any) => {
                if (event.type === "click") {
                    if (!event.shiftKey) {
                        unselect(id)
                    }
                    props.onPointerMissed?.(event)
                }
            }}
            
            onPointerOver={(event: any) => {
                if (locked) return
                event.stopPropagation()
                switch (tool) {
                    case "vertexSelector":
                        if (event.shiftKey) {
                            selectVertices(event)
                        }
                        break 
                    case "scale":
                    case "rotate":
                    case "translate":
                    default:
                        break 
                }
            }}

            onClick={(event: any) => {
                if (locked) return
                event.stopPropagation()
                switch (tool) {
                    case "vertexSelector":
                        if (event.shiftKey) {
                            selectVertices(event)
                        }
                        break 
                    case "scale":
                    case "rotate":
                    case "translate":
                    default:
                        if (event.shiftKey) {
                            if (selected.includes(id)) {
                                unselect(id)
                            } else {
                                select(id)
                            }
                        } else {
                            unselect()
                            select(id)
                        }
                        break 
                }
            }}
        >
            <bufferGeometry attach="geometry">
                <bufferAttribute 
                    itemSize={1} 
                    attach="index" 
                    count={3*faces.length} 
                    array={toUint32Array(faces)}
                />
                <bufferAttribute 
                    itemSize={3} 
                    attach="attributes-position" 
                    count={vertices.length / 3} 
                    array={toFloat32Array(vertices)}
                />
                <bufferAttribute 
                    itemSize={3} 
                    attach="attributes-color" 
                    count={colors.length / 3} 
                    array={selected.includes(id)? 
                        toFloat32Array(new Array(colors.length).fill([1, 1, 0])) : toFloat32Array(colors)
                    }
                />
            </bufferGeometry>
            <meshPhongMaterial
                vertexColors
                side={DoubleSide} 
                attach={"material"} 
                {...material as any} 
                wireframe={mode === "wireframe"}
                color={selected.includes(id) && tool !== "vertexSelector" ? "yellow" : undefined} 
            />
        </mesh>
    )
}