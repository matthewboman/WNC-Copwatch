/**
 * Uses Google's Map API to return a valid latitude and longitude
 */
import 'dotenv/config'
import * as GoogleMaps from '@google/maps'

const client = GoogleMaps.createClient({
  key: process.env.GOOGLE_API_KEY as string,
  Promise
})

export const geoFromAddress = async (address: string): Promise<any> => {
  const results = await client.geocode({ address }).asPromise()
    .then(res => res.json.results)

  return results[0]
    ? results[0].geometry.location
    : null
}
