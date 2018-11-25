const R = require('ramda')
const reports = require('../reports/mockData')
const open_reports = require('../reports/mockOpenData')
const fns = require('../public/src/utils/functions')

it("Returns the array", () => {
  expect(
    fns.conditionalArray(true, [1, 2, 3])
  ).toEqual([1, 2, 3])
})

it("Returns an empty array", () => {
  expect(
    fns.conditionalArray(false, [1, 2, 3])
  ).toEqual([])
})

it("Removes the value from array, if present", () => {
  expect(
    fns.toggleArray([1, 2, 3], 1)
  ).toEqual([2, 3])
})

it("Adds the value from array, if not present", () => {
  expect(
    fns.toggleArray([2, 3], 1)
  ).toEqual([2, 3, 1])
})

it("Sorts array and removes duplicates", () => {
  expect(
    fns.removeDuplicates(['A', 'C', 'A', 'B'])
  ).toEqual(['A', 'B', 'C'])
})

it("Returns the current date formatted YYYYMMDD", () => {
  expect(
    fns.YYYYMMDD(new Date(Date.now()))
  ).toEqual("20181125") // this will need changed whenever the test is run
})

it("Returns a date formatted YYYYMMDD", () => {
  expect(
    fns.YYYYMMDD(new Date("April 20, 2018"))
  ).toEqual("20180420")
})

it("Returns a week before the given date", () => {
  expect(
    new Date(fns.previousWeek(new Date("April 20, 2018"))).getUTCDate()
  ).toEqual(13)
})

it("Returns an array of {date: Date, searches: Int}", () => {
  expect(
    fns.categoryPerDay('searches', open_reports.searches)
  ).toEqual([
    { date: "2017-10-01T00:00:00.000Z", searches: 2 },
    { date: "2017-10-02T00:00:00.000Z", searches: 1 }
  ])
})

it("Returns an array of {date: Date, arrests: Int}", () => {
  expect(
    fns.categoryPerDay('arrests', open_reports.arrests)
  ).toEqual([
    { date: "2017-10-01T00:00:00.000Z", arrests: 2 }
  ])
})
