import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext } from "react"

import { type DebouncedFunc } from "../utils/debounce"
import ErrorArray from "../utils/ErrorArray"
import { PDFDocument } from "pdf-lib"
import { type ErrorType } from "../components/basic-ui/Form"

export type FormStateType = {
    label: {
        name: "mergedLabel",
        //defaultValue: string
    },
    compression: {
        name: "compressionLevel",
        defaultValue:"none"
    },
    error?: ErrorType
}
export type FileObject = {
    id: string,
    label: string,
    data: ArrayBuffer,
    pages: number
}

export type PDFContextType = {
    files: ErrorArray<FileObject>,
    setFiles: Dispatch<SetStateAction<PDFContextType["files"]>>,
    hasFiles: boolean,
    handleChange: DebouncedFunc<(event: React.ChangeEvent<HTMLInputElement>) => void>,
    formState: FormStateType,
    clearFiles: () => void
}
const PDFContext = createContext<PDFContextType | null>(null)
export const usePDFContext = () => {
    const context = useContext(PDFContext)
    if(!context) {
        throw new Error("You have to use usePDFContext within the proper provider!")
    }
    return context
}
export const PDFContextProvider = ({children, context}:{children: ReactNode, context: PDFContextType}) => {
    return(
        <PDFContext.Provider value={context}>
            {children}
        </PDFContext.Provider>
    )
}