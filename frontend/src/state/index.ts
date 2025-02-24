import { loadingType } from "../types"

export interface BaseState {
    loading: loadingType
    setLoading: (loading: loadingType) => void

    selected: string[]
    select: (id: string) => void
    unselect: (id?: string) => void
}