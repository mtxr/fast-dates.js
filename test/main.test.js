const { _internals, workingDaysDiff } = require('../src/main')
const { getEpochDay, startOf, endOf, d, validate, prepareFrom, prepareTo, getExcludedDays, getDiscountedHours } = _internals
const offset = (new Date()).getTimezoneOffset() / 60

describe('getEpochDay: should get an integer represeting a day from 1970-01-01 as first', () => {
  it('1970-01-01 as 0', () => {
    expect(getEpochDay(d('1970-01-01'))).toBe(0)
    expect(d('1970-01-01').getEpochDay()).toBe(0)
    expect(getEpochDay(d('1970-01-01T12:34:00.000Z'))).toBe(0)
    expect(d('1970-01-01T12:34:00.000Z').getEpochDay()).toBe(0)
    expect(getEpochDay(d(d('1970-01-01').setHours(23, 59)))).toBe(0)
    expect(d(d('1970-01-01').setHours(23, 59)).getEpochDay()).toBe(0)
  })

  it('1970-01-02 as 1', () => {
    expect(getEpochDay(d('1970-01-02'))).toBe(1)
    expect(d('1970-01-02').getEpochDay()).toBe(1)
    expect(getEpochDay(d('1970-01-02T12:34:00.000Z'))).toBe(1)
    expect(d('1970-01-02T12:34:00.000Z').getEpochDay()).toBe(1)
    expect(getEpochDay(d(d('1970-01-02').setHours(23, 59)))).toBe(1)
    expect(d(d('1970-01-02').setHours(23, 59)).getEpochDay()).toBe(1)
  })

  it('1970-12-31 as 364', () => {
    expect(getEpochDay(d('1970-12-31'))).toBe(364)
    expect(d('1970-12-31').getEpochDay()).toBe(364)
    expect(getEpochDay(d('1970-12-31T12:34:00.000Z'))).toBe(364)
    expect(d('1970-12-31T12:34:00.000Z').getEpochDay()).toBe(364)
    expect(getEpochDay(d(d('1970-12-31').setHours(23, 59)))).toBe(364)
    expect(d(d('1970-12-31').setHours(23, 59)).getEpochDay()).toBe(364)
  })

  it('2017-10-27 as 17466', () => {
    expect(getEpochDay(d('2017-10-27'))).toBe(17466)
    expect(d('2017-10-27').getEpochDay()).toBe(17466)
    expect(getEpochDay(d('2017-10-27T12:34:00.000Z'))).toBe(17466)
    expect(d('2017-10-27T12:34:00.000Z').getEpochDay()).toBe(17466)
    expect(getEpochDay(d(2017, 9, 27, 23, 59, 59, 999))).toBe(17466)
  })
})

describe('startOf: should find the start of an interval', () => {
  it(`start of day ${d().toLocaleDateString()}`, () => {
    expect(startOf(d())).toEqual(d(d().setHours(0, 0, 0, 0)))
    expect(startOf(d(), 'd')).toEqual(d(d().setHours(0, 0, 0, 0)))
    expect(startOf(d(), 'day')).toEqual(d(d().setHours(0, 0, 0, 0)))
    expect(() => startOf(null, 'week')).toThrowError()
  })
})

describe('endOf: should find the end of an interval', () => {
  it(`end of day ${d().toLocaleDateString()}`, () => {
    expect(endOf(d()).valueOf()).toEqual(new Date().setHours(23, 59, 59, 999))
    expect(endOf(d(), 'd').valueOf()).toEqual(new Date().setHours(23, 59, 59, 999))
    expect(endOf(d(), 'day').valueOf()).toEqual(new Date().setHours(23, 59, 59, 999))
    expect(() => endOf(null, 'week')).toThrowError()
  })
})

describe('validate: should validate input', () => {
  it('should accept valid inputs', () => {
    expect(validate(d(10), d(20), []))
    expect(validate(d(19), d(20), [new Date(), new Date()]))
  })

  it('should throw error valid inputs', () => {
    expect(() => validate(d(21), d(20), [])).toThrowError()
    expect(() => validate(d(0), d(1), null)).toThrowError()
    expect(() => validate(d(10), d(20), {})).toThrowError()
  })
})

