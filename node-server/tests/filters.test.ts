import { OpenDataReport } from '../entity'
import {
  applyFilters,
  filterExactDate
} from '../utils/filters'

describe("filters", () => {
  it('returns reports with matching dates', () => {
    const reports: OpenDataReport[] = [
      { id: 1, date: new Date('December 21, 2012 04:20:00') },
      { id: 2, date: new Date('December 21, 2012 16:20:00') },
      { id: 3, date: new Date('December 22, 2012 04:20:00') },
    ]
    const args = { exact: '12/21/2012' }
    expect(
      filterExactDate(args, reports)
    ).toEqual([
      { id: 1, date: new Date('December 21, 2012 04:20:00') },
      { id: 2, date: new Date('December 21, 2012 16:20:00') },
    ])
  })

  it("applies one filter", () => {
    const isEven = (int: number) => int % 2 == 0
    const evens = (arr: { filter: (arg0: (int: number) => boolean) => void }) => arr.filter(isEven)
    expect(
      applyFilters(
        [ evens ],
        [1, 2, 3, 4]
      )
    ).toEqual([2, 4])
  })

  it("applies two filters", () => {
    const isEven = (int: number) => int % 2 == 0
    const evens = (arr: { filter: (arg0: (int: number) => boolean) => void }) => arr.filter(isEven)
    const greaterThanTen = (int: number) => int > 10
    const biggies = (arr: { filter: (arg0: (int: number) => boolean) => void }) => arr.filter(greaterThanTen)
    expect(
      applyFilters(
        [ evens, biggies ],
        [5, 10, 15, 20, 25, 30])
    ).toEqual([20, 30])
  })
})
