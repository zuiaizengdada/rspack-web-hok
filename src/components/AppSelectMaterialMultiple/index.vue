<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="900px"
    height="545px"
    top="10vh"
    @success="successFn"
  >
    <div v-loading="loading" class="ele-tabs-wrap">
      <el-tabs v-model="type" @tab-click="tabClick">
        <el-tab-pane v-for="(item) in types" :key="item" :name="tabs[item].type">
          <span slot="label">
            {{ tabs[item].name }}
            (
            <span v-if="item === 0">{{ imageList.length }}</span>
            <span v-else-if="item === 1">{{ audioList.length }}</span>
            <span v-else-if="item === 2">{{ videoList.length }}</span>
            <span v-else>{{ fileList.length }}</span>
            )
          </span>
        </el-tab-pane>
      </el-tabs>

      <div v-if="type === 'imageView'">
        <imageView ref="goodsView" v-model="imageList" :max-size="maxSize" :classlist="classlist.imageClass" :file-type="fileType" />
      </div>
      <div v-if="type === 'audioView'">
        <audioView ref="goodsView" v-model="audioList" :classlist="classlist.audioClass" :file-type="fileType" />
      </div>
      <div v-if="type === 'videoView'">
        <videoView ref="goodsView" v-model="videoList" :classlist="classlist.videoClass" :file-type="fileType" />
      </div>
      <div v-if="type === 'fileView'">
        <fileView ref="goodsView" v-model="fileList" :classlist="classlist.fileClass" :file-type="fileType" />
      </div>
    </div>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import imageView from './components/imageView.vue'
