// TODO: more in autoprefixer
export const autoPrefixer = (style) => {
  if (typeof style !== 'object') return style
  const prefixs = ['ms-', 'webkit-']
  const rules = ['transform', 'transition', 'animation']

  rules.forEach((r) => {
    const value = style[r]
    if (r && value) {
      prefixs.forEach((pre) => {
        style[pre + r] = value
      })
    }
  })

  return style
}

import ResizeObserver from 'resize-observer-polyfill'


