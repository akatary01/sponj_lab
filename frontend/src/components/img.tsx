import { createRef, useState, useEffect } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ImgProps = JSX.IntrinsicElements["div"] & {
    href?: string
    disabled?: boolean
    src?: string | File
    placeholder?: string
    imgClassName?: string
    imgStyle?: React.CSSProperties
    onUpload?: (file?: File) => void
}

export function Img({src = "", href, imgClassName, imgStyle, disabled, placeholder, className = "", style, onUpload, ...props}: ImgProps) {
    const [name, setName] = useState<string>();
    const [img, setImg] = useState<string>();

    const inputRef = createRef<HTMLInputElement>();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (!file || file?.name === name) return

        setName(file?.name);
        setImg(URL.createObjectURL(file));

        onUpload && onUpload(file)
    }

    useEffect(() => {
        if (src instanceof File) {
            setName(src.name)
            setImg(URL.createObjectURL(src))
        } else {
            setImg(src)
        }
    }, [src])
    
    return (
        <div 
            style={{...style}} 
            className={`img-previewer flex align-center justify-center column ${className}`} 
            
            {...props}
        >
            {!disabled && <input type="file" accept="image/*" onChange={onChange} hidden ref={inputRef}/>}
            
            {img? 
                href?
                    <a href={href} target="_blank">
                        <img src={img || ""} alt="uploaded" style={{...imgStyle}} className={`img ${imgClassName} ${!disabled ? "active" : ""}`}/> 
                    </a> 
                    :
                    <img src={img || ""} alt="uploaded" style={{...imgStyle}} className={`img ${imgClassName} ${!disabled ? "active" : ""}`}/> 
                : 
                <>
                    {!disabled && <FontAwesomeIcon icon={"fa-upload" as IconProp}/>}
                    <p className="placeholder">{placeholder ||"Upload image"}</p>
                </>
            }

            {!disabled && 
                <div className="absolute img-previewer-actions">
                    <button 
                        className="filled-icon-button pointer" 
                        style={{backgroundColor: "var(--bg-secondary)"}}
                        onClick={() => !disabled && inputRef.current?.click()}
                    >
                        <FontAwesomeIcon icon={"fa-solid fa-pencil" as IconProp}/>
                    </button>
                    <button 
                        className="filled-icon-button pointer" 
                        style={{backgroundColor: "var(--bg-secondary)"}}
                        onClick={() => {
                            if (!disabled) {
                                setImg(undefined)
                                setName(undefined)
                                onUpload && onUpload()
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={"fa-solid fa-ban" as IconProp}/>
                    </button>
                </div>
            }
        </div>
    )
}