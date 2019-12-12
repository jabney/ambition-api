import { SchemaOptions } from 'mongoose'
import { defaultOptions } from '../lib/default-options'

/**
 * Standard options for all Mongoose schemas.
 */
const defaults: SchemaOptions = {
  typeKey: '$type',
  autoIndex: true,
}

// Export a default schema options helper.
export const schemaOptions = defaultOptions(defaults)

export default schemaOptions
