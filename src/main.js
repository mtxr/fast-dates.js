const debug = require('debug')('fast-dates')
const msPerHour = 3600000 // Day in milliseconds
const msPerDay = 24 * msPerHour
const startOfDay = new RegExp('[0-9]{2}:00:00\\.000Z')

function getExcludedDays (from, to, exclude = []) {
  debug(`fast-dates:getExcludedDays starting ${exclude.length}`, exclude[0], exclude[exclude.length - 1])
  const f = new Date(from.setHours(0, 0, 0, 0))
  debug(`fast-dates:getExcludedDays parsed from`)
  const t = new Date(to.setHours(23, 59, 59, 999))
  debug(`fast-dates:getExcludedDays parsed to`)
  return exclude.filter((exc) => {
    const day = exc.getDay()
    if (exc < f && exc > t) return false
    return !(day === 6 || day === 0)
  })
}

function validateInput (from, to, exclude) {
  if (to < from) throw new Error('From date is grater than to date.')
  if (!Array.isArray(exclude)) throw new Error('Exclude arg should be an array of Dates')
  exclude = exclude.sort()
}

function getDay (date) {
  return parseInt(date.getTime() / msPerDay, 10)
}

function getDiscounts (from, to, exclude = []) {
  let sDay = from.getDay()
  let eDay = to.getDay()
  let discount = 0
  if (sDay - eDay > 1) discount += -48
  if ((sDay === 0 && eDay !== 6) || (eDay === 6 && sDay !== 0)) discount += -24
  sDay = !(sDay === 0 || sDay === 6) ? getDay(from) : null
  eDay = !(eDay === 0 || eDay === 6) ? getDay(to) : null
  exclude.forEach((exc) => {
    discount += -24
    const excDay = parseInt(exc.getTime() / msPerDay, 10)
    discount += (excDay === sDay) ? -24 : 0
    discount += (excDay === eDay && eDay !== sDay) ? -24 : 0
  })
  return discount
}

function prepareFrom (from, holiday) {
  if (from.getDay() === 0 || getDay(from) === holiday) {
    from = from.setHours(0, 0, 0, 0) + msPerDay
  } else if (from.getDay() === 6) {
    from = from.setTime(0, 0, 0, 0) + (msPerDay * 2)
  }
  return new Date(from)
}

function prepareTo (to, holiday) {
  if (to.getDay() === 0) {
    to = to.setHours(0, 0, 0, 0) - msPerDay
  } else if (to.getDay() === 6 || getDay(to) === holiday) {
    to = to.setHours(0, 0, 0, 0)
  }
  to = new Date(to)
  if (startOfDay.test(to.toISOString())) to = new Date(to.setHours(23, 59, 59, 999) + 1000)
  return to
}
/**
 * Get difference in days between two dates excluding weekends.
 * Also you can give an array of dates to be excluded from the result.
 *
 * @param {any} from starting Date
 * @param {any} to target Date
 * @param {boolean} [precise=false] if true, will return a float number
 * @param {any} [exclude=[]] days to be excluded
 * @returns Number
 */
function workingDaysDiff (from, to, precise = false, exclude = []) {
  validateInput(from, to, exclude)
  const f = prepareFrom(new Date(from), exclude.length > 0 ? getDay(exclude[0]) : null)
  const t = prepareTo(new Date(to), exclude.length > 0 ? getDay(exclude[exclude.length - 1]) : null)
  let h = (t - f) / msPerHour
  const exc = getExcludedDays(f, t, exclude)
  h += -(Math.floor(h / 168) * 48)
  h += getDiscounts(f, t, exc)

  return Math.abs(precise ? h / 24 : Math.floor(h / 24))
}

module.exports = exports = {
  workingDaysDiff
}
