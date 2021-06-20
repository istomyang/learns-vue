import github from '@lv/ui-gallery-addon-github'

let key = 0
let id = 0
let galleries = []

;[github].forEach(gallery => {
  galleries.push({
    key: key++,
    id: id++,
    placeholder: false,
    ...gallery,
  })
})

for (let i = 0; i < 20; i++) {
  galleries.push({
    key: key++,
    id: id++,
    cid: '',
    card_title: {
      zh: '',
      en: '',
    },
    card_summary: {
      zh: '',
      en: '',
    },
    card_icon: '',
    card_bg: '',
    router: '',
    theme: 'light',
    placeholder: true,
  })
}

console.log('处理好的gallery', galleries)

export default { ...galleries }
