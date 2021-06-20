<template>
  <div>
    <transition name="info">
      <component :is="who" />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import OI from './OptionsInfo'
import NI from './NoteInfo'
import CI from './CodeInfo'

export default {
  props: {
    show: {
      validator: function (value) {
        return ['options', 'note', 'code'].indexOf(value) !== -1
      },
    },
    fullscreen: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
    who() {
      switch (this.show) {
        case 'options':
          return 'OI'
          break
        case 'note':
          return 'NI'
          break
        case 'code':
          return 'CI'
          break
        default:
          break
      }
    },
  },
  components: { OI, NI, CI },
}
</script>

<style lang="stylus" scoped>
.info-enter-active, .info-leave-active
  transition opacity 0.3s

.info-enter, .info-leave-to
  opacity 0
</style>
