export type UnionShape = Record<string, unknown>;

export type Union<T extends UnionShape> = {
  [C in keyof T]:
    & { kind: C }
    & (T[C] extends void ? Record<string, unknown> : T[C]);
}[keyof T];

export type Kinds<T extends UnionShape> = Array<keyof T>;

export type UnionCaseConstructors<T extends UnionShape> = {
  [C in keyof T]: T[C] extends void ? () => Union<T>
    : (values: T[C]) => Union<T>;
};

export type UnionCaseTypeGuards<T extends UnionShape> = {
  [C in keyof T as `is${Capitalize<string & C>}`]: (
    union: Union<T>,
  ) => union is Extract<Union<T>, { kind: C }>;
};

export type UnionMatcherCases<T extends UnionShape, U> = {
  [V in keyof T]: T[V] extends void ? () => U : (carriedValue: T[V]) => U;
};

export type UnionMatcher<T extends UnionShape> = <U>(
  union: Union<T>,
  cases: UnionMatcherCases<T, U>,
) => U;

export type UnionOf<T extends UnionShape> =
  & UnionCaseConstructors<T>
  & UnionCaseTypeGuards<T>
  & {
    shape: T;
    kinds: () => Kinds<T>;
    isValid: (value: unknown) => value is Union<T>;
    match: UnionMatcher<T>;
  };

export type Infer<T> = T extends UnionOf<infer U> ? Union<U> : never;

const createCaseConstructors = <T extends UnionShape>(shape: T) => {
  const shapeEntries = Object.entries(shape);

  const constructorEntries = shapeEntries.map(([kind, carriedValues]) => {
    const constructorFn = (params: typeof carriedValues) => ({
      kind,
      ...(params ? params : {}),
    });
    return [kind, constructorFn];
  });

  return Object.fromEntries(constructorEntries) as UnionCaseConstructors<T>;
};

const createCaseTypeGuards = <T extends UnionShape>(shape: T) => {
  const shapeKeys = Object.keys(shape);

  const typeGuardEntries = shapeKeys.map((kind) => {
    const functionName = `is${kind.charAt(0).toUpperCase()}${
      kind.substring(1)
    }`;

    const theFunction = (
      param: Union<T>,
    ): param is Extract<Union<T>, { kind: typeof kind }> => {
      return param.kind === kind;
    };

    return [functionName, theFunction];
  });

  return Object.fromEntries(typeGuardEntries) as UnionCaseTypeGuards<T>;
};

/**
 * Creates a union type utilities such as type constructors, matchers, and type guards.
 * `Infer` can be used to extract the actual union type out of the utilities.
 * Use `hasNothing` if a union case does not carry any value, and use `having` if it has some.
 *
 * @example
 * // Initializes the union type utilities
 * const Actions = unionOf({
 *   noop: hasNothing(),
 *   setText: having<{ newText: string }>(),
 *   submit: having<{ isResubmit: boolean, username: string }>(),
 *   reset: hasNothing(),
 * });
 *
 * // Infer the type
 * type Action = Infer<typeof Actions>;
 *
 * // Creates an Action value of variant submit
 * const action = Actions.submit({ isResubmit: true, username: 'detaditya' });
 *
 * // message is "Re-Submitting detaditya"
 * const message = Action.match(action, {
 *   noop: () => 'No operation',
 *   reset: () => 'Resetting',
 *   setText: ({ newText }) => `Setting text ${newText}`,
 *   submit: ({ isResubmit, username }) => `${isResubmit ? 'Re-' : ''}Submitting ${username}`
 * });
 *
 * @see having
 * @see hasNothing
 * @param shape The shape of the union type
 * @returns A union type utility
 */
export const unionOf = <T extends UnionShape>(shape: T): UnionOf<T> => {
  const constructors = createCaseConstructors(shape);
  const typeGuards = createCaseTypeGuards(shape);

  const match = <U>(union: Union<T>, cases: UnionMatcherCases<T, U>) => {
    const caseFunction = cases[union.kind];
    return caseFunction(union as T[keyof T]);
  };

  const kinds = () => {
    return Object.keys(shape) as Kinds<T>;
  };

  const isValid = (value: unknown): value is Union<T> => {
    return (
      typeof value === "object" &&
      !Array.isArray(value) &&
      value !== null &&
      "kind" in value &&
      kinds().includes(String(value.kind)) &&
      Object.values(typeGuards).reduce(
        (acc, typeGuard) => acc || typeGuard(value),
        false,
      )
    );
  };

  return {
    shape,
    match,
    kinds,
    isValid,
    ...typeGuards,
    ...constructors,
  };
};

/**
 * Register a union case to carry a certain type.
 * Use it in conjunction with `unionOf`.
 *
 * @see unionOf
 */
export const having = <T>(): T => {
  return null as T;
};

/**
 * Register a union case to have no carried type.
 * Use it in conjunction with `unionOf`.
 *
 * @see unionOf
 */
export const hasNothing = () => {};
