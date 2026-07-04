import { debounce as _debounce } from "es-toolkit"
import { type DebouncedFunction as _DebouncedFunc} from "es-toolkit"

const debounce = _debounce

export type DebouncedFunc<T extends (...args: any[]) => any> = _DebouncedFunc<T>
export default debounce