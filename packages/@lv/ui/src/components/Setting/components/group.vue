<template>
  <div class="setting-opts-group">
    <OptionItem
      v-for="data in datas"
      :key="data.id"
      :data="data"
      :currentOpenSetting.sync="currentOpenSetting"
    />
  </div>
</template>

<script>
import OptionItem from './option'
import { SettingItem, ItemOption } from './typedefs'
// TODO: 针对此路径优化
import { opts } from '../../../store'

export default {
  components: {
    OptionItem,
  },
  data() {
    return {
      // 每次只展开一个设置选项
      // 初始化 -1,使用组件id赋值
      currentOpenSetting: -1,
      settingOptions: ['text_scale', 'locale', 'theme', 'low_animation'],
    }
  },
  computed: {
    datas: function () {
      // 放入内部, 防止被监听, 导致datas频繁重建
      let count = 0
      let state = this.$store.state
      let settingItems = []
      this.settingOptions.forEach(k => {
        if (k === 'low_animation') {
          settingItems.push(
            new SettingItem(++count, k, state['low_animation'], [])
          )
        } else {
          settingItems.push(
            new SettingItem(++count, k, state[k], [
              ...Object.keys(opts[k]).map(op => new ItemOption(++count, op)),
            ])
          )
        }
      })
      return settingItems
    },
  },
}
</script>

<style lang="stylus" scoped>
.setting-opts-group
  display flex
  flex-direction column
  align-items stretch
  padding 0 !important
</style>