<template>
  <div class="content" :class="[isDesktop ? 'desktop' : 'nodesktop']">
    <Gallery class="gallery" />
    <Demos class="demos" />
    <Footer class="footer" />
  </div>
</template>

<script>
import Gallery from './Gallery/index'
import Demos from './Categories/index'
import Footer from './Footer/index'

import { mapGetters } from 'vuex'

export default {
  components: {
    Gallery,
    Demos,
    Footer,
  },
  computed: {
    ...mapGetters({
      isDesktop: 'getIsDesktop',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.content
  position relative
  overflow scroll
  background-color #e6ebeb
  -ms-overflow-style none /* IE 10+ */
  scrollbar-width none /* Firefox */
  &::-webkit-scrollbar
    display none /* Chrome Safari */
  &.desktop
    border-top-left-radius 48px
    border-top-right-radius 48px
</style>