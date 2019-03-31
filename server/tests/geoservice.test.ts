import { geoFromAddress } from '../services/GeoService'

const address = "610 Haywood Rd, Asheville NC"

describe("geoservice", () => {
  it("gets the latitude and longitude from an address", async () => {
    const results = await geoFromAddress(address)

    expect(results).toEqual({
      lat: 35.5785215,
      lng: -82.58809339999999
    })
  })
})
