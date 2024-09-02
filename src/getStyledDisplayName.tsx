import { AnyComponent } from "./types"

function getDisplayName(Component: AnyComponent) {
    return Component.displayName || Component.name || 'Component'
}
  
export function getStyledDisplayName(Component: AnyComponent) {
    return `Styled(${getDisplayName(Component)})`
}
