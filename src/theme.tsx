import React, { PropsWithChildren, useContext, useMemo } from 'react'
import { AnyTheme } from './types'

const Context = React.createContext<AnyTheme>({})

export function createTheme<Theme extends AnyTheme>() {
    const ThemeContext = Context as unknown as React.Context<Theme>

    const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: Theme }>) => {
        const parentTheme = useContext(ThemeContext)
        const combinedTheme = useMemo(() => ({ ...parentTheme, ...theme }), [parentTheme, theme])

        return <ThemeContext.Provider value={combinedTheme}>{children}</ThemeContext.Provider>
    }

    return { ThemeContext, ThemeProvider }
}
