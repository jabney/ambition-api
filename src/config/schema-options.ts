import { SchemaOptions } from 'mongoose'
import { defaultOptions } from '../lib/default-options'

const defaults: SchemaOptions = {
  typeKey: '$type',
  autoIndex: true,
}

export const schemaOptions = defaultOptions(defaults)

export default schemaOptions