describe('prepareFrom: get starting date', () => {
  it('should bring the same date as input if not a weekend nor holiday', () => {
    let date = d('2017-10-30T15:12:11.000Z')
    expect(prepareFrom(date).valueOf()).toEqual(date.valueOf())
    date = d('2017-10-31T15:12:11.000Z')
    expect(prepareFrom(date).valueOf()).toEqual(date.valueOf())
    date = d('2017-09-25T15:08:14.000Z')
    expect(prepareFrom(date).valueOf()).toEqual(date.valueOf())
    date = d('2017-08-15T15:23:15.120Z')
    expect(prepareFrom(date).valueOf()).toEqual(date.valueOf())
    date = d('2017-01-06-T10:00:11.000Z')
    expect(prepareFrom(date).valueOf()).toEqual(date.valueOf())
  })

  it('should bring the start of follwing monday after a weekend', () => {
    expect(prepareFrom(d('2017-10-29T14:00:00.000Z')).valueOf()).toEqual(new Date(2017, 9, 30, 0, 0, 0, 0).valueOf())
    expect(prepareFrom(d('2017-10-28T14:00:00.000Z')).valueOf()).toEqual(new Date(2017, 9, 30, 0, 0, 0, 0).valueOf())
  })
})

describe('prepareTo: get target date', () => {
  it('should bring the same time for dates that are not holidays or weekend', () => {
    let date = d('2017-11-03')
    expect(prepareTo(date).valueOf()).toEqual(new Date(2017, 10, 4, 0, 0, 0, 0).valueOf())
    date = d('2017-11-03T14:00:00.000Z')
    expect(prepareTo(date).valueOf()).toEqual(date.valueOf())
    date = d('2017-11-03T14:00:00.000Z')
    expect(prepareTo(date).valueOf()).toEqual(date.valueOf())
    date = d('2017-11-03T14:00:00.000Z')
    expect(prepareTo(date, [d('2017-10-27').getEpochDay()]).valueOf()).toEqual(date.valueOf())
  })

  it('should bring the start of previous monday after a weekend', () => {
    expect(prepareTo(d('2017-10-29T14:00:00.000Z')).valueOf()).toEqual(new Date(2017, 9, 28, 0, 0, 0, 0).valueOf())
    expect(prepareTo(d('2017-10-28T14:00:00.000Z')).valueOf()).toEqual(new Date(2017, 9, 28, 0, 0, 0, 0).valueOf())
    expect(prepareTo(d('2017-10-28T14:00:00.000Z'), [d('2017-10-27').getEpochDay()]).valueOf()).toEqual(new Date(2017, 9, 27, 0, 0, 0, 0).valueOf())
    expect(prepareTo(d('2017-10-28')).valueOf()).toEqual(new Date(2017, 9, 28, 0, 0, 0, 0).valueOf())
  })
})

describe('toDate: cast to Date', () => {
  it('should return the same instance of Date', () => {
    const f = d()
    expect(f.toDate()).toBe(f._date)
  })
})

