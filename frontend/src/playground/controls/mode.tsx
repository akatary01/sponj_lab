// custom imports
import { selector } from "../state";
import { usePlaygroundStore } from "../state/store";

// third party
import { useShallow } from "zustand/shallow";
import { playgroundModeType } from "../types";



type ModeControlsProps = JSX.IntrinsicElements["div"] & {
}

const modeOptions: playgroundModeType[] = ["mesh", "wireframe"]
export default function ModeControls({className, children, ...props}: ModeControlsProps) {
    const {mode, setMode} = usePlaygroundStore(useShallow(selector))

    return (
        <div className="playground-mode-controls">
            {modeOptions.map(option => {
                return (
                    <button 
                        onClick={() => setMode(option)}
                        key={`playground-mode-${option}`}
                        className={`${mode === option ? "playground-mode-active" : ""}`}
                    >
                        {option}
                    </button>
                )
            })}
        </div>
    )
}