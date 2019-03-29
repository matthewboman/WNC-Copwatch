import { OpenDataReport } from '../entity'
import {
  dateWithoutTime,
  filterExactDate,
  nthIndexOf,
  parseID,
  parseName,
  withinShape,
} from '../utils/functions'

describe("shared functions", () => {
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

  it("parses out a full name", () => {
    const name = 'Thoreau, Henry David'
    expect(parseName(name)).toEqual({
      firstName: 'henry',
      firstInitial: 'h',
      middleInitial: 'd',
      lastName: 'thoreau',
    })
  })

  it("parses out initials", () => {
    const name = 'Thoreau, H D'
    const { firstInitial, middleInitial, lastName } = parseName(name)
    expect(firstInitial).toEqual('h')
    expect(middleInitial).toEqual('d')
    expect(lastName).toEqual('thoreau')
  })

  it("creates a new date", () => {
    const date = new Date('December 21, 2012 04:20:00')
    expect(dateWithoutTime(date)).toEqual(new Date('12/21/2012'))
  })

  it('parses an incident numbder from a traffic stop', () => {
    const stop = {
      "report_id": "",
      "force": "apd",
      "code": "TC",
      "description": " Cited on Charge of Expired Registration Card/tag (18017308),",
      "address": "Broadway St/zillicoa St, Asheville, ",
      "race": "White",
      "officer": "Hunter, B D",
      "_id": "5b7df923aa4ccb2d189dd55d",
      "dateTime": "2018-07-08T04:00:00.000Z",
      "latLng": {
        "lat": 35.6134958,
        "lng": -82.5709289
      }
    }
    expect(parseID(stop)).toEqual(18017308)
  })

  it('verifies a point is in the shape', () => {
    const shape = [
      [ 5, 5 ],
      [-5, 5 ],
      [-5,-5 ],
      [ 5,-5 ]
    ]
    const point = [ 2, 3 ]
    expect(withinShape(point, shape)).toBe(true)
  })

  it('verifies an point is outside the shape', () => {
    const shape = [
      [ 5, 5 ],
      [-5, 5 ],
      [-5,-5 ],
      [ 5,-5 ]
    ]
    const point = [ 6, 3 ]
    expect(withinShape(point, shape)).toBe(false)
  })
})

describe("filters", () => {
  it('returns reports with matching dates', () => {
    const reports: Array<OpenDataReport> = [
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
