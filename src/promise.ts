export const rejectify = <T extends (...args: any[]) => any>(fn: T) => (...args: Parameters<T>) => Promise.reject(fn(...args))