describe('isBusinessDay: say if a date is a business day', () => {
  it('should return true for weekdays that are not holidays', () => {
    expect(d('2017-11-03').isBusinessDay()).toBeTruthy()
    expect(d('2017-11-03').isBusinessDay([ d('2017-11-03').getEpochDay() ])).toBeFalsy()
    expect(d('2017-11-03').isBusinessDay([ d('2017-11-02').getEpochDay() ])).toBeTruthy()
    expect(d(2017, 10, 3, 0, 0, 0, 0).isBusinessDay()).toBeTruthy()
    expect(d(2017, 10, 3, 0, 0, 0, 0).isBusinessDay([ d('2017-11-03').getEpochDay() ])).toBeFalsy()
    expect(d(2017, 10, 3, 0, 0, 0, 0).isBusinessDay([ d('2017-11-02').getEpochDay() ])).toBeTruthy()
    expect(d(2017, 10, 3, 23, 59, 59, 999).isBusinessDay()).toBeTruthy()
    expect(d(2017, 10, 3, 23, 59, 59, 999).isBusinessDay([ d('2017-11-03').getEpochDay() ])).toBeFalsy()
    expect(d(2017, 10, 3, 23, 59, 59, 999).isBusinessDay([ d('2017-11-02').getEpochDay() ])).toBeTruthy()
    expect(d(2017, 10, 3, 14, 0, 0, 0).isBusinessDay()).toBeTruthy()
    expect(d(2017, 10, 3, 14, 0, 0, 0).isBusinessDay([ d('2017-11-03').getEpochDay() ])).toBeFalsy()
    expect(d(2017, 10, 3, 14, 0, 0, 0).isBusinessDay([ d('2017-11-02').getEpochDay() ])).toBeTruthy()

    expect(d('2017-11-04').isBusinessDay()).toBeFalsy()
    expect(d(2017, 10, 4, 0, 0, 0, 0).isBusinessDay()).toBeFalsy()
    expect(d(2017, 10, 4, 23, 59, 59, 999).isBusinessDay()).toBeFalsy()
    expect(d(2017, 10, 4, 14, 0, 0, 0).isBusinessDay()).toBeFalsy()

    expect(d('2017-11-05').isBusinessDay()).toBeFalsy()
    expect(d(2017, 10, 5, 0, 0, 0, 0).isBusinessDay()).toBeFalsy()
    expect(d(2017, 10, 5, 23, 59, 59, 999).isBusinessDay()).toBeFalsy()
    expect(d(2017, 10, 5, 14, 0, 0, 0).isBusinessDay()).toBeFalsy()
  })
})

describe('getExcludedDays: exclude holidays outside of the interval', () => {
  it('should bring just the holidays inside of the interval', () => {
    const holidays = [
      d('2017-11-02'),
      d('2017-11-15')
    ]
    expect(getExcludedDays(d('2017-11-01'), d('2017-11-20'), holidays).length).toBe(2)
    expect(getExcludedDays(d('2017-11-10'), d('2017-11-20'), holidays).length).toBe(1)
    expect(getExcludedDays(d('2017-12-10'), d('2017-12-20'), holidays).length).toBe(0)
  })

  it('should bring and array of epoch days of the given holidays', () => {
    const holidays = [
      d('2017-11-02'),
      d('2017-11-15')
    ]
    expect(getExcludedDays(d('2017-11-01'), d('2017-11-20'), holidays)).toEqual([ d('2017-11-02').getEpochDay(), d('2017-11-15').getEpochDay() ])
    expect(getExcludedDays(d('2017-11-10'), d('2017-11-20'), holidays)).toEqual([ d('2017-11-15').getEpochDay() ])
    expect(getExcludedDays(d('2017-12-10'), d('2017-12-20'), holidays)).toEqual([])
  })
})

describe('getDiscountedHours', () => {
  it('should bring getDiscountedHours for an interval', () => {
    expect(getDiscountedHours(d('2017-11-08T12:00:00.000Z'), d('2017-11-11T02:00:00.000Z'), [])).toBe(0)
  })
})

