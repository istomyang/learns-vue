<template>
  <div @click="switching" class="switcher">
    <div class="wrapper" :class="{ isopen: isOpen }">
      <div class="bullet"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
  },
  methods: {
    switching() {
      this.$emit('update:isOpen', !this.isOpen)
    },
  },
}
</script>

<style lang="css" scoped>
.wrapper {
  position: relative;
  left: 0px;
  top: 0px;
  height: 20px;
  width: 35px;
  border-radius: 10px;
  background-color: rgb(219, 204, 204);
  transition: all 0.5s ease;
}
.bullet {
  position: absolute;
  width: 26px;
  height: 26px;
  top: -3px;
  left: -10px;
  border-radius: 50%;
  background-color: rgb(255, 255, 255);
  box-shadow: 1px 1px 3px grey;
  transition: background-color 0.3s ease, left 0.3s ease;
}
.bullet:hover {
  box-shadow: 0px 0px 0px 10px rgba(255, 0, 0, 0.109);
}
.wrapper.isopen {
  background-color: rgb(221, 131, 146);
}
.wrapper.isopen .bullet {
  left: 19px;
  background-color: rgb(233, 71, 98);
}
</style>