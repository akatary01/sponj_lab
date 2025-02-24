type LoadingBarProps = JSX.IntrinsicElements["div"] & {
    progressText?: string
}

export function LoadingBar({progressText = "Loading...", children, className = "", style, ...props}: LoadingBarProps) {
    return (
        <div 
            {...props}
            style={{...style}}
            className={`load-bar-container ${className}`}
        >
            <div className="load-bar">
                <span style={{width: 250}}>
                    <span className="load-bar-progress"></span>
                </span>
            </div>
            <p className="load-bar-text">{progressText}</p>
            {children}
        </div>
    )
}