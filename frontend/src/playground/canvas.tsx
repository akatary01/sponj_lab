// custom imports
import { ThemeContext } from "..";
import { SMesh, XMesh } from "./mesh";
import { meshType, playgroundModeType } from "./types";
import { CanvasControls } from "./controls/canvasControls";

// third party
import { Suspense, useContext } from "react";
import { Canvas, CanvasProps } from "@react-three/fiber";
import { ContactShadows, Plane, SoftShadows } from "@react-three/drei";

type XCanvasProps = CanvasProps & {
    fog?: boolean
    disable?: boolean
    mode?: playgroundModeType

    meshes: meshType[] 
    meshProps?: {
        y?: number 
        z?: number
        autoRotate?: boolean
    }
}

export default function XCanvas({fog = true, disable = false, mode = "mesh", meshProps, meshes, ...props}: XCanvasProps) {
    const theme = useContext(ThemeContext)?.theme

    // all mesh editing happened here and parent will not know! when the mesh updates, we need to update our local mesh as well 
    // resolving conflicts as necessary

    return (
        <Canvas 
            // shadows 
            className='canvas height-100' 
            camera={{position: [-3, 2.5, 4], fov: 75}}
            {...props}
        >
            <ambientLight intensity={1}/>
            <directionalLight castShadow intensity={1} position={[0, 2, 2]} />

            {!disable && 
                <>
                    <SoftShadows/>
                    <ContactShadows blur={3} position={[0, -0.49, 0]}/>
                    <gridHelper args={[10, 10, "0x444", "#fff"]} position={[0, -0.50, 0]}/>
                    {fog && <fog attach={"fog"} color={theme?.playground['primary'] || '#f0f0f0'} near={0} far={20}/>}
                </>
            }
            <color attach="background" args={[(disable? theme?.playground['secondary'] : theme?.playground['primary']) || '#f0f0f0']} />

            
            <Suspense fallback={null}>
                <group>
                    {meshes.map((mesh, i) => {
                        const {y = 0.5, z = 0, autoRotate = false} = meshProps || {}
                        const MeshComp = mesh.segments.length > 0 ? SMesh : XMesh
                        
                        return (
                            <MeshComp 
                                mesh={mesh} 
                                key={mesh.id} 
                                autoRotate={autoRotate}
                            />
                        )
                    })}
                    {!disable && 
                        <Plane receiveShadow position={[0, -1.3, 0]} args={[1000, 1000]} rotation={[-Math.PI / 2, 0, 0]}>
                            <meshStandardMaterial attach="material" color={theme?.bg['primary'] || '#ffffff'}/>
                        </Plane>
                    }
                </group>
            </Suspense>
            <CanvasControls />
        </Canvas>
    )
}