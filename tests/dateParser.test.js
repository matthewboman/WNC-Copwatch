const dateParser = require('../utils/dateParser')

/*
 * ' between 00:40, 3/5/2018 and 00:40, 3/5/2018. Reported: 00:40, 3/5/2018.'
 */
it("Parses: ' between 00:40, 3/5/2018 and 00:40, 3/5/2018. Reported: 00:40, 3/5/2018.'", () => {
  expect(
    dateParser(" between 00:40, 3/5/2018 and 00:40, 3/5/2018. Reported: 00:40, 3/5/2018.")
  ).toBeInstanceOf(Date)
})

it("Doesn't return 1970 (v1)", () => {
  expect(
    dateParser(" between 00:40, 3/5/2018 and 00:40, 3/5/2018. Reported: 00:40, 3/5/2018.").getFullYear()
  ).toBeGreaterThan(1970)
})

/*
 * ' on 3/5/2018 02:20.'
 */
it("Parses: ' on 3/5/2018 02:20.'", () => {
  expect(
    dateParser(" on 3/5/2018 02:20.")
  ).toBeInstanceOf(Date)
})

it("Doesn't return 1970 (v2)", () => {
  expect(
    dateParser(" on 3/5/2018 02:20.").getFullYear()
  ).toBeGreaterThan(1970)
})

/*
 * 'On 3/5/2018 10:12:04 AM at 10:12'
 */
it("Parses: 'On 3/5/2018 10:12:04 AM at 10:12'", () => {
  expect(
    dateParser("On 3/5/2018 10:12:04 AM at 10:12")
  ).toBeInstanceOf(Date)
})

it("Doesn't return 1970 (v3)", () => {
  expect(
    dateParser("On 3/5/2018 10:12:04 AM at 10:12").getFullYear()
  ).toBeGreaterThan(1970)
})

/*
 * ' on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'
 */
it("Parses: ' on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'", () => {
  expect(
    dateParser(' on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.')
  ).toBeInstanceOf(Date)
})

it("Doesn't return 1970 (v4)", () => {
  expect(
    dateParser(" on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.").getFullYear()
  ).toBeGreaterThan(1970)
})

/*
 * 'on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'
 */
it("Parses: 'on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.'", () => {
  expect(
    dateParser('on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.')
  ).toBeInstanceOf(Date)
})

it("Doesn't return 1970 (v5)", () => {
  expect(
    dateParser("on 18:20, 2/23/2018. Reported: 18:20, 2/23/2018.").getFullYear()
  ).toBeGreaterThan(1970)
})
