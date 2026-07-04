import { type DetailedHTMLProps, type Dispatch, type HTMLAttributes, type ReactNode, type SetStateAction } from "react"

import IconButton from "../icon-button/IconButton"
import { XIcon, CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react"


type SortableListType<T extends Array<any>> = {
    data: T,
    setData : Dispatch< SetStateAction< T > >
    render: (file: T[number], index: number) => ReactNode
} & DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>

const SortableList = <T extends {label: string, id: string}[], >({data, setData, render, ...restProps}: SortableListType<T>) => {
    const handleSortClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: "up" | "down", currentIndex: number) => {
        const indexChange = type === "up" ? -1 : 1
        let newIndex = currentIndex + indexChange
        if(newIndex < 0) newIndex = 0
        if(newIndex >= data.length) newIndex = data.length - 1
        console.log("click")
        setData(prev => {
            let temp = [...prev] as typeof prev
            [temp[currentIndex], temp[newIndex]] = [temp[newIndex], temp[currentIndex]]
            return temp
        })
    }
    const handleDeleteFile = (index: number) => {
        setData(prev => {
            const newFilesList = prev.slice(0, index).concat(prev.slice(index+1, prev.length)) as typeof prev
            return newFilesList
        })
    }

    return(
        <ul {...restProps}>
            {data.map((file, index) => 
                // file name as key should be fine because files can;'t have the same name
                // at least in windows
                <li key={file.id}>
                    <div>
                        <IconButton className="files-list-button" label={`remove file ${file.label}`} onClick={() => handleDeleteFile(index)}>
                            <XIcon weight="bold" size="1.5rem" aria-hidden="true"/>
                        </IconButton>
                        {render(file, index)}
                        {index > 0 ?
                            <IconButton className="files-list-button" label={`move file ${file.label} one place up`} onClick={event => handleSortClick(event, "up", index)}>
                                <CaretUpIcon weight="bold" size="1.5rem" aria-hidden="true"/>
                            </IconButton> : null
                        }
                        {index < data.length - 1 ? 
                            <IconButton className="files-list-button" label={`move file ${file.label} one place down`} onClick={event => handleSortClick(event, "down", index)}>
                                <CaretDownIcon weight="bold" size="1.5rem" aria-hidden="true"/>
                            </IconButton> : null
                        }
                    </div>
                </li>
            )}
        </ul>
    )
}

export default SortableList