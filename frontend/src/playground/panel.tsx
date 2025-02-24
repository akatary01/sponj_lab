// custom imports
import { meshType } from './types';
import { selector } from './state';
import { usePlaygroundStore } from './state/store';
import { EditableH3 } from '../components/editable';

// third party
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type PlaygroundPanelProps = JSX.IntrinsicElements['div'] & {
}

export function PlaygroundPanel({...props}: PlaygroundPanelProps) {
    const { meshes } = usePlaygroundStore(useShallow(selector))

    return (
        <div className="playground-panel">
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