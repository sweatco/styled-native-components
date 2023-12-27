import React, { PropsWithChildren, useContext, useMemo } from 'react'
import { AnyTheme } from './types'

export function createTheme<Theme extends AnyTheme>() {
    const ThemeContext = React.createContext<Theme>({} as Theme)

    const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: Theme }>) => {
        const parentTheme = useContext(ThemeContext)
        const combinedTheme = useMemo(() => ({ ...parentTheme, ...theme }), [parentTheme, theme])

        return <ThemeContext.Provider value={combinedTheme}>{children}</ThemeContext.Provider>
    }

    return { ThemeContext, ThemeProvider }
}
