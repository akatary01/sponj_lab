// custom imports
import { CheckTyping } from "./txt";

// third party
import { useEffect, useState } from "react";

// css stylesheets
import "../assets/css/editable.css";

export type EditableProps = JSX.IntrinsicElements["input"] & {
    value: string
    onTypingStopped?: (header: string) => void
}

export function Editable({value, onTypingStopped, ...props}: EditableProps) {
    const [header, setHeader] = useState<string>(value)
    const { onUpdate } = CheckTyping(undefined, () => onTypingStopped && onTypingStopped(header))
    
    useEffect(() => { setHeader(value) }, [value])
    
    return (
        <input 
            {...props}
            value={header}
            onChange={event => { setHeader(event.target.value) }} 
            onKeyUp={event => { onUpdate(() => {}) }}
        />
    )
}

export function EditableH3({className, style, ...props}: EditableProps) {
    return (
        <Editable 
            {...props}
            className={`editable ${className}`}
            style={{fontWeight: 550, margin: "10px 0 0 10px", ...style}}
        />
    )
}

export function EditableH1({className, style, ...props}: EditableProps) {
    return (
        <Editable 
            {...props}
            style={{...style}}
            className={`editable-h1 editable ${className}`}
        />
    )
}