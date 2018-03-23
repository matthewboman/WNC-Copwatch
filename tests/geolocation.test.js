const geoLocation = require('../utils/geoLocation')

it("Gets an address for ' at 100-BLK State St, Asheville, NC,'", async () => {
  expect.assertions(1)
  const data = await geoLocation(' at 100-BLK State St, Asheville, NC,')
  expect(data).not.toBeNull()
})

it("Gets an address for ' on RIVERSIDE DR at HILL ST.'", async () => {
  expect.assertions(1)
  const data = await geoLocation(' on RIVERSIDE DR at HILL ST.')
  expect(data).not.toBeNull()
})

it("Gets an address for ' on 280 (AIRPORT RD) at 25 (HENDERSONVILLE RD).'", async () => {
  expect.assertions(1)
  const data = await geoLocation(' on 280 (AIRPORT RD) at 25 (HENDERSONVILLE RD).')
  expect(data).not.toBeNull()
})

it("Gets an address for ' on 240 at 26.'", async () => {
  expect.assertions(1)
  const data = await geoLocation(' on 240 at 26.')
  expect(data).not.toBeNull()
})
