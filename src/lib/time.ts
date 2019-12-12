/**
 * Convert a time object into milliseconds.
 *
 * Example:
 *
 * ```
 * const ms = timeMs({ seconds: 1 })
 * assert(ms === 1000)
 *
 * const sec = timeSec({ minutes: 1, seconds: 30 })
 * assert (sec === 90)
 * ```
 */
const SEC_MS = 1000
const MIN_MS = 60 * SEC_MS
const HOUR_MS = 60 * MIN_MS
const DAY_MS = 24 * HOUR_MS
const WEEK_MS = 7 * DAY_MS
const MONTH_MS = 30 * DAY_MS
const YEAR_MS = 365 * DAY_MS

export interface ITimeOptions {
  ms?: number
  seconds?: number
  minutes?: number
  hours?: number
  days?: number
  weeks?: number
  months?: number
  years?: number
}

/**
 * Return the given time object converted to milliseconds.
 *
 * Example: timeMs({minutes: 1}) // 3600
 */
export function timeMs(opts: ITimeOptions) {
  return (opts.ms || 0)
    + (opts.seconds || 0) * SEC_MS
    + (opts.minutes || 0) * MIN_MS
    + (opts.hours || 0) * HOUR_MS
    + (opts.days || 0) * DAY_MS
    + (opts.weeks || 0) * WEEK_MS
    + (opts.months || 0) * MONTH_MS
    + (opts.years || 0) * YEAR_MS
}

/**
 * Return the given time object converted to seconds.
 *
 * Example: timeSec({hours: 24}) // 86400
 */
export function timeSec(opts: ITimeOptions) {
  return timeMs(opts) / 1000
}
