# Fast-dates

This project looks forward to do Date operations fast, really fast.

## Install

```bash
npm install fast-dates
```

Or

```bash
yarn add fast-dates
```

## Usage

```javascript
const fastDates = require('fast-dates');

console.log(workingDaysDiff('2017-10-11T12:12:12.000Z', '2017-10-27T12:12:12.000Z', true)) // 12 days
console.log(workingDaysDiff('2017-10-11T12:12:12.000Z', '2017-10-27T00:12:12.000Z', true)) // 11.5 days
```

## Features

- Working Days Diff
```javascript
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
function workingDaysDiff (from, to, precise = false, exclude = []) { ...}
```