describe('workingDaysDiff', () => {
  it('dates starting during weekdays', () => {
    expect(workingDaysDiff(new Date('2017-11-07T12:00:00.000Z'), new Date('2017-11-07T12:00:00.000Z'), true)).toBe(0)
    expect(workingDaysDiff(new Date('2017-11-07T12:00:00.000Z'), new Date('2017-11-08T12:00:00.000Z'), true)).toBe(1)
    expect(() => workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-07T12:00:00.000Z'), true)).toThrowError()
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-10T12:00:00.000Z'), true)).toBe(2)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-10T18:00:00.000Z'), true)).toBe(2.25)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-10T18:00:00.000Z'))).toBe(2)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-11T00:00:00.000Z'), true)).toBe(2.5)
    expect(parseFloat(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-11T02:00:00.000Z'), true).toFixed(2))).toBe(2.58)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-11T02:00:00.000Z'))).toBe(2)
    expect(parseFloat(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-12T18:00:00.000Z'), true).toFixed(2))).toBe(2.58)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-13T18:00:00.000Z'), true)).toBe(3.25)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-14T18:00:00.000Z'), true)).toBe(4.25)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-15T18:00:00.000Z'), true, [ d('2017-11-14') ])).toBe(4.25)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-16T00:00:00.000Z'), true, [ d('2017-11-14') ])).toBe(4.5)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-16T00:00:00.000Z'), true, [ d('2017-11-14'), d('2017-11-13') ])).toBe(3.5)
  })

  it('dates starting during the weekends or holidays', () => {
    expect(workingDaysDiff(new Date('2017-11-03T12:00:00.000Z'), new Date('2017-11-06T12:00:00.000Z'), true)).toBe(1)
    expect(workingDaysDiff(new Date('2017-11-03T12:00:00.000Z'), new Date('2017-11-07T18:00:00.000Z'), true)).toBe(2.25)
    expect(workingDaysDiff(new Date('2017-11-03T12:00:00.000Z'), new Date('2017-11-08T00:00:00.000Z'), true)).toBe(2.5)
    expect(workingDaysDiff(new Date('2017-11-03T12:00:00.000Z'), new Date('2017-11-07T18:00:00.000Z'))).toBe(2)

    const offsetAdjust = offset / 24
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-06T12:00:00.000Z'), true)).toBe(0.5 - (offsetAdjust))
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-07T18:00:00.000Z'), true)).toBe(1.75 - (offsetAdjust))
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-08T00:00:00.000Z'), true)).toBe(2 - (offsetAdjust))
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-07T18:00:00.000Z'))).toBe(parseInt(1.75 - (offsetAdjust), 10))
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-05T18:00:00.000Z'))).toBe(0)
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-05T18:00:00.000Z'), true)).toBe(0)
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-08T12:00:00.000Z'), true, [ d('2017-11-07') ])).toBe(1.5 - (offsetAdjust))
  })

  it('dates ending on weekends or holidays', () => {
    const offsetAdjust = offset / 24
    expect(workingDaysDiff(new Date('2017-11-06T00:00:00.000Z'), new Date('2017-11-11T12:00:00.000Z'), true)).toBe(5)
    expect(workingDaysDiff(new Date('2017-11-11T00:00:00.000Z'), new Date('2017-11-11T12:00:00.000Z'), true)).toBe(0 + offsetAdjust)
    expect(workingDaysDiff(new Date('2017-11-12T12:00:00.000Z'), new Date('2017-11-12T12:00:00.000Z'), true)).toBe(0)
    expect(workingDaysDiff(new Date('2017-11-08T00:00:00.000Z'), new Date('2017-11-11T12:00:00.000Z'), true)).toBe(3 + (offsetAdjust))
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-12T18:00:00.000Z'), true)).toBe(5)
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-12T00:00:00.000Z'), true)).toBe(5)
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-12T18:00:00.000Z'))).toBe(5)
    expect(workingDaysDiff(new Date('2017-11-08T12:00:00.000Z'), new Date('2017-11-12T18:00:00.000Z'), true)).toBe(2.5 + offsetAdjust)
    expect(workingDaysDiff(new Date('2017-11-04T12:00:00.000Z'), new Date('2017-11-08T12:00:00.000Z'), true, [d('2017-11-07')])).toBe(1.5 - (offsetAdjust))
    expect(workingDaysDiff(new Date('2017-11-06T12:00:00.000Z'), new Date('2017-11-08T12:00:00.000Z'), true, [d('2017-11-07')])).toBe(1)
    expect(workingDaysDiff(new Date('2017-11-06T12:00:00.000Z'), new Date('2017-11-07T18:00:00.000Z'), true, [d('2017-11-07')])).toBe(0.5 + (offsetAdjust))
  })
})
