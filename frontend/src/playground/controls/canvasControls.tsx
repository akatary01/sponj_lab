// custom imports
import { selector } from "../state";
import { meshToolType } from "../types";
import { usePlaygroundStore } from "../state/store";

// third party
import { useShallow } from "zustand/shallow";
import { useThree } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { OrbitControls, TransformControls } from "@react-three/drei";

type CanvasControlsProps = {
}

export function CanvasControls({}: CanvasControlsProps) {
    const orbitRef = useRef<any>()
    const scene = useThree((state) => state.scene)

    const { selected, deleteMesh, unselect } = usePlaygroundStore(useShallow(selector))

    useEffect(() => {
        const callback = (event: { key: string }) => {
            switch (event.key) {
                case "Backspace":
                    for (const id of selected) {
                        const object = scene.getObjectByName(id)
                        unselect(id)
                        if (object) {
                            scene.getObjectByName(id)?.remove()
                            deleteMesh(id)
                        }
                    }
                    break
                default:
                    break
            }
        }
        document.addEventListener("keydown", callback)
        return () => document.removeEventListener("keydown", callback)
    }, [selected])
    
    return (
        <>
        {selected.map(id => <XControl key={`${id}-control`} id={id} orbitRef={orbitRef} />)}
        <OrbitControls makeDefault maxDistance={9} ref={orbitRef}/>
        </>
    )
}

type XControlProps = {
    id: string
    orbitRef: MutableRefObject<any>
}

export function XControl({id, orbitRef}: XControlProps) {
    const transformRef = useRef<any>()
    const scene = useThree((state) => state.scene)
    const { tool } = usePlaygroundStore(useShallow(selector))

    useEffect(() => {
        if (transformRef.current) {
            const callback = (event: { value: boolean }) => {
                // console.log(transformRef.current)
                orbitRef.current.enabled = !event.value
            }
            
            transformRef.current?.addEventListener("dragging-changed", callback)
            return () => transformRef.current?.removeEventListener("dragging-changed", callback)
        }
    })

    const object = scene.getObjectByName(id)    
    const meshTool: meshToolType | undefined = useMemo(() => ["rotate", "scale", "translate"].includes(tool)? tool as meshToolType : undefined, [tool])

    return (
        <>
        {meshTool && object &&
            <TransformControls 
                object={object} 
                mode={meshTool} 
                ref={transformRef}
            />
        }
        </>
    )
}