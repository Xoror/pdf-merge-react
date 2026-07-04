import { useMemo, useState } from "react"

import "./SplicePdfs.scss"

import Button from "./basic-ui/Button"
import Form from "./basic-ui/Form"
import Vr from "./vertical-separator/Vr"

import { usePDFContext } from "../context/PDFContext"
import ErrorArray from "../utils/ErrorArray"
import SortableList from "./sortable-list/SortableList"

type SpliceOrderEntry = {
    id: string,
    label: string, 
    fromPage: number,
    toPage: number,
    pages: number
}

const SplicePdfs = () => {
    const {files, formState, handleChange, clearFiles} = usePDFContext()
    const [spliceOrder, setSpliceOrder] = useState<Array<SpliceOrderEntry>>([])
    const [fileToAdd, setFileToAdd] = useState("")
   
    const hasDeletedFiles = useMemo(() => {
        const fileNames = files.map(file => file.label)
        const filteredSpliceFiles = spliceOrder.filter(file => !fileNames.includes(file.label)).map(file => file.label)
        return filteredSpliceFiles
    }, [files, spliceOrder])
    if(hasDeletedFiles.length > 0) {
        setSpliceOrder(prev => {
            return prev.filter(file => !hasDeletedFiles.includes(file.label))
        })
    
    }
    if(spliceOrder.length === 0 && files.length > 0) {
        setSpliceOrder((prev) => {
            return files.map(file => ({
                id: crypto.randomUUID(),    
                label: file.label,
                fromPage: 1,
                toPage: file.pages,
                pages: file.pages
            }))
        })
    }

    const handleAddFileChange = (event: (React.ChangeEvent<HTMLButtonElement> & { target: { value?: any }})) => {
        setFileToAdd(event.target.value)
    }
    const handleAddFile = () => {
        setSpliceOrder(prev => {
            const newSpliceOrder = ErrorArray.from(prev)
            const newFileToAdd = files.find(file => file.label === fileToAdd)
            if(!newFileToAdd) return prev
            newSpliceOrder.push({
                id: crypto.randomUUID(),
                label: newFileToAdd.label,
                fromPage: 1,
                toPage: newFileToAdd.pages,
                pages: newFileToAdd.pages
            })
            return newSpliceOrder
        })
        setFileToAdd("")
    }
    return(
        <div className="splice-container">
            <div className="uploaded-files">
                <label>Order in which to merge files</label>
                <SortableList 
                    render={(file, index) => 
                        <>
                            <Vr />
                            <p>{file.label}<Form.Control name={`${index}-label`} tabIndex={-1} defaultValue={file.label} className="visually-hidden" aria-hidden/></p>
                            <Vr />
                            <Form.Group className="page-form-group" controlId={`from-page-control-${index}`} vertical>
                                <Form.Label>From Page</Form.Label>
                                <Form.Control name={`${index}-fromPage`} type="number" inputMode="numeric" min={1} max={file.pages} defaultValue={1}/>
                            </Form.Group>
                            <Vr />
                            <Form.Group className="page-form-group" controlId={`to-page-control-${index}`} vertical>
                                <Form.Label>To (and including) Page</Form.Label>
                                <Form.Control name={`${index}-toPage`} type="number" inputMode="numeric" min={1} max={file.pages} defaultValue={file.pages}/>
                            </Form.Group>
                            <Vr />
                        </>
                    }
                    className="uploaded-files-list" data={spliceOrder} setData={setSpliceOrder}
                />
            </div>
            <div className="uploaded-files-controls">
                <Form.Group controlId="add-file-to-splice">
                    <Form.Label>Add File to splice</Form.Label>
                    <Form.Select value={fileToAdd} onChange={handleAddFileChange}>
                        <Form.Select.Option value={""}>Select file to add...</Form.Select.Option>
                        {files.map(file => 
                            <Form.Select.Option key={file.id} value={file.label}>{file.label}</Form.Select.Option>
                        )}
                    </Form.Select>
                    <Button onClick={handleAddFile} style={{width:"100%"}}>Add</Button>
                </Form.Group>
                <Form.Group controlId="merged-file-label">
                    <Form.Label>Merged File Name</Form.Label>
                    <Form.Control as="input" type="text" inputMode="text" onChange={handleChange} {...formState}/>
                </Form.Group>
                <Button type="submit">Merge and Download</Button>
                <Button onClick={clearFiles}>Clear</Button>
            </div>
        </div>
    )
}

export default SplicePdfs