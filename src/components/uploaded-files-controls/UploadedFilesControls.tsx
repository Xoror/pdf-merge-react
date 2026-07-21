import type { ReactNode } from "react"

import "./UploadedFilesControls.scss"

import Button from "../basic-ui/Button"
import Form from "../basic-ui/Form"

import { usePDFContext } from "../../context/PDFContext"

type UploadedFilesControlsProps = {
    children?: ReactNode
}
//const selectHint = {message:"The effectiveness of compression depends a heavily on the document in question, so try multiple levels of compression to find one that fits your need. THere is a chance even high won't do a lot of compression if it's jsut a text document hough."}
const UploadedFilesControls = ({children}: UploadedFilesControlsProps) => {
    const { files, handleChange, clearFiles, formState } = usePDFContext()
    return(
        <div className="uploaded-files-controls">
            {children}
            <Form.Group controlId="merged-file-label">
                <Form.Label>Merged File Name</Form.Label>
                <Form.Control required as="input" type="text" inputMode="text" onChange={handleChange} defaultValue={files[0].label.split(".")[0]} {...formState.label}/>
            </Form.Group>
            <Form.Group controlId="compression-level">
                <Form.Label>Compression Level</Form.Label>
                <Form.Select  {...formState.compression}>
                    <Form.Select.Option value={"none"}>None</Form.Select.Option>
                    <Form.Select.Option value={"low"}>Low</Form.Select.Option>
                    <Form.Select.Option value={"medium"}>Medium</Form.Select.Option>
                    <Form.Select.Option value={"high"}>High</Form.Select.Option>
                </Form.Select>
            </Form.Group>
            <Button type="submit">Merge and Download</Button>
            <Button onClick={clearFiles}>Clear</Button>
        </div>
    )
}

export default UploadedFilesControls