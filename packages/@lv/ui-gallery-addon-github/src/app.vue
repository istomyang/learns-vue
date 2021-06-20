<template>
  <div class="app">
    <v-app>
      <router-view />
    </v-app>
    <Back to="/" />
  </div>
</template>

<script>
import Back from '@lv/shared/vue/Back'

export default {
  data() {
    return {}
  },
  components: { Back },
}
</script>

<style lang="sass">
.v-btn
  text-transform: none !important
</style>

<style lang="css" scoped></style>

<style lang="sass" scoped>
.app
  background-color: #fff

.btn
  width: 100px
  height: 45px
</style>
