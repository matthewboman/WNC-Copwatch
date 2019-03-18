import {
  nthIndexOf,
  parseName,
} from '../utils/functions'

it("doesn't find that which doesn't exist", () => {
  const str = "acab"
  expect(
    nthIndexOf(str, 'y', 1)
  ).toEqual(-1)
})

it("finds the second instance of a character", () => {
  const str = "yolo"
  expect(
    nthIndexOf(str, 'o', 2)
  ).toEqual(3)
})

it("parses out a name", () => {
  const name = 'Thoreau, Henry David'
  expect(parseName(name)).toEqual({
    firstName: 'henry',
    firstInitial: 'h',
    middleInitial: 'd',
    lastName: 'thoreau',
  })
})
