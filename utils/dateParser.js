/*
 * TODO: All but the last clause can be removed with next full version.
 *       Dates are no longer parsed from bulletins but read from filename
 *
 * @deprecated since version 0.6
 *
 * Dates in police bulletins can vary quite a bit. Each case has an example of
 * the type of string it is capable of parsing a valid Date object from.
 * This is probably not exhaustive.
 *
 * If you find a case where this doesn't work (usually year zero in POSIX Time),
 * write a new `else if` clause capable of parsing it. Additionally, create two
 * unit tests in /tests/dateParser.test.js: one to verify it returns a valid
 * Date object and another to verify it isn't POSIX year 0.
 */

// dateParser :: String -> Date`${d}/${m}/${y}`
const dateParser = date => {
  console.warn("function 'dateParser()' is deprecated as of v0.6.0 and will be removed/refactored in the next release")

  // ' between 00:40, 3/5/2018 and 00:40, 3/5/2018. Reported: 00:40, 3/5/2018.'
  if (date.includes('between')) {
    return new Date(date.substring(date.indexOf('.') + 19))

  // ' on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'
  } else if (date[6] == ':') {
    return new Date(date.substring(10, 20))

  // 'on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'
  } else if (date[5] == ':') {
    return new Date(date.substring(9, 19))

  // ' on 3/5/2018 02:20.'
  } else if (date[0] == ' ') {
    return new Date(date.substring(2, 13))

  // 'On 3/5/2018 10:12:04 AM at 10:12'
  } else if ((date[0] == 'o') || (date[0] == 'O')) {
    return new Date(date.substring(3, 12))

  // '2018-10-10'
  } else if (date.length == 10) {
    const [y, m, d] = date.split('-')
    return new Date(`${m}/${d}/${y}`)
  }
}

module.exports = dateParser
