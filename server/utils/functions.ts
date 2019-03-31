/**
* Functions shared across components
*/
import {
  LatLng,
  OriginalBulletin,
  Name,
} from '../entity'


// dateWithoutTime :: Date -> Date
const dateWithoutTime = (d: Date): Date =>
  new Date(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`)

// boolToInt :: Bool -> Number
const boolToInt = (bool: Boolean): number => bool === true ? 1 : 0

// flatten :: [[]] -> []
const flatten = (arr: []): any => [].concat.apply([], arr)

// fixBool :: String | Number -> Bool
const fixBool = (b: (string | number)): Boolean => (b == 0) ? false : true

// fixDate :: String -> Date
const fixDate = (yyyymmdd: String): Date => {
  const specific = yyyymmdd.length > 8

  const y = parseInt(yyyymmdd.substring(0, 4))
  const m = parseInt(yyyymmdd.substring(4, 6)) - 1
  const d = parseInt(yyyymmdd.substring(6, 8))

  const h = specific
    ? parseInt(yyyymmdd.substring(8, 10))
    : 0
  const min = specific
    ? parseInt(yyyymmdd.substring(10, 12))
    : 0
  const sec = specific
    ? parseInt(yyyymmdd.substring(12,))
    : 0

  return new Date(y, m, d, h, min, sec)
}

// dateFromQuery :: String -> Date
const dateFromQuery = (date: string): Date => new Date(date)

// mergeByKey :: [{}] -> [{}] -> [{}]
const mergeByKey = (arr1: Array<any>, arr2: Array<any>): Array<any> => {
  return arr1.map(x => Object.assign(x, arr2.find(y => y.id == x.id)))
}

// const nthIndexOf :: String -> String -> Int -> Int
const nthIndexOf = (str: string, pattern: string, n: number): number => {
  let i = -1

  while (n-- && i++ < str.length) {
    i = str.indexOf(pattern, i)
    if (i < 0) break
  }
  return i
}

const parseID = (bulletin: OriginalBulletin): number => {
  const p1 = bulletin.description.indexOf('(') + 1
  const p2 = bulletin.description.indexOf(')')

  return parseInt(
    bulletin.description.slice(p1, p2)
  )
}

// parseName :: String -> Name
const parseName = (name: string): Name => {
  const comma = name.indexOf(',')
  const firstSpace = name.indexOf(' ') + 1
  const secondSpace = nthIndexOf(name, ' ', 2) + 1
  return {
    firstName: name.slice(firstSpace, secondSpace - 1).toLowerCase(),
    firstInitial: name.slice(firstSpace, firstSpace + 1).toLowerCase(),
    middleInitial: name.slice(secondSpace, secondSpace + 1).toLowerCase() || '',
    lastName: name.slice(0, comma).toLowerCase(),
  }
}

// tupleToObj :: [[]] -> LatLng
const tupleToObj = (arr: []): LatLng[] => arr.map((geo: number[]) => {
  return {
    lat: geo[0],
    lng: geo[1]
  }
})

// TODO: write in more declaritive way
// TODO: generate types for https://github.com/mikolalysenko/robust-point-in-polygon
const withinShape = (point: number[], bounds: any) => {
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  const x = point[0]
  const y = point[1]
  let inside = false

  for (let i = 0, j = bounds.length - 1; i < bounds.length; j = i++) {
      let xi = bounds[i][0], yi = bounds[i][1];
      let xj = bounds[j][0], yj = bounds[j][1];

      let intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }

  return inside
}

export {
  boolToInt,
  dateFromQuery,
  dateWithoutTime,
  fixBool,
  fixDate,
  flatten,
  mergeByKey,
  nthIndexOf,
  parseID,
  parseName,
  tupleToObj,
  withinShape,
}
