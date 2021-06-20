<template>
  <div>
    <v-btn @click="$emit('back')">Close</v-btn>

    <pre><code><div v-html="html" class="text-body-1"/></code></pre>
  </div>
</template>

<!--suppress ES6CheckImport -->
<script>
import { GetRepoReadMe, GetFileContent } from '../../gql/repo.gql'

export default {
  /**
   * File Viewer
   * Show file content and repo's readme
   * */
  name: 'fileViewer',
  data() {
    return {
      html: '',
      lock: false,
    }
  },
  props: ['file'],
  watch: {
    file(val, old) {
      if (old && val.uri === old.uri) return
      if (this.lock) return
      this.lock = true
      this.getFileContent(val).catch(e => {
        throw e
      })
    },
  },
  methods: {
    async getFileContent(file) {
      if (this.lock) return
      this.lock = true
      try {
        const uri = file.uri
        const type = file.ext
        const { data } = await this.$apollo.query({
          query: GetFileContent,
          variables: {
            uri,
            type,
          },
        })
        this.html = data.getFileContent
        this.lock = false
      } catch (e) {
        throw e
      }
    },
  },
  created() {
    this.getFileContent(this.file).catch(e => {
      throw e
    })
  },
}
</script>

<style scoped></style>
