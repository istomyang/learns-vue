<template>
  <div>
    <h1>b</h1>
    b:{{ b }}{{ a }}
  </div>
</template>

<script>
export default {
  name: 'b',
  props: ['b', 'a'],
}
</script>

<style scoped></style>
