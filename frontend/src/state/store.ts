import { BaseState } from ".";
import { loadingType, setStateType } from "../types";


export function baseState<T extends BaseState>(set: setStateType<T>, get: () => T) {
    return {
        loading: {on: false},
        setLoading: (loading: loadingType) => {
            set({loading} as T)
        },
        
        selected: [],
        select(id: string) {
            console.log(`[select] >> selecting ${id}...`)
            const state = get()
            if (state.selected.includes(id)) return
            
            set({
                selected: [...state.selected, id]
            } as T)
        },
        unselect(id?: string) {
            const state = get()
            
            let selected: string[] = []
            if (id) {
                if (!state.selected.includes(id)) return
                selected =state.selected.filter(id_s => id_s !== id)
            } 
            set({selected} as T)
        }
    }
}