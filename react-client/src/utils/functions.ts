/**
 * Higher-order functions used across components
 */

// twoDigit :: Int | String -> String
const twoDigit = (i: any) => intLength(i) == 1 ? `0${i}` : i

// getLastWeek :: Date -> String
export const getLastWeek = (d: Date) => {
  const prev = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7)
  const year = prev.getFullYear()
  const month = prev.getMonth() + 1
  const day = prev.getDate()

  return `${year}-${twoDigit(month)}-${twoDigit(day)}`
}

// intLength :: Int -> Int
const intLength = (i: number) => ('' + i).length

// withinShape :: [Point] -> Point -> Bool
export const withinShape = (bounds: any) => (point: number[]) => {
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
