import { PDFDocument, PDFPage } from "pdf-lib"
import type { FileObject } from "../../context/PDFContext"
import type { PDFTabIds } from "../../App"
import { deflate, inflate } from "pako"
import { PNG } from "pngjs/browser"
import { getXObjectsFromPage } from "./utils/getXObjectsFromPage"
import { getImagesData } from "./utils/getImagesData"
import { compressJpg } from "./utils/compressJpg"
import { compressPng } from "./utils/compressPng"

export type WorkerInputype = {
    formData: [string, FormDataEntryValue][],
    files: Array<FileObject>,
    type: PDFTabIds
}
export type WorkerReturnType = {
    mergedPdf: Uint8Array<ArrayBuffer>,
    label: string
}

const compressionLevels = [
    {
        id: "none",
        label: "None",
        jpgQuality: 0.9,
        pngLevel: 6,
    },
    {
        id: "low",
        label: "Low",
        jpgQuality: 0.7,
        pngLevel: 7
    },
    {
        id: "medium",
        label: "Medium",
        jpgQuality: 0.4,
        pngLevel: 8,
    },
    {
        id: "high",
        label: "High",
        jpgQuality: 0.1,
        pngLevel: 9,
    }
] as const
type CompressionLevelsIds = (typeof compressionLevels)[number]["id"]
const getCompressionLevelById = (id: CompressionLevelsIds) => {
    return compressionLevels.find(level => level.id === id)
}

//formData.get("mergedLabel")! as string
self.onmessage = async (event: MessageEvent<WorkerInputype>) => {
    const { formData, files, type } = event.data
    const mergedPdf = await PDFDocument.create()
    
    const label = formData.find(keyValuePair => keyValuePair[0] === "mergedLabel")![1]
    console.log(formData)
    const compressionLevelId = formData.find(keyValuePair => keyValuePair[0] === "compressionLevel")![1] as CompressionLevelsIds
    const compressionLevel = compressionLevels.find(level => level.id === compressionLevelId) ?? {jpgQuality: 1, pngLevel: 6}
    console.log(compressionLevel)
    const pagesByFile = {} as {[id: string]: PDFPage[]}
    for(const file of files) {
        const pdf = await PDFDocument.load(file.data)   
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        console.log(compressionLevelId)
        if(compressionLevelId != "none") {
            for(const page of pages) {
                //console.log(page)
                const keysToImages = getXObjectsFromPage(page)
                const imagesData = getImagesData(page, keysToImages)

                for( const data of imagesData) {
                    if(data.filter === "/DCTDecode") {
                        const compressedJpg = await compressJpg(data, compressionLevel.jpgQuality)
                        const indirectObjects = page.node.context.indirectObjects.get(data.key)
                        page.node.context.indirectObjects.get(data.key).contents = compressedJpg
                        //console.log(indirectObjects.dict.dict)
                        for(const entry of indirectObjects.dict.dict) {
                                const [key, value] = entry
                                if(key.encodedName === "/Width") {
                                    
                                    //indirectObjects.dict.dict.set(key, {numberValue: (value.numberValue*0.8), stringValue: (value.numberValue*0.8).toString()})
                                }
                                if(key.encodedName === "/Height") {
                                    //indirectObjects.dict.dict.set(key, {numberValue: (value.numberValue*0.8), stringValue: (value.numberValue*0.8).toString()})
                                }
                                //console.log(indirectObjects.dict.dict)
                            }
                    } else {
                        const { compressedColorBitArray, compressedAlphaBitArray } = compressPng(data, compressionLevel.pngLevel)
                        
                        page.node.context.indirectObjects.get(data.key).contents = compressedColorBitArray
                        const colorDictToChange = page.node.context.indirectObjects.get(data.key).dict.dict
                        for(const entry of colorDictToChange) {
                            const [key, value] = entry
                            if(key.encodedName === "/Length") {
                                colorDictToChange.set(key, {numberValue: compressedColorBitArray.length, stringValue: compressedColorBitArray.length.toString()})
                            }
                        }

                        if(compressedAlphaBitArray) {
                            page.node.context.indirectObjects.get(data.maskKey).contents = compressedAlphaBitArray
                            const maskDictToChange = page.node.context.indirectObjects.get(data.maskKey).dict.dict
                            for(const entry of colorDictToChange) {
                                const [key, value] = entry
                                if(key.encodedName === "/Length") {
                                    maskDictToChange.set(key, {numberValue: compressedAlphaBitArray.length, stringValue: compressedAlphaBitArray.length.toString()})
                                }
                            }
                        }
                    }
                    
                }
            }
        }
        pagesByFile[file.id] = pages as PDFPage[]
    }
    
    if(type === "splice") {
        const formDataArray = formData//Array.from(formData)
        //TODO make this scalable/extensible easier
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
        
        pageOrder.forEach((entry, ) => {
            const { label, fromPage, toPage} = entry
            const fileData = files.find(file => file.label === label)
            if(!fileData) return
            const pages = pagesByFile[fileData.id]
            pages.forEach((page, index) => {
                if(index >= fromPage - 1 && index <= toPage - 1) {
                    mergedPdf.addPage(page)
                    //newPages.push(page)
                }
            })
        })
        
    }
    if(type === "merge") { 
        Object.entries(pagesByFile).forEach(async keyValuePair => {
            const [_, pages] = keyValuePair
            pages.forEach(page => mergedPdf.addPage(page))
        })
    }
    
    const pdfBytes = await mergedPdf.save() as unknown as ArrayBuffer
    
    self.postMessage({mergedPdf: pdfBytes, label})
}