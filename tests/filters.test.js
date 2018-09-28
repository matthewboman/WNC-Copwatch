const R = require('ramda')
const reports = require('../reports/mockData')
const fns = require('../public/src/vuex/functions')

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

it("Returns the a date formatted YYYYMMDD", () => {
  expect(
    fns.YYYYMMDD(new Date(Date.now()))
  ).toEqual("20180928") // this will need changed whenever the test is run
})

it("Returns the current date formatted YYYYMMDD", () => {
  expect(
    fns.YYYYMMDD(new Date("April 20, 2018"))
  ).toEqual("20180420")
})

it("Returns a week before the given date", () => {
  expect(
    new Date(fns.previousWeek(new Date("April 20, 2018"))).getUTCDate()
  ).toEqual(13)
})
