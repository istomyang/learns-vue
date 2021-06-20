<template>
  <div>
    <v-btn @click="$emit('back')" v-if="openTree">Back</v-btn>
    <keep-alive>
      <v-treeview
        :active.sync="active"
        :items="files"
        :load-children="getLayer"
        activatable
        item-key="name"
        open-on-click
        transition
        return-object
        v-if="openTree"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.ext">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else> {{ fileExt[item.ext] }} </v-icon>
        </template>
      </v-treeview>
    </keep-alive>
    <FileViewer v-if="!openTree" :file="active[0]" @back="tellClose" />
  </div>
</template>

<!--suppress ES6CheckImport -->
<script>
import { OpenDirectory } from '../../gql/repo.gql'
import FileViewer from '../FileView'

export default {
  name: 'treeViewer',
  components: { FileViewer },
  data() {
    return {
      // the file choose, return object
      active: [],
      // repo
      files: [],
      // tmp use for reactive of children
      tmp: [],
      // if root init, do not need children
      rootHasInit: false,
      openTree: true,
      fileExt: {
        html: 'mdi-language-html5',
        json: 'mdi-code-json',
        js: 'mdi-language-javascript',
        md: 'mdi-language-markdown',
        java: 'mdi-language-java',
        normal: 'mdi-file-code',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
      },
    }
  },
  props: ['branch'],
  watch: {
    active() {
      this.openTree = false
    },
    branch(val) {
      this.rootHasInit = false
      this.getLayer(val).then(() => {
        this.rootHasInit = true
      })
    },
  },
  methods: {
    /**
     * param node call by treeView, represent opened folder
     * if you init, should pass branch info
     * */
    async getLayer(node) {
      let data
      try {
        const result = await this.$apollo.query({
          query: OpenDirectory,
          variables: {
            uri: node.uri,
          },
        })
        data = result.data
      } catch (e) {
        console.error('Error::TreeVew.vue: OpenDirectory')
        throw e
      }
      const r = this.handleData(data)
      this.rootHasInit ? this.$set(node, 'children', r) : (this.files = r)
      // node.children.push(...r)
    },
    handleData(data) {
      const rawList = data.getTreeLayer
      rawList.sort((f1, f2) => {
        const f1t = f1.type
        const f2t = f2.type
        if (f1t === 'tree' && f2t !== 'tree') return -1
        if (f1t === 'tree' && f2t === 'tree') return 0
        if (f1t !== 'tree' && f2t === 'tree') return 1
      })

      return rawList.map(file => {
        const r = { name: file.name, uri: file.uri }
        if (file.type === 'tree') {
          r['children'] = []
        } else {
          const rr = file.name.match(/(?<=(\w\.))(\w+)$/g)
          const has = Object.keys(this.fileExt).find(k => k === rr)
          r['ext'] = (!!rr && has && rr[0]) || 'normal'
        }
        return r
      })
    },
    tellClose() {
      this.openTree = true
    },
  },
  created() {
    this.rootHasInit = false
    this.getLayer(this.branch).then(() => {
      this.rootHasInit = true
    })
  },
}
</script>

<style scoped></style>
