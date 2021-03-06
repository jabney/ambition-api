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
 * Store mutable configuration in the db.
 */
const configSchema = new Schema({}, configOptions)

configSchema.index({ type: 1 }, { unique: true })

/**
 * Prevent duplicate model compiling during unit test watching by
 * compiling only if model doesn't already exist.
 */
export const Config = (mongoose.models.Config
  || mongoose.model<IConfigDocument>('Config', configSchema)) as ConfigModel
