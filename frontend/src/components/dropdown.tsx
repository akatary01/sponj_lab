import { Children, isValidElement, ReactNode, useEffect, useState } from "react";

type DropdownProps = JSX.IntrinsicElements["button"] & {
    defaultValue?: string
}

export default function Dropdown({children = [], defaultValue, ...props}: DropdownProps) {
    const [selected, setSelected] = useState<string>(defaultValue || "")

    useEffect(() => { setSelected(defaultValue || "") }, [defaultValue])
    
    return (
       <button className="dropdown flex align-center justify-center">
            <DropdownItem onClick={key => setSelected(key)} selected={selected} selectedOnly>{children}</DropdownItem>
            <div className="tooltip">
                <DropdownItem onClick={key => setSelected(key)} selected={selected}>{children}</DropdownItem>
            </div>
       </button>
    )
}

type DropdownItemProps = {
    selected: string
    children: ReactNode
    selectedOnly?: boolean
    onClick?: (key: string) => void
}

function DropdownItem({children, onClick, selected, selectedOnly, ...props}: DropdownItemProps) {
    return (
        <>
        {Children.map(children, child => {
            if (isValidElement(child)) {
                const { key, props} = child

                if ((selected === key) || !selectedOnly) {
                    return (
                        <span 
                            key={key}
                            onClick={event => {
                                onClick && onClick(key || "")
                                props.onClick && props.onClick(event)
                            }}
                            className={!selectedOnly ? `dropdown-item${selected === key ? "__selected" : ""}` : ""}
                        >
                            {props.children as ReactNode}
                        </span>
                    )
                }
            }  return selectedOnly ? <></> : child
        })}
        </>
    )
}