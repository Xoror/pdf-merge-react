import type { PDFObject, PDFRef } from "pdf-lib"

export type PDFImageData = {
    key: PDFRef,
    maskKey?: PDFRef,
    bitArray: Uint8Array<ArrayBufferLike>,
    maskBitArray?: Uint8Array<ArrayBufferLike>,
    type: string,
    subType: string,
    width: number,
    height: number,
    colorSpace: PDFObject,
    bitsPerComponent: number,
    filter: string
}