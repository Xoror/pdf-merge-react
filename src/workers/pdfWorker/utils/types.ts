import type { PDFObject } from "pdf-lib"

export type PDFImageData = {
    key: PDFObject,
    maskKey?: PDFObject,
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