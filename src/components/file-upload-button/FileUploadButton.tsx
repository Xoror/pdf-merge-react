import { type ReactNode, useRef } from "react";
import "./FileUploadButton.scss"

import Button, { type SGButtonType } from "../basic-ui/Button";

type FileUploadButtonProps = {
    children: ReactNode,
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
    controlId: string,
    inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
} & SGButtonType

const FileUploadButton = ({children, className, onClick, onFileUpload, controlId, id, ref, inputProps, ...restProps}: FileUploadButtonProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const input = inputRef.current
        if(input) {
            input.click()
        }
        if(onClick) {
            onClick(event)
        }
    }
    return (
        <>
            <Button ref={ref} id={controlId ?? id} className={className} onClick={handleClick} {...restProps}>
                {children}
            </Button>
            <input {...inputProps} aria-labelledby={controlId ?? id} ref={inputRef} className="file-upload-button" type="file" onChange={onFileUpload}></input>
        </>
    )
}
FileUploadButton.displayName = "FileUploadButton"

export default FileUploadButton