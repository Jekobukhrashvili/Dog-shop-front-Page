type ToastListener = (message: string, type?: 'success' | 'error') => void

let listener: ToastListener | null = null

export function bindToast(fn: ToastListener) {
  listener = fn
}

export function unbindToast() {
  listener = null
}

export function showToast(message: string, type?: 'success' | 'error') {
  if (listener) listener(message, type)
} 