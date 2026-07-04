import { type ReactNode, type DetailedHTMLProps, type ButtonHTMLAttributes, type JSX } from "react"

import "./IconButton.scss"

type IconButtonType = {
    className?: string
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

function IconButton ({children, className, ...restProps}: {children: ReactNode} & IconButtonType): JSX.Element
function IconButton ({label, className, ...restProps}: {label: string} & IconButtonType): JSX.Element
function IconButton ({children, className, label, ...restProps}: ({children?: ReactNode, label?: string}) & IconButtonType) {
    return (
        <button type="button" className={`icon-button${className ? " "+className : ""}`} {...restProps}>
            {children ? children : <span className="visually-hidden">{label}</span>}
        </button>
    )
}

export default IconButton