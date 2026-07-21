import { PDFName, PDFObject, PDFPage, PDFRawStream, PDFRef } from "pdf-lib"
import isEqual from "../../../utils/isEqual"
import type { PDFImageData } from "./types"

export const getImagesData = (page: PDFPage,imageKeys: PDFRef[]) => {
    const imagesData = []
    for(const key of imageKeys) {
        const indirectObjects = page.node.context.enumerateIndirectObjects()
        const imageObject = indirectObjects.find(object => isEqual(object[0], key))![1] as PDFRawStream
        console.log(imageObject)
        //console.log(pages[0])
        const getProperty = (id: string) => {
            return imageObject.dict.lookup(PDFName.of(id)) as any ?? {}
        }
        const colorSpaceKey = getProperty("ColorSpace").array[1]
        const colorSpaceObject = indirectObjects.find(object => isEqual(object[0], colorSpaceKey))![1] as PDFRawStream
        
        const data: PDFImageData = {
            key,
            maskKey: imageObject.dict.get(PDFName.of("SMask")) as PDFRef | undefined,
            bitArray: imageObject.contents,
            maskBitArray: getProperty("SMask") ? getProperty("SMask").contents : undefined,
            type: getProperty("Type").encodedName,
            subType: getProperty("Subtype").encodedName,
            width: getProperty("Width").numberValue,
            height: getProperty("Height").numberValue,
            colorSpace: colorSpaceObject,
            bitsPerComponent: getProperty("BitsPerComponent").numberValue,
            filter: getProperty("Filter").encodedName,
        }
        
        imagesData.push(data)
    }
    return imagesData
}