import mongoose, { Document, Schema, Types } from 'mongoose'
import schemaOptions from '../config/schema-options'
import { Config, IConfigDocument } from './config.model'

export interface IWhitelistDocument extends IConfigDocument {
  allowed: string[]

  /* whitelistSchema.methods */
}

type WhitelistModel = mongoose.Model<IWhitelistDocument> & {

  isWhitelisted: (email: string) => Promise<boolean>,
  addToWhitelist: (email: string) => Promise<void>,
  removeFromWhitelist: (email: string) => Promise<void>,
  allowed: () => Promise<string[]>,

  /* whitelistSchema.statics */
}

/**
 *
 */
const whitelistSchema = new Schema({
  allowed: [String],
}, schemaOptions())

/**
 * Return true if the given email is whitelisted.
 */
whitelistSchema.statics.isWhitelisted = async function(this: WhitelistModel, email: string) {
  const whitelist = await this.findOne({ allowed: email })
  return whitelist != null
}

/**
 * Add an email address to the whitelist.
 */
whitelistSchema.statics.addToWhitelist = async function(this: WhitelistModel, email: string) {
  await Whitelist.updateOne({}, { $addToSet: { allowed: email }}, {
    upsert: true,
    runValidators: true,
  })
}

/**
 * Remove an email address from the whitelist.
 */
whitelistSchema.statics.removeFromWhitelist = async function(this: WhitelistModel, email: string) {
  await Whitelist.updateOne({}, { $pull: { allowed: email }}, { upsert: true })
}

/**
 * Return the list of whitelisted email addresses.
 */
whitelistSchema.statics.allowed = async function(this: WhitelistModel, email: string) {
  const list = await Whitelist.findOne()
  return list && list.allowed || []
}

/**
 * Prevent duplicate model compiling during unit test watching by
 * compiling only if model doesn't already exist.
 */
export const Whitelist = (mongoose.models.Whitelist
  || Config.discriminator<IWhitelistDocument>('Whitelist', whitelistSchema)) as WhitelistModel
