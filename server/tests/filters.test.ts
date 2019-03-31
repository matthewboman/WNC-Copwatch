import { OpenDataReport } from '../entity'
import {
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
})
