/*
 * Dates in police bulletins can vary quite a bit.
 * Each case has an example of the type of string it is capable of parsing
 * a valid Date object from. This is probably not exhaustive.
 *
 * If you find a case where this doesn't work (usually year zero in POSIX Time),
 * write a new clause capable of parsing it. Additionally, create two unit tests
 * in /tests/dateParser.test.js: one to verify it returns a valid Date object,
 * and another to verify it isn't POSIX year 0.
 */

const dateParser = (date) => {
  if (date.includes('between')) {
    // ' between 00:40, 3/5/2018 and 00:40, 3/5/2018. Reported: 00:40, 3/5/2018.'
    return new Date(date.substring(date.indexOf('.') + 19))

  } else if (date[6] == ':') {
    // ' on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'
    return new Date(date.substring(10, 20))

  } else if (date[5] == ':') {
    // 'on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'
    return new Date(date.substring(9, 19))

  } else if (date[0] == ' ') {
    // ' on 3/5/2018 02:20.'
    return new Date(date.substring(2, 13))

  } else if ((date[0] == 'o') || (date[0] == 'O')) {
    // 'On 3/5/2018 10:12:04 AM at 10:12'
    return new Date(date.substring(3, 12))
  }
}

module.exports = dateParser
