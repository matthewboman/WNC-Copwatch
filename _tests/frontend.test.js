const open_reports = require('../reports/mockOpenData')
const fns = require('../utils/functions')

it("Builds data", () => {
  expect(
    fns.formatTrafficStops(open_reports.searches)
  ).toEqual(
    [
      {
        "date": new Date("2017-10-01T00:00:00.000Z"),
        "arrests": 0,
        "driver_arrested": 0,
        "driver_searched": 1,
        "passenger_arrested": 0,
        "passenger_searched": 1,
        "personal_effects_searched": 0,
        "search_initiated": 0,
        "searches": 2,
        "stops": 2,
        "t_probable_cause": 0,
        "t_search_consent": 0,
        "t_search_warrant": 0,
        "vehicle_searched": 0
      },
      {
        "date": new Date("2017-10-02T00:00:00.000Z"),
        "arrests": 0,
        "driver_arrested": 0,
        "driver_searched": 0,
        "passenger_arrested": 0,
        "passenger_searched": 1,
        "personal_effects_searched": 0,
        "search_initiated": 0,
        "searches": 1,
        "stops": 1,
        "t_probable_cause": 0,
        "t_search_consent": 0,
        "t_search_warrant": 0,
        "vehicle_searched": 0
      }
    ]
  )
})
