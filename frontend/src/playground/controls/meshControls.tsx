// custom imports
import { selector } from '../state';
import '../../assets/css/controls.css'; 
import { usePlaygroundStore } from '../state/store';
import { EditableH3 } from '../../components/editable';

// third party
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

type MeshControlsProps = JSX.IntrinsicElements['div'] & {
}

export function MeshControls({...props}: MeshControlsProps) {
    const { tool, updateMesh, selected, getMesh } = usePlaygroundStore(useShallow(selector))

    const id = useMemo(() => selected[0], [selected])
    const mesh = useMemo(() => getMesh(id), [selected])
    
    return (
        <div id="mesh-controls">
            {/* TODO: ensure mesh updates are reflected */}
            <EditableH3 
                value={mesh.title}
                className="mesh-title"
                onTypingStopped={(header) => {
                    updateMesh(id, {title: header})
                }}
                style={{margin: 0, fontWeight: 400}}
                onKeyDown={event => event.stopPropagation()}
            />

            {/* TODO: add segmentat button */}
        </div>
    )
}