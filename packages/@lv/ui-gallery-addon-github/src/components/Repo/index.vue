<template>
  <div>
    <Info v-if="!openTree" @branch="tellBranch" :reponame="reponame" />
    <TreeView v-else :branch="selectedBranch" @back="tellClose" />
  </div>
</template>

<!--suppress ES6CheckImport -->
<script>
import Info from './info'
import TreeView from './treeview'

export default {
  name: 'Repo',
  data() {
    return {
      openTree: false,
      selectedBranch: '',
    }
  },
  props: ['reponame'],
  inject: ['username'],
  methods: {
    tellBranch(branch) {
      this.openTree = true
      this.selectedBranch = branch
    },
    tellClose() {
      this.openTree = false
    },
  },
  watch: {
    reponame() {
      this.openTree = false
    },
  },
  components: { TreeView, Info },
}
</script>

<style scoped></style>
