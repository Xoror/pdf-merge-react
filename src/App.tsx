import { useMemo, useRef, useState } from "react"
import "./pdf-manage.scss"

import { FileArrowDownIcon } from "@phosphor-icons/react"

import Form from "./components/basic-ui/Form"
import MergePdfs from "./components/MergePdfs"
import Tabs from "./components/basic-ui/Tabs"
import SplicePdfs from "./components/SplicePdfs"

import FileUploadButton from "./components/file-upload-button/FileUploadButton"
import { PDFDocument, PDFPage } from 'pdf-lib'
import { windowsFileNameAllowed } from "./utils/regex"
import ErrorArray from "./utils/ErrorArray"
import debounce from "./utils/debounce"
import { type FileObject, type FormStateType, PDFContextProvider, type PDFContextType } from "./context/PDFContext"

const PDFTabs = [
    {
        label: "Merge",
        id: "merge",
        component: MergePdfs
    },
    {
        label: "Splice",
        id: "splice",
        component: SplicePdfs
    }
] as const
type PDFTabIds = ((typeof PDFTabs) extends readonly (infer U)[] ? U : never)["id"]

const PdfMerge = () => {
    const dndZoneRef = useRef<HTMLFormElement>(null)
    const [files, setFiles] = useState(new ErrorArray<FileObject>())
    const [ formState, setFormState ] = useState<FormStateType>({
        name: "mergedLabel",
        defaultValue: ""
    })
    const [activeTab, setActiveTab] = useState<PDFTabIds>("merge")
    const hasFiles = files.length != 0
    
    const handleTabChange = (tabId: PDFTabIds) => {
        setActiveTab(tabId)
    }

    const clearFiles: PDFContextType["clearFiles"] = () => {
        setFiles(new ErrorArray<FileObject>())
    }
    const updateFiles = async (files: FileList) => {
        const filesArray = Array.from(files)
        const filteredFiles = filesArray.filter(file => file.type === "application/pdf")
        let error = undefined
        if(filteredFiles.length < filesArray.length) {
            error = "You can only upload PDF files!"
        }
        const pdfFiles = [] as FileObject[]
        for(let file of filteredFiles) {
            const pdfFilesBuffer = await file.arrayBuffer()
            const pdfFile = await PDFDocument.load(pdfFilesBuffer)
            pdfFiles.push({id: file.name, label: file.name, data: pdfFile, pages: pdfFile.getPageCount()})
        }
         setFiles(prev => {
            const newFiles = prev.concat(pdfFiles)
            newFiles.error = error
            return newFiles
        })
    }
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if(!files) return
        await updateFiles(files)
    }

    const validateLabel = (label: string) => {
        const isValidLabel = label.match(windowsFileNameAllowed.regex)
        let error = undefined
        if(!isValidLabel) {
            error = {message:windowsFileNameAllowed.message}
        }
        if(label === "") {
            error = {message:"You must provide a name for the merged file!"}
        }
        return error
    }
    const mergeAndDownload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = dndZoneRef.current
        if(!form) return
        if(formState.error) return
        if(!files) return
        const mergedPdf = await PDFDocument.create()
        const formData = new FormData(form)
        if(activeTab === "splice") {
            const formDataArray = Array.from(formData)
            const pageOrder = [] as { label: string, fromPage: any, toPage: any }[]
            formDataArray.forEach((entry,) => {
                if(entry[0].includes(`-`)) {
                    const fileIndex = parseInt( entry[0].split("-")[0] )
                    if(pageOrder[fileIndex] === undefined) pageOrder[fileIndex] = {} as { label: string, fromPage: string, toPage: string }
                    const label = entry[0].split("-")[1] as keyof { label: string, fromPage: string, toPage: string }
                    const value = entry[1]
                    pageOrder[fileIndex][label] = value
                }
            })
            const pagesByFile = {} as {[label: string]: PDFPage[]}
            for (const file of files) {
                //const arrayBuffer = await file.arrayBuffer()
                //const pdf = await PDFDocument.load(arrayBuffer)
                const pdf = file.data
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

                pagesByFile[file.label] = pages as PDFPage[]
            }
            pageOrder.forEach((entry, ) => {
                const { label, fromPage, toPage} = entry
                const fileData = files.find(file => file.label === label)
                if(!fileData) return
                const pages = pagesByFile[label]
                pages.forEach((page, index) => {
                    if(index >= fromPage - 1 && index <= toPage - 1) {
                        mergedPdf.addPage(page)
                        //newPages.push(page)
                    }
                })
            })
        }
        if(activeTab === "merge") { 
            
            for (const file of files) {
                //const arrayBuffer = await file.arrayBuffer()
                //const pdf = await PDFDocument.load(arrayBuffer)
                const pdf = file.data
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

                pages.forEach(page => mergedPdf.addPage(page))
            }
        }
        console.log(mergedPdf.getPageIndices())
        const pdfBytes = await mergedPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const a = document.createElement('a')
        a.download = formData.get("mergedLabel")! as string
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }
    const handleChange: PDFContextType["handleChange"] = debounce((event) => {
        const target = event.target
        const value = target.value
        const error = validateLabel(value)
        setFormState(prev => ({...prev, defaultValue: value, error}))
    }, 200)
    const handleDragEnter = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        const dndZone = dndZoneRef.current
        if(!dndZone) return
        dndZone.classList.add("drag-hover")
    }
    const handleDragLeave = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        const dndZone = dndZoneRef.current
        if(!dndZone) return
        dndZone.classList.remove("drag-hover")
    }
    const handleDragOver = (event: React.DragEvent<HTMLFormElement>) => {
        //this is here so bc dragOver will fire when you drop files, so browser default behaviour
        // will also occur
        event.preventDefault()
        event.stopPropagation()
    }
    const handleDrop = async (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        const droppedFiles = event.dataTransfer.files
        
        if(!droppedFiles || droppedFiles.length === 0) return
        await updateFiles(droppedFiles)
        handleDragLeave(event)
    }

    const context = useMemo(() => ({
        files,
        setFiles,
        hasFiles,
        handleChange,
        formState,
        clearFiles,
    }), [files, hasFiles, formState])

    return (
        <PDFContextProvider context={context}>
            <div className="pdf-merge">
                <Form 
                    ref={dndZoneRef} className="dnd-zone"
                    onSubmit={mergeAndDownload}
                    onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onDragEnd={handleDragOver} onDrag={handleDragOver} onDragOver={handleDragOver}
                >
                    <h1 className="h4">Merge your pdfs. No account needed, for free, all locally in your browser.</h1>
                    {true ? 
                        <div className="dnd-label">
                            <p>Drag and Drop your files here or use the button below!</p>
                            <FileArrowDownIcon aria-hidden size={"2.5rem"} weight="bold" color="white"/>
                            <FileUploadButton inputProps={{multiple: true, accept: "application/pdf"}} onFileUpload={handleFileUpload} controlId="upload-button-merge-pdfs">Upload files</FileUploadButton>
                        </div> : null
                    }
                    {files.error ? 
                        <p role="alert" className="upload-error">
                            {files.error}
                        </p> : null
                    }
                    {hasFiles ?
                        <Tabs 
                            theme="file-drawer" className="sg-file-drawer."
                            controlId="pdf-edit-tabs" defaultActive="merge" active={activeTab} onTabChange={handleTabChange}
                        >
                            <Tabs.Controls>
                                {PDFTabs.map(tab => 
                                    <Tabs.Button key={tab.id+"-button"} tabId={tab.id} >{tab.label}</Tabs.Button>
                                )}
                            </Tabs.Controls>
                            <Tabs.Content>
                                {PDFTabs.map(tab => 
                                    <Tabs.Page key={tab.id+"-page"} tabId={tab.id}>
                                        <tab.component />
                                    </Tabs.Page>
                                )}
                            </Tabs.Content>
                        </Tabs> : null
                    }
                </Form>
            </div>
        </PDFContextProvider>
    )
}

export default PdfMerge