export type themeType = {
    bg: themeEntryType
    font: themeEntryType
    playground: themeEntryType
}

export type themeEntryType = {
    [key: string]: string
}

export type themeContextType = {
    theme: themeType
    setTheme: (theme: themeType) => void
}

export type loadingType = {
    on?: boolean
    progressText?: string
}

export type setStateType<T> = {
    _(partial: T | Partial<T> | {
        _(state: T): T | Partial<T>;
    }['_'], replace?: false): void;
    _(state: T | {
        _(state: T): T;
    }['_'], replace: true): void;
}['_'];