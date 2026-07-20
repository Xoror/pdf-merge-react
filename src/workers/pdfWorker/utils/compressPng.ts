import { deflate, inflate } from "pako"
import type { PDFImageData } from "./types"


export const compressPng = (data: PDFImageData, level = 6) => {
    const compressedColorBitArray = deflate(inflate(data.bitArray), {level})
    const compressedAlphaBitArray = data.maskBitArray ? deflate(inflate(data.maskBitArray), {level}) : undefined
    return { compressedColorBitArray, compressedAlphaBitArray}
}

/*
    const canvas = new OffscreenCanvas(data.width, data.height)
    const context = canvas.getContext("2d")
    const png = new PNG({
        width: data.width,
        height: data.height,
        colorType: data.maskBitArray ? 6 : 2,
        inputColorType: data.maskBitArray ? 6 : 2,
        inputHasAlpha: data.maskBitArray ? true : false,
    })
    const pngDataArray = new Uint8Array(data.width * data.height * (data.maskBitArray ? 4 : 3))
    let pixelIdx = 0
    let alphaColorPixelIdx = 0
    const colorPixelArray = inflate(data.bitArray)
    const alphaPixelArray = data.maskBitArray ? inflate(data.maskBitArray) : undefined
    
    for(let i = 0; i < pngDataArray.length; i++) {
        if (alphaPixelArray ) {
            pngDataArray[pixelIdx] = colorPixelArray[pixelIdx]
            pngDataArray[pixelIdx + 1] = colorPixelArray[pixelIdx + 1]
            pngDataArray[pixelIdx + 2] = colorPixelArray[pixelIdx + 2]
            pngDataArray[pixelIdx + 3] = alphaPixelArray ? alphaPixelArray[alphaColorPixelIdx] : 0
            pixelIdx += 4
            alphaColorPixelIdx += 1
        } else {
            pngDataArray[pixelIdx] = colorPixelArray[pixelIdx]
            pngDataArray[pixelIdx + 1] = colorPixelArray[pixelIdx + 1]
            pngDataArray[pixelIdx + 2] = colorPixelArray[pixelIdx + 2]
            pixelIdx += 3
        }
        
    }
    //console.log(pngDataArray)
    png.data = pngDataArray
    const buffer = []
    png.pack()
        .on("data", data => buffer.push(...data))
        .on("end", () => {
            const bla = new Uint8Array(buffer)
            //self.postMessage({mergedPdf: bla, label})
        })
    //self.postMessage({mergedPdf: png.pack().data, label})
    const packedPng = png
    
    const bitmap = await self.createImageBitmap(new ImageData(new Uint8ClampedArray(pngDataArray), data.width))
    
    context?.drawImage(bitmap, 0, 0)
    const compressedBlob = await canvas.convertToBlob({ type: 'image/png'})
    const fullBitArray = pngDataArray// new Uint8Array(await compressedBlob.arrayBuffer())
    let colorBitArray = new Uint8Array(colorPixelArray.length)
    let maskBitArray = new Uint8Array(alphaPixelArray.length)
    let fullIndex = 0
    let colorIndex = 0
    let maskIndex = 0
    while(fullIndex < fullBitArray.length) {
        colorBitArray[colorIndex] = fullBitArray[fullIndex] 
        colorBitArray[colorIndex + 1] = fullBitArray[fullIndex + 1] 
        colorBitArray[colorIndex + 2] = fullBitArray[fullIndex + 2]
        maskBitArray[maskIndex] =  fullBitArray[fullIndex + 3]
        maskIndex += 1
        fullIndex += 4
        colorIndex += 3
    }
    colorBitArray = deflate(colorBitArray, {level: 1})
    maskBitArray = deflate(maskBitArray, {level: 1})

    //self.postMessage({mergedPdf: bitArray, label})
    const colorDictToChange = pages[0].node.context.indirectObjects.get(data.key).dict.dict
    for(const entry of colorDictToChange) {
        const [key, value] = entry
        if(key.encodedName === "/Length") {
            colorDictToChange.set(key, {numberValue: colorBitArray.length, stringValue: colorBitArray.length.toString()})
        }
    }
    const maskDictToChange = pages[0].node.context.indirectObjects.get(data.maskKey).dict.dict
    for(const entry of colorDictToChange) {
        const [key, value] = entry
        if(key.encodedName === "/Length") {
            maskDictToChange.set(key, {numberValue: maskBitArray.length, stringValue: maskBitArray.length.toString()})
        }
    }
    console.log(pages[0].node.context.indirectObjects.get(data.key))
    pages[0].node.context.indirectObjects.get(data.key).contents = deflate(inflate(data.bitArray), {level: 8})//deflate(colorPixelArray, {level: 6})//colorBitArray
    if(data.maskBitArray) pages[0].node.context.indirectObjects.get(data.maskKey).contents =  deflate(inflate(data.maskBitArray), {level: 8})//deflate(alphaPixelArray, {level: 6})//maskBitArray
    newImageData.push(fullBitArray)
    bitmap.close()
}
*/