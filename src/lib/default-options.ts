/**
 * Return a function that takes an options object and applies
 * it to a default options object, e.g.,
 *
 *   ```
 *   // Get a function configured with default options.
 *   const myOptsFn = defaultOptions({ color: 'red', size: 15 })
 *
 *   // Override one or more of the default options.
 *   const myOpts = myOptsFn({ size: 12 }) // { color: 'red', size: 12 }
 *   ```
 */
export function defaultOptions<T>(defaults: T) {
  const optionsFn = (options?: T) => <T>Object.assign({}, defaults, options)
  return optionsFn
}

export default defaultOptions
