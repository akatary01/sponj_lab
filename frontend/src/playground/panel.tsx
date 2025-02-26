// custom imports
import { meshType } from './types';
import { selector } from './state';
import { generateMesh } from './api';
import { Img } from '../components/img';
import { useUserStore } from '../user/state/store';
import { usePlaygroundStore } from './state/store';
import { selector as userSelector } from '../user/state';

// third party
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type PlaygroundPanelProps = JSX.IntrinsicElements['div'] & {
}

export function PlaygroundPanel({...props}: PlaygroundPanelProps) {
    const { id: uid } = useUserStore(useShallow(userSelector))
    const { id: pid, meshes, setLoading } = usePlaygroundStore(useShallow(selector))
    const [img, setImg] = useState<File>()

    return (
        <div className="playground-panel">
            <div className='flex column align-center' style={{marginTop: 10}}>
                <Img 
                    src={img}
                    style={{height: 75}}
                    placeholder="Upload image"
                    onUpload={file => setImg(file)}
                    imgStyle={{objectFit: "contain"}}
                />
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        if (img) {
                            const reader = new FileReader();
                            
                            reader.onload = async () => {
                                const imgBase64 = reader.result as string
                                setLoading({on: true, progressText: "Generating mesh..."})
                                await generateMesh(uid, pid, [{img: imgBase64, strength: 0.7}])
                                setImg(undefined)
                                setLoading({on: false, progressText: undefined})
                            }
                            reader.readAsDataURL(img)
                        }
                    }}
                >generate</button>
            </div>

            <h3><b>Layers</b></h3>
            <div className='mesh-layers-container'>
                {meshes.map(mesh => <MeshLayers key={`${mesh.id}-layers`} mesh={mesh} />)}
            </div>

        </div>
    )
}

type MeshLayersProps = JSX.IntrinsicElements['div'] & {
    mesh: meshType
    btnStyle?: React.CSSProperties
    svgStyle?: React.CSSProperties
}

function MeshLayers({mesh: {id, segments, ...mesh}, style, btnStyle, svgStyle, ...props}: MeshLayersProps) {
    const [collapsed, setCollapsed] = useState(false)

    const hasSegments = segments.length > 0

    return (
        <div 
            className="mesh-layer" 
            style={{...style}} 
            {...props}
        >
            <div className='flex align-center'>
                {hasSegments && 
                    <FontAwesomeIcon 
                        style={{...svgStyle}}
                        className="dropdown-caret pointer"
                        onClick={() => setCollapsed(!collapsed)}
                        icon={`fa-solid fa-caret-${collapsed ? "down" : "right"}` as IconProp} 
                    />
                }
                <MeshButton id={id} style={{...btnStyle}} onClick={event => setCollapsed(!collapsed)} />
            </div>
            {hasSegments && collapsed && segments.map((segment, i) => {
                return (
                    <MeshLayers 
                        mesh={segment} 
                        style={{marginLeft: 15}}
                        key={`${segment.id}-layers`} 
                        svgStyle={{marginLeft: -15}}
                        // btnStyle={{width: "calc(100%)"}}
                    />
                )
            })}
        </div>
    )
}

type MeshButtonProps = JSX.IntrinsicElements['button'] & {
    id: meshType
}
function MeshButton({id, onClick, className = "",...props}: MeshButtonProps) {
    const { selected, select, unselect, updateMesh, getMesh } = usePlaygroundStore(useShallow(selector))
    const { gif, title, ...mesh } = useMemo(() => getMesh(id), [id])

    return (
        <button 
            {...props}
            onClick={event => { 
                event.stopPropagation()
                
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
                onClick && onClick(event)
            }}
            className={`mesh-layer-btn flex align-center ${className} ${selected.includes(id) ? "mesh-layer-selected" : ""}`}
        >
            {gif && <img src={gif} height={20} />}

            <h4
                className="mesh-title overflow-ellipsis align-text-start"
                style={{margin: 0, fontWeight: 400, marginLeft: gif ? 15 : 5}}
            >{title}</h4>
        </button>
    )
}   