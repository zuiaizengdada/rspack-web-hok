<template>
  <div>
    <textarea :id="ueId" type="text/plain" />
  </div>
</template>

<script>
export default {
  name: 'UEditor',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    wordCount: {
      type: Boolean,
      default: false
    },
    maximumWords: {
      type: Number,
      default: 10000
    }
  },
  data() {
    return {
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      ue: null,
      info: ''
    }
  },
  watch: {
    value: {
      handler(value) {
        // console.log(value, 'value')
        if (value !== this.info) {
          if (this.ue) {
            this.ue && this.ue.ready(() => {
              // console.log(value)
              this.info = value
              this.ue.setContent(value)
            })
          } else {
            this.$nextTick(() => {
              this.seteditor()
            })
          }
        }
      },
      deep: true,
      immediate: true
    }
    // value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  beforeDestroy() {
    // eslint-disable-next-line no-undef
    UE.getEditor(this.ueId).destroy()
    // this.ue.delEditor(this.ueId)
  },
  mounted() {
    this.seteditor()
  },
  methods: {
    seteditor() {
      // eslint-disable-next-line no-undef
      this.ue = UE.getEditor(this.ueId, { maximumWords: this.maximumWords, wordCount: this.wordCount })
      const that = this
      that.ue.commands['addimgv2'] = {
        execCommand: function() {
          const that2 = this
          that.$SelectMaterialMultiple({
            visible: true,
            type: 'imageView',
            types: [0],
            success: (res) => {
              if (res.imageList.length > 0) {
                res.imageList.forEach(v => {
                  const materialUrl = v.materialUrl + '?x-oss-process=image/format,webp'
                  that2.execCommand('insertHtml', `<img src='${materialUrl}' style="vertical-align: middle;width: 100%"/>`)
                })
              }
            }
          })
          return true
        },
        queryCommandState: function() { }
      }

      that.ue.commands['addvideov2'] = {
        execCommand: function() {
          const that2 = this
          that.$OSSUpload({
            visible: true,
            success: (res) => {
              console.log(res, 'res')
              const arr = []
              res.map(v => {
                arr.push({
                  url: v.url,
                  // 视频宽高值， 单位px
                  width: '650',
                  controls: 'true'
                })
              })
              that2.execCommand('insertvideo', arr)
            }
          })
          return true
        },
        queryCommandState: function() { }
      }
      that.ue.addListener('contentChange', () => {
        const content = that.ue.getContent()
        this.info = content.replace(/\<img/gi, '<img style="width: 100%;height:auto;"')
        console.log('this.info', this.info)
        that.$emit('change', this.info)
      })
      this.ue.ready(() => {
        this.value && this.ue.setContent(this.value)
      })
    },
    getContent() {
      const content = this.ue.getContent()
      this.info = content.replace(/\<img/gi, '<img style="width: 100%;height:auto;"')
      return this.info
    },
    getText() {
      return this.ue.getContentTxt()
    }
  }
}
</script>

<style>

</style>
