<template>
  <v-dialog transition="dialog-top-transition" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" v-bind:on="on"> </slot>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-toolbar color="primary" dark>功能还未实现！</v-toolbar>
        <v-card-text>
          <div class="text-h2 pa-12">慢功才能出细活，请再等等吧！</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.value = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: 'on-progress',
}
</script>

<style scoped></style>
