export type ValidationResult<T> =
  | ValidResult<T>
  | InvalidResult

type ValidResult<T> = { kind: 'valid', isValid: true, value: T }
type InvalidResult = { kind: 'invalid', isValid: false, message: string }

export const valid = <T>(value: T): ValidationResult<T> => ({ kind: 'valid', isValid: true, value })
export const invalid = <T>(message: string): ValidationResult<T> => ({ kind: 'invalid', isValid: false, message })

const bind = <T, U>(func: (value: T) => ValidationResult<U>, current: ValidationResult<T>) => {
  switch (current.kind) {
    case 'valid':
      return func(current.value)
    case 'invalid':
      return current
  }
}

const hasKey = <T extends object>(property: PropertyKey, value: T): property is keyof T => {
  return property in value;
}

export const isKeyNumber = <T extends object, const P extends string>(property: P, value: T): value is T & { [Q in P]: number } => {
  return hasKey(property, value) && typeof(value[property]) === 'number'
}

export const isKeyString = <T extends object, const P extends string>(property: P, value: T): value is T & { [Q in P]: string } => {
  return hasKey(property, value) && typeof(value[property]) === 'string'
}
