<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="606px"
    :loading="loading"
    height="auto"
    :top="top"
  >
    <div ref="liveTool" class="liveTool" :style="`height: ${height}px`" />
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import Vue from 'vue'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      loading: false,
      top: '114px',
      title: '',
      liveRoomId: '',
      height: '',
      viewComponent: null,
      options: {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          console.log(this.height, 'this.height')
          this.$nextTick(() => {
            try {
              this.top = Math.abs(window.innerHeight - this.height) / 2 + 'px'
              console.log(this.options, 'optionsoptions')
              if (this.viewComponent && this.$refs.liveTool) {
                const viewC = Vue.extend(this.viewComponent)
                const ViewComponent = viewC
                console.log(ViewComponent, 'ViewComponent')
                const viewComponentInstance = new ViewComponent({
                  el: document.createElement('div')
                })
                for (const key in this.options) {
                  console.log(this.options, 'this.options')
                  viewComponentInstance[key] = this.options[key]
                }
                this.$refs.liveTool.appendChild(viewComponentInstance.$el)
              }
            } catch (err) {
              console.log(err, 'err')
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {

  },
  methods: {
  }
}
</script>

  <style lang='scss' scoped>
  </style>
