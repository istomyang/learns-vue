<template>
  <div>
    <h1>a</h1>
    a:{{ a }}
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'a',
  props: ['a'],
}
</script>

<style scoped></style>
