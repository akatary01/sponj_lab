// third part imports 
import { useEffect, useState , MouseEvent } from "react"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type ModalProps = JSX.IntrinsicElements["div"] & {
    open?: boolean
    onOpen?: (open: boolean) => void
}

export function Modal({open = false, onOpen, children, className = "", style, ...props}: ModalProps) {
    const [active, setActive] = useState(open)

    useEffect(() => { setActive(open) }, [open])
    const close = (event: MouseEvent) => {
        event.stopPropagation()

        setActive(false)
        onOpen && onOpen(false)
    }
    return (
        <>
            {active && 
                <>
                <div className="absolute modal-backdrop top left width-100 height-100" onClick={close}></div>
                <div 
                    {...props}
                    style={{...style}}
                    className={`absolute modal ${className}`}
                >
                    <button className="icon-button absolute" onClick={close} style={{top: 10, right: 10}}>
                        <FontAwesomeIcon icon={"fa-solid fa-xmark" as IconProp} />
                        <span className="tooltip">close</span>
                    </button>
                    {children}
                </div>
                </>
            }
        </>
    )
}