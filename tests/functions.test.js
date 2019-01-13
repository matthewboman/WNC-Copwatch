const fns = require('../utils/functions')

it("applies one filter", () => {
  const isEven = int => int % 2 == 0
  const evens = arr => arr.filter(isEven)
  expect(
    fns.applyFilters(
      [ evens ],
      [1, 2, 3, 4]
    )
  ).toEqual([2, 4])
})

it("applies two filters", () => {
  const isEven = int => int % 2 == 0
  const evens = arr => arr.filter(isEven)
  const greaterThanTen = int => int > 10
  const biggies = arr => arr.filter(greaterThanTen)
  expect(
    fns.applyFilters(
      [ evens, biggies ],
      [5, 10, 15, 20, 25, 30])
  ).toEqual([20, 30])
})
