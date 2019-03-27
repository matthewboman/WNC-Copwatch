import { geoFromAddress } from '../services/GeoService'

const address = "21 Princeton Dr, Asheville NC"

describe("geoservice", () => {
  it("gets the latitude and longitude from an address", async () => {
    const results = await geoFromAddress(address)

    expect(results).toEqual({
      lat: 35.578803,
      lng: -82.60779939999999
    })
  })
})
