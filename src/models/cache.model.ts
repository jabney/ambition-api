import mongoose, { Document, Schema, Types } from 'mongoose'
import schemaOptions from '../config/schema-options'
import { ICache } from './cache.interface'

export interface ICacheDocument extends ICache, Document {
  _id: string

  /* configSchema.methods */
}

type CacheModel = mongoose.Model<ICacheDocument> & {

  /* configSchema.statics */
}

/**
 *
 */
const cacheSchema = new Schema({
  _id: { $type: String, required: true },
  data: { $type: String, required: true },
}, schemaOptions({ collection: 'cache', timestamps: true }))

export const Cache = mongoose.model<ICacheDocument>('Config', cacheSchema) as CacheModel
