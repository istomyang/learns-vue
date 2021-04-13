export class SettingItem {
  constructor(id, title, selected, optionsGroup) {
    this.id = id
    this.title = title
    this.selected = selected
    this.optionsGroup = optionsGroup
  }
}

export class ItemOption {
  constructor(id, title) {
    ;(this.id = id), (this.title = title)
  }
}
