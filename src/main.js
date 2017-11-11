const msPerMinute = 60000
const msPerHour = 60 * msPerMinute   // Day in milliseconds
const msPerDay = 24 * msPerHour
const offset = (new Date()).getTimezoneOffset() * msPerMinute

const bind = Function.bind
const unbind = bind.bind(bind)

function instantiate (constructor, args) {
  return new (unbind(constructor, null).apply(null, args))()
}

function FastDate () {
  if (arguments.length > 0 && arguments[0] instanceof FastDate) {
    this._arg = arguments[0]._arg
    this.justDate = arguments[0].justDate
    this._date = new Date(arguments[0].valueOf())
  } else if (arguments.length === 3) {
    this._arg = `${arguments[0]}-0${arguments[1] + 1}-0${arguments[2]}`.replace(/-0(\d\d)/, '-$1')
    this.justDate = true
    this._date = instantiate(Date, arguments)
  } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
    this._arg = arguments[0]
    this.justDate = this._arg.length === 10
    this._date = new Date(arguments[0]) // instantiate(Date, arguments)
  } else {
    this._arg = arguments
    this._date = instantiate(Date, arguments)
  }
  this.justDate = this.justDate || false
}

function d () {
  return instantiate(FastDate, arguments)
}

FastDate.Now = Date.Now
FastDate.parse = Date.parse
FastDate.UTC = Date.UTC

FastDate.prototype.isJustDate = function () {
  return this.justDate
}

FastDate.prototype.toDate = function () {
  return this._date
}

FastDate.prototype.isBusinessDay = function (exclude = []) {
  if (this.getLocaleDay() === 0 || this.getLocaleDay() === 6) return false
  return exclude.indexOf(this.getEpochDay()) === -1
}

FastDate.prototype.getDate = function () { return this._date.getDate.apply(this._date, arguments) }
FastDate.prototype.getDay = function () { return this._date.getDay.apply(this._date, arguments) }
FastDate.prototype.getLocaleDay = function () { return this.justDate ? this.getUTCDay() : this.getDay() }
FastDate.prototype.getFullYear = function () { return this._date.getFullYear.apply(this._date, arguments) }
FastDate.prototype.getHours = function () { return this._date.getHours.apply(this._date, arguments) }
FastDate.prototype.getMilliseconds = function () { return this._date.getMilliseconds.apply(this._date, arguments) }
FastDate.prototype.getMinutes = function () { return this._date.getMinutes.apply(this._date, arguments) }
FastDate.prototype.getMonth = function () { return this._date.getMonth.apply(this._date, arguments) }
FastDate.prototype.getSeconds = function () { return this._date.getSeconds.apply(this._date, arguments) }
FastDate.prototype.getTime = function () { return this._date.getTime.apply(this._date, arguments) }
FastDate.prototype.getTimezoneOffset = function () { return this._date.getTimezoneOffset.apply(this._date, arguments) }
FastDate.prototype.getUTCDate = function () { return this._date.getUTCDate.apply(this._date, arguments) }
FastDate.prototype.getUTCDay = function () { return this._date.getUTCDay.apply(this._date, arguments) }
FastDate.prototype.getUTCFullYear = function () { return this._date.getUTCFullYear.apply(this._date, arguments) }
FastDate.prototype.getUTCHours = function () { return this._date.getUTCHours.apply(this._date, arguments) }
FastDate.prototype.getUTCMilliseconds = function () { return this._date.getUTCMilliseconds.apply(this._date, arguments) }
FastDate.prototype.getUTCMinutes = function () { return this._date.getUTCMinutes.apply(this._date, arguments) }
FastDate.prototype.getUTCMonth = function () { return this._date.getUTCMonth.apply(this._date, arguments) }
FastDate.prototype.getUTCSeconds = function () { return this._date.getUTCSeconds.apply(this._date, arguments) }
FastDate.prototype.getYear = function () { return this._date.getYear.apply(this._date, arguments) }

FastDate.prototype.setDate = function () { return this._date.setDate.apply(this._date, arguments) }
FastDate.prototype.setFullYear = function () { return this._date.setFullYear.apply(this._date, arguments) }
FastDate.prototype.setHours = function () {
  this.justDate = false
  return this._date.setHours.apply(this._date, arguments)
}
FastDate.prototype.setMilliseconds = function () { return this._date.setMilliseconds.apply(this._date, arguments) }
FastDate.prototype.setMinutes = function () { return this._date.setMinutes.apply(this._date, arguments) }
FastDate.prototype.setMonth = function () { return this._date.setMonth.apply(this._date, arguments) }
FastDate.prototype.setSeconds = function () { return this._date.setSeconds.apply(this._date, arguments) }
FastDate.prototype.setTime = function () { return this._date.setTime.apply(this._date, arguments) }
FastDate.prototype.setUTCDate = function () { return this._date.setUTCDate.apply(this._date, arguments) }
FastDate.prototype.setUTCFullYear = function () { return this._date.setUTCFullYear.apply(this._date, arguments) }
FastDate.prototype.setUTCHours = function () { return this._date.setUTCHours.apply(this._date, arguments) }
FastDate.prototype.setUTCMilliseconds = function () { return this._date.setUTCMilliseconds.apply(this._date, arguments) }
FastDate.prototype.setUTCMinutes = function () { return this._date.setUTCMinutes.apply(this._date, arguments) }
FastDate.prototype.setUTCMonth = function () { return this._date.setUTCMonth.apply(this._date, arguments) }
FastDate.prototype.setUTCSeconds = function () { return this._date.setUTCSeconds.apply(this._date, arguments) }

