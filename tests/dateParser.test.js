const fns = require('../utils/functions')

/*
 * '2018-10-10' - formatted from file name
 */
it("Parses dates from filenames (2018-10-10)", () => {
  expect(
    fns.dateFromFilename('2018-10-10')
  ).toBeInstanceOf(Date)
})
