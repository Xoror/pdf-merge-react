import type { PDFImageData } from "./types"

export const compressJpg = async (data: PDFImageData, quality: number) => {
    const canvas = new OffscreenCanvas(data.width, data.height)
    const context = canvas.getContext("2d")!
    
    const blob = new Blob([data.bitArray.buffer as ArrayBuffer])
    const bitmap = await self.createImageBitmap(blob)
    
    //context.scale(0.8,0.8)
    context.drawImage(bitmap, 0, 0)
    const compressedBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: quality })
    const bitArray = new Uint8Array(await compressedBlob.arrayBuffer())
    return bitArray
}