FastDate.prototype.toDateString = function () { return this._date.toDateString.apply(this._date, arguments) }
FastDate.prototype.toISOString = function () { return this._date.toISOString.apply(this._date, arguments) }
FastDate.prototype.toJSON = function () { return this._date.toJSON.apply(this._date, arguments) }
FastDate.prototype.toGMTString = function () { return this._date.toGMTString.apply(this._date, arguments) }
FastDate.prototype.toLocaleDateString = function () { return this._date.toLocaleDateString.apply(this._date, arguments) }
FastDate.prototype.toLocaleString = function () { return this._date.toLocaleString.apply(this._date, arguments) }
FastDate.prototype.toLocaleTimeString = function () { return this._date.toLocaleTimeString.apply(this._date, arguments) }
FastDate.prototype.toString = function () { return this._date.toString.apply(this._date, arguments) }
FastDate.prototype.toTimeString = function () { return this._date.toTimeString.apply(this._date, arguments) }
FastDate.prototype.toUTCString = function () { return this._date.toUTCString.apply(this._date, arguments) }
FastDate.prototype.valueOf = function () { return this._date.valueOf.apply(this._date, arguments) }

function startOf (date, interval = 'd') {
  if (interval === 'd' || interval === 'day') {
    return d(d(date).setHours(0, 0, 0, 0))
  }
  throw new Error('Not implemented yet')
}

function endOf (date, interval = 'd') {
  if (interval === 'd' || interval === 'day') {
    return d(d(date).setHours(23, 59, 59, 999))
  }
  throw new Error('Not implemented yet')
}

function getExcludedDays (from, to, exclude = []) {
  const f = startOf(from, 'd').getEpochDay()
  const t = endOf(to, 'd').getEpochDay()
  return exclude.filter((exc) => {
    return (exc.getEpochDay() >= f && exc.getEpochDay() <= t && exc.isBusinessDay())
  }).map(exc => getEpochDay(exc))
}

function validate (from, to, exclude) {
  if (to < from) throw new Error('From date is grater than to date.')
  if (!Array.isArray(exclude)) throw new Error('Exclude arg should be an array of Dates')
}

function getEpochDay (date) {
  return parseInt((date.isJustDate() ? date.getTime() : date.getTime() - offset) / msPerDay, 10)
}

function getDiscountedHours (from, to, exclude = []) {
  let sDay = from.getLocaleDay()
  let eDay = to.getLocaleDay()
  let t = d(to)
  if (eDay === 6 || exclude.indexOf(t.getEpochDay()) !== -1) {
    t = d(to.getTime() - 1)
    t.justDate = to.justDate
    eDay = t.getLocaleDay()
  }
  let discount = 0
  if (sDay - eDay > 1) discount += -48
  if ((sDay === 0 && eDay !== 6) || (eDay === 6 && sDay !== 0)) discount += -24
  sDay = !(sDay === 0 || sDay === 6) ? from.getEpochDay() : null
  eDay = !(eDay === 0 || eDay === 6) ? to.getEpochDay() : null
  const tEpoch = t.getEpochDay()
  const fEpoch = from.getEpochDay()
  exclude.forEach((exc) => {
    if (exc > tEpoch || exc <= fEpoch) return
    discount += -24
    const excDay = (exc % 7) - 3
    discount += (excDay === sDay) ? -24 : 0
    discount += (excDay === eDay && eDay !== sDay) ? -24 : 0
  })
  return discount
}

function prepareFrom (from, exclude = []) {
  if (from.isBusinessDay(exclude)) return from
  return prepareFrom(startOf(from.valueOf() + msPerDay, 'd'))
}

function prepareTo (to, exclude = []) {
  if (to.isBusinessDay(exclude)) return to.isJustDate() ? d(endOf(new Date(to.valueOf()).setUTCHours(0, 0, 0, 0) + msPerDay, 'd') + 1) : d(to + (to.carryValue || 0))
  let t = d(endOf(to.isJustDate() ? (startOf(to, 'd').valueOf() + msPerDay) : to, 'd'))
  t = endOf(t.valueOf() - msPerDay, 'd')
  t.carryValue = 1
  return prepareTo(t, exclude)
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
  validate(from, to, exclude)
  const exc = getExcludedDays(from, to, exclude)
  const f = prepareFrom(d(from), exc)
  const t = prepareTo(d(to), exc)
  let h = (t - f) / msPerHour
  if (h <= 0) return 0
  const weeks = Math.floor((t.getEpochDay() - f.getEpochDay()) / 7)
  h -= weeks * 48
  if (weeks === 0 && f.getLocaleDay() < 6 && t.getLocaleDay() > 1 && t.getLocaleDay() < f.getLocaleDay()) {
    h -= (7 - (f.getLocaleDay() + t.getLocaleDay())) * 24
  }
  h += getDiscountedHours(f, t, exc)
  return precise ? h / 24 : Math.floor(h / 24)
}

FastDate.prototype.getEpochDay = function () {
  return getEpochDay(this)
}

module.exports = exports = {
  FastDate,
  workingDaysDiff,
  _internals: {
    getExcludedDays,
    validate,
    getEpochDay,
    getDiscountedHours,
    prepareFrom,
    prepareTo,
    startOf,
    endOf,
    d
  }
}
