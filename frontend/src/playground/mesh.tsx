// custom imports
import { selector } from './state';
import { XSegment } from './segment';
import { useCustomState } from '../utils';
import { usePlaygroundStore } from './state/store';
import { extractMeshTransform, getMeshTransform } from './utils';
import { meshJsonType, meshTransformType, meshType } from './types';

// 3rd part imports
import { useRef } from 'react';
import { Group, Mesh } from 'three';
import { useShallow } from 'zustand/shallow';
import { GroupProps } from '@react-three/fiber';


export type XMeshProps = GroupProps & {
    mesh: meshType
    highlight?: boolean
    autoRotate?: boolean
}

export function SMesh({mesh: {id, segments, ...mesh}, autoRotate, ...props}: XMeshProps) {
    const groupRef = useRef<Group>(null!)
    const meshRefs = useRef<(Mesh | null)[]>([])
    
    const { selected } = usePlaygroundStore(useShallow(selector))

    return (
        <group 
            name={id} 
            {...props}
            ref={groupRef} 
        >
            {segments?.map((segment, i) => {
                const MeshComp = segment.segments.length > 0 ? SMesh : XMesh
                return (
                    <MeshComp 
                        mesh={segment} 
                        key={segment.id}
                        highlight={selected === id}
                    />
                )
            })}
        </group>
    )
}

export function XMesh({mesh: {id, segments, status, ...mesh}, autoRotate, ...props}: XMeshProps) {
    const [unselectedMesh, setUnselectedMesh] = useCustomState<meshJsonType>({...mesh, id})
    const [selectedMesh, setSelectedMesh] = useCustomState<meshJsonType>({...mesh.selected, ...extractMeshTransform(mesh)})

    const nTransform = useRef<meshTransformType>(extractMeshTransform(mesh))
    const sTransform = useRef<meshTransformType>(extractMeshTransform(mesh))
    
    const { computeSelected, computeUnselected, updateMesh } = usePlaygroundStore(useShallow(selector))

    return (
        <group name={id} {...props}>
            <group 
                name={selectedMesh.id}
            >
                <XSegment 
                    segment={{...selectedMesh, status} as meshType}
                    onUpdate={event => {
                        sTransform.current = getMeshTransform(event)
                        if (nTransform.current.position) {
                            // const transform = subTransform(sTransform.current, nTransform.current)
                        }
                    }}

                    onPointerMissed={event => {}}
                />
            </group>
            <group>
                <XSegment 
                    segment={{...unselectedMesh, status} as meshType}
                    onVerticesSelect={(objects, point) => {
                        const selected = computeSelected(id, objects, point)
                        const unselected = computeUnselected(id, objects)

                        updateMesh(id, {selected, unselected})

                        setSelectedMesh(selected)
                        setUnselectedMesh(unselected)
                    }}
                    
                    onUpdate={event => {
                        nTransform.current = getMeshTransform(event) 
                    }}
                />
            </group>
        </group>
    )
}

