import mongoose, { Document, Schema, Types } from 'mongoose'
import schemaOptions from '../config/schema-options'
import { Config, IConfigDocument } from './config.model'

export interface IWhitelistDocument extends IConfigDocument {
  allowed: string[]

  /* whitelistSchema.methods */
}

type WhitelistModel = mongoose.Model<IWhitelistDocument> & {

  isWhitelisted: (email: string) => Promise<boolean>,
  /* whitelistSchema.statics */
}

/**
 *
 */
const whitelistSchema = new Schema({
  allowed: [String],
}, schemaOptions())

whitelistSchema.statics.isWhitelisted = async function(this: WhitelistModel, email: string) {
  const whitelist = await this.findOne({ allowed: email })
  return whitelist != null
}

export const Whitelist = Config.discriminator<IWhitelistDocument>('Whitelist', whitelistSchema) as WhitelistModel
