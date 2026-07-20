import { PDFObject, PDFPage, PDFName, PDFDict } from "pdf-lib"

export const getXObjectsFromPage = (page: PDFPage): PDFObject[] => {
    let imageKeys = [] as PDFObject[]
    const resourcesMap = page.node.Resources()
    console.log(resourcesMap)
    if(resourcesMap) {
        const xobjectMap = resourcesMap.get(PDFName.of("XObject")) as PDFDict | undefined
        imageKeys = xobjectMap ? [...xobjectMap.values()] : []
    }
    return imageKeys
}