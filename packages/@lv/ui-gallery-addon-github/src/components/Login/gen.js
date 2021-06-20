import { genRandomColor } from '@lv/shared/common'

// TODO: 前景色和背景色匹配

export const gen_userInfo = count => {
  let result = []

  for (let i = 0; i < count; i++) {
    result.push({
      name: `LV${i}`,
      avatar_url: '',
      color: genRandomColor(),
    })
  }
  return result
}