import videoView from './components/videoView.vue'
import fileView from './components/fileView.vue'
import audioView from './components/audioView.vue'
import store from '@/store'
export default {
  components: {
    AppDialog,
    imageView,
    videoView,
    fileView,
    audioView
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    types: {
      type: Array,
      default: () => {
        return [0, 1, 2, 3]
      }
    },
    type: {
      type: String,
      default: 'imageView'
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    fileType: {
      type: Array,
      default: () => []
    },
    // eslint-disable-next-line vue/require-default-prop
    max: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      listType: 'list', // 列表模式：list:列表；card：卡片
      tabs: [
        { id: '1', name: '图片', type: 'imageView' },
        { id: '2', name: '音频', type: 'audioView' },
        { id: '3', name: '视频', type: 'videoView' },
        { id: '4', name: '', type: '' },
        { id: '5', name: '文档', type: 'fileView' }
      ],
      imageList: [],
      audioList: [],
      videoList: [],
      fileList: [],
      classlist: [],
      maxSize: null
    }
  },
  watch: {
    visible: {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            this.getClassList()
            this.$refs.goodsView.init && this.$refs.goodsView.init()
          })
        } else {
          this.$refs.goodsView && this.$refs.goodsView.clearTable()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  created() {
    // this.getClassList()
  },
  methods: {
    tabClick() {
      console.log('111')
      // this.getClassList()
      this.$nextTick(() => {
        this.$refs.goodsView.init && this.$refs.goodsView.init()
      })
    },
    async getClassList() {
      this.loading = true
      const res = await store.dispatch('option/getClass')
      this.classlist = res
      this.loading = false
    },
    close() {
      this.visible = false
    },
    successFn() {
      if (this.max) {
        const myMax = this.imageList.length + this.fileList.length + this.videoList.length + this.audioList.length
        if (myMax > this.max) {
          return this.$message.error(`选择数据不能超过${this.max}条`)
        }
      }
      this.visible = false
      this.success && this.success({
        imageList: this.imageList,
        fileList: this.fileList,
        videoList: this.videoList,
        audioList: this.audioList
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .ele-tabs-wrap {
      .el-tabs__header {
        margin: 0;
        .el-tabs__nav-wrap {
          padding: 0 24px;
          .el-tabs__item {
            height: 48px;
            line-height: 48px;
          }
        }
      }
    }
  }

  .ss-material-picture {
    padding: 16px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-wrap {
      display: flex;
      align-items: center;
      .ss-material-button {
        color: #105cfb;
        border-color: transparent;
        background: transparent;
        cursor: pointer;
      }

    }
    .right-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        color: #cdcdcd;
        font-size: 20px;
        margin-right: 5px;
      }
      .active {
        color: #1890ff;
      }
    }

  }
    .ss-material-main {
      display: flex;
      margin: 12px 24px 0;
      .ss-material-main-left {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        height: 421px;
        border: 1px solid #eee;
        flex: none;
        .ss-material-main-tree {
          height: 100%;
          flex: 1;
          overflow: hidden;
          .ss-search-wrap {
            width: 200px;
            padding: 12px 8px 7px;
            box-sizing: border-box;
          }
          .ss-scroll {
            width: 200px;
            // height: calc(100% - 55px);
            height: 100%;
            ::-webkit-scrollbar { display: none; }
            .ss-all {

              > .title {
                padding-left: 8px;
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }
      .ss-material-main-right {
        flex: 1;
        border: 1px solid #eee;
        border-top: none;
        border-left: none;
        .content-wrap {
          height: 360px;
          overflow-y: auto;
          .card-pattern-list-wrap {
            padding: 0 20px;
            height: 100%;
            ::v-deep {
              .el-checkbox-group {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: wrap;
              }
            }
            .check {
              margin-bottom: 6px;
            }
            .picture-card {
              border-radius: 4px;
              border: 1px solid #eee;
              font-size: 12px;
              width: 184px;
              margin: 0 12px 13px 0;
              .content {
                position: relative;
                overflow: hidden;
                padding-top: 100%;
                > .el-image {
                  cursor: pointer;
                  position: absolute;
                  left: 0;
                  bottom: 0;
                  top: 0;
                  right: 0;
                  width: 100%;
                  height: 100%;
                  -o-object-fit: scale-down;
                  object-fit: scale-down;
                  background: #fafafa;
                }
                img {
                  cursor: pointer;
                  position: absolute;
                  left: 0;
                  bottom: 0;
                  top: 0;
                  right: 0;
                  width: 100%;
                  height: 100%;
                  -o-object-fit: scale-down;
                  object-fit: scale-down;
                  background: #fafafa;
                }
                .resolution {
                  position: absolute;
                  bottom: 8px;
                  right: 8px;
                  padding: 2px 8px;
                  color: #fff;
                  background: #333;
                  border-radius: 4px;
                  opacity: .7;
                }
              }
              .detail {
                padding: 8px;
                .common-row {
                  color: #999;
                  width: 100%;
                  display: -webkit-box;
                  display: -webkit-flex;
                  display: -ms-flexbox;
                  display: flex;
                  -webkit-box-pack: justify;
                  -webkit-justify-content: space-between;
                  -ms-flex-pack: justify;
                  justify-content: space-between;
                  -webkit-box-align: center;
                  -webkit-align-items: center;
                  -ms-flex-align: center;
                  align-items: center;
                  margin-top: 9px;
                  font-size: 12px;
                }
              }
            }
          }
        }
        .pagination-wrap {
          height: 52px;
          // border-top: 1px solid red;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-wrap {
          height: 360px;
          width: 100%;
          .header-wrap {
            height: 40px;
            background-color: #f6f8fa;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            line-height: 40px;
            > table {
              width: 100%;
            }
          }
        }
      }
    }
    .m-picture-title {
      height: 18px;
      line-height: 18px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      color: #333;
    }
    .m-picture-property {
      height: 18px;
      line-height: 18px;
      color: #888;
    }
    .size-icon {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
    .videoImg {
      width: 80px;
      height: 60px;
      cursor: pointer;
      > img {
          width: 100%;
          height: 100%;
      }
    }
</style>
