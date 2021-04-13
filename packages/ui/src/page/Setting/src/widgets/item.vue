<template>
  <div class="item-wrapper" @click="click">
    <div class="pre">
      <div class="inner" v-show="isSelected"></div>
    </div>
    <div class="after">
      <slot name="default">You can put sth. as slot here!</slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSelected: false,
    }
  },
  props: {
    name: String,
    selected: String,
  }, 
  methods: {
    click() {
      if (this.selected !== this.name) {
        this.isSelected = !this.isSelected
        this.$emit('update:selected', this.name)

        // 方案2
        // this.$parent.data.selected = this.name
      }
    },
  },
  watch: {
    selected(newVal, oldVal) {
      if (newVal !== this.name) {
        this.isSelected = false
      } else {
        this.isSelected = true
      }
    },
  },
  mounted() {
    if (this.selected === this.name) this.isSelected = true
  },
}
</script>

<style scoped>
.item-wrapper {
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 32px;
  border-left: 3px solid #e5ebeb;
  font-size: 1.4em;
}
.item-wrapper:hover {
  background-color: #f0f3f3;
  border-left: 3px solid #58c0d3;
}

.pre {
  box-sizing: border-box;
  flex: 0 0 auto;
  height: 22px;
  width: 22px;
  margin: 0px 10px;
  border-radius: 50%;
  border: 3px solid #c9395e;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pre:hover {
  box-shadow: 0px 0px 5px 6px #c1cfcf;
}
.inner {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  background-color: #c9395e;
}
.after {
  font-family: 'Open Sans', 'Noto Sans SC', serif;
  font-size: 1.2em;
  font-weight: 300;

}
</style>

