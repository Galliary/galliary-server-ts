export const passValue =
  <T>(value: T): (() => T) =>
  () =>
    value
