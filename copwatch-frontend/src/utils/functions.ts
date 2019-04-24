/**
 * Higher-order functions used across components
 */

// getLastWeek :: Date -> String
export const getLastWeek = (d: Date) => {
  const prev = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7)
  return `${prev.getMonth() + 1}/${prev.getDate()}/${prev.getFullYear()}`
}
