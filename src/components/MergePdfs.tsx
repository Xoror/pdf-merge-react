import "./MergePdfs.scss"

import Button from "./basic-ui/Button"
import Form from "./basic-ui/Form"
import SortableList from "./sortable-list/SortableList"

import { usePDFContext } from "../context/PDFContext"

const MergePdfs = () => {
    const {files, setFiles, formState, handleChange, clearFiles} = usePDFContext()

    return(
        <div className="merge-container">
            <div className="uploaded-files">
                <label>Order in which to merge files</label>
                <SortableList 
                    className="uploaded-files-list" data={files} setData={setFiles}
                    render={(file, index) => <p>{file.label}</p>} 
                />
            </div>
            <div className="uploaded-files-controls">
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

export default MergePdfs