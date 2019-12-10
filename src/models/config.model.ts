import mongoose, { Document, Schema, Types } from 'mongoose'
import schemaOptions from '../config/schema-options'
import { IConfig } from './config.interface'

export interface IConfigDocument extends IConfig, Document {
  _id: Types.ObjectId

  /* configSchema.methods */
}

type ConfigModel = mongoose.Model<IConfigDocument> & {

  /* configSchema.statics */
}

const configOptions = schemaOptions({
  collection: 'config',
  discriminatorKey: 'type',
})

/**
 *
 */
const configSchema = new Schema({}, configOptions)

configSchema.index({ type: 1 }, { unique: true })

export const Config = mongoose.model<IConfigDocument>('Config', configSchema) as ConfigModel
