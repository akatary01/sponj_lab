// custom imports

// third party
import { useShallow } from "zustand/shallow";
import { useEffect, useRef, useState } from "react";

type TxtProps = JSX.IntrinsicElements["textarea"] & {
    text: string
    onTypingStopped?: () => void
}

export default function Txt({text, children, onTypingStopped, onKeyUp, ...props}: TxtProps) {
    const [rows, setRows] = useState(1)

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { onUpdate } = CheckTyping(undefined, onTypingStopped)

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "0";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = `${scrollHeight - 15}px`;
        }
    }, [textAreaRef, text])

    return (
        <textarea 
            {...props}
            ref={textAreaRef}
            onKeyUp={event => {
                if (event.code === "Enter") {
                    setRows(rows + 1)
                }

                onUpdate(() => onKeyUp && onKeyUp(event))
            }}
    >{children}</textarea>
    )
}

export function CheckTyping(timeout: number = 500, onTypingStopped?: () => void) {

    const typing = useRef(false)
    const timer = useRef<NodeJS.Timeout>()

    const checkTyping = () => {
        if (typing.current) {
            typing.current = false
            if (timer.current) clearInterval(timer.current)
            timer.current = setTimeout(checkTyping, timeout)
        } else {
            onTypingStopped && onTypingStopped()
        }
    }

    const onUpdate = (callback?: () => void) => {
        typing.current = true
        if (timer.current) clearInterval(timer.current)
            
        callback && callback()
        timer.current = setTimeout(checkTyping, timeout)
    }

    return {typing, timer, checkTyping, onUpdate}
}