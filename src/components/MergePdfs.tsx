import "./MergePdfs.scss"

import Button from "./basic-ui/Button"
import Form from "./basic-ui/Form"
import SortableList from "./sortable-list/SortableList"
import UploadedFilesControls from "./uploaded-files-controls/UploadedFilesControls"

import { usePDFContext } from "../context/PDFContext"

const MergePdfs = () => {
    const {files, setFiles} = usePDFContext()

    return(
        <div className="merge-container">
            <div className="uploaded-files">
                <label>Order in which to merge files</label>
                <SortableList 
                    className="uploaded-files-list" data={files} setData={setFiles}
                    render={(file,) => <p>{file.label}</p>} 
                />
            </div>
            <UploadedFilesControls />
        </div>
    )
}

export default MergePdfs