import mongoose, { Document, Schema, Types } from 'mongoose'
import schemaOptions from '../config/schema-options'
import { IConfigDocument, Config } from './config.model'

export interface IWhitelistDocument extends IConfigDocument {
  allowed: string[]

  /* whitelistSchema.methods */
}

type WhitelistModel = mongoose.Model<IWhitelistDocument> & {

  /* whitelistSchema.statics */
}

/**
 *
 */
const whitelistSchema = new Schema({
  allowed: [String]
}, schemaOptions())

export const Whitelist = <WhitelistModel>Config.discriminator<IWhitelistDocument>('Whitelist', whitelistSchema)
