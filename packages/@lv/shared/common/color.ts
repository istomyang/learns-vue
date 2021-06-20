import { math_between } from './math'

export const genRandomColor = () => {
  const r = parseInt(math_between('[0:255]')).toString(16)
  const g = parseInt(math_between('[0:255]')).toString(16)
  const b = parseInt(math_between('[0:255]')).toString(16)

  return `#${r}${g}${b}`
}
