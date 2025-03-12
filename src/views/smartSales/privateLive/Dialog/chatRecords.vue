<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="696px"
    :loading="loading"
    :show-close="false"
    height="auto"
    :append-to-body="true"
    :top="top"
    @success="sure"
  >
    <div class="chatRecords">
      <div class="tTable">
        <div class="tHeader">
          <div class="table_column"><div class="cell">发言时间</div></div>
          <div class="table_column"><div class="cell">发言内容</div></div>
        </div>
        <div v-loading="loading" v-infinite-scroll="load" class="tBody" infinite-scroll-disabled="disabled" style="overflow: auto">
          <div v-for="(item, index) in list" :key="index" class="tableRow">
            <div class="table_column"><div class="cell">{{ item.msgTime | filterTime }}</div></div>
            <div class="table_column"><div class="cell">
              <template>
                <div v-if="item.msgBody && item.msgBody[0].msgType === 'TIMTextElem' && item.msgBody[0].textMsgContent" class="comment_content_text" v-html="filterContent(item.msgBody[0].textMsgContent.text)" />
                <div v-else-if="item.msgBody && item.msgBody[0].msgType === 'TIMImageElem' && item.msgBody[0].imageMsgContent.origImage">
                  <el-image
                    :style="{
                      width:`${!item.msgBody[0].imageMsgContent.origImage.width ? 100 : item.msgBody[0].imageMsgContent.origImage.width}px`,
                      height: `${!item.msgBody[0].imageMsgContent.origImage.height ? 100 : item.msgBody[0].imageMsgContent.origImage.height}px`,
                      maxHeight: '100px',
                      maxWidth: '100px'
                    }"
                    :src="item.msgBody[0].imageMsgContent.origImage.url"
                    fit="contain"
                    :preview-src-list="[item.msgBody[0].imageMsgContent.origImage.url]"
                  />
                </div>
              </template>
            </div></div>
          </div>
          <div v-if="list.length === 0" class="noDataText">
            <div class="empty-text">
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <!-- <el-button>取消</el-button> -->
      <div class="ss-material-box-bottom">
        <el-button size="small" @click="closeFn">取消</el-button>
      </div>
    </div>
    <div slot="title" class="liveRoomTitle">
      <span>{{ liveRoomName }}</span>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { emojiMap } from '@/views/live/liveRoom/components/p2/Emoji/emoji.js'
import { chatRecordPage } from '@/api/liveRoom/index'
import moment from 'moment'
export default {
  filters: {
    filterTime(val) {
      if (!val) { return '' }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      title: '发言记录',
      loading: false,
      liveRoomId: '',
      userId: '',
      liveRoomName: '',
      closeCb: () => {},
      list: [],
      pageSize: 10,
      currentPage: 1,
      noMore: false,
      top: '114px'
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.pageSize = 10
          this.currentPage = 1
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    closeFn() {
      this.visible = false
      this.closeCb && this.closeCb()
    },
    filterContent(value) {
      if (!value) {
        return ''
      } else {
        const reg = /\[(.*?)\]/gi
        const tmp = value.match(reg)
        if (!tmp) return value
        tmp.forEach((i) => {
          let imgStr = ''
          if (emojiMap[i]) {
            imgStr = `<img src="${emojiMap[i]}" style="width:20px;height:20px;display: inline-block;vertical-align:bottom;" />`
          } else {
            imgStr = i
          }
          value = value.replace(i, imgStr)
        })
        return value
      }
    },
    sure() {},
    load() {
      this.loading = true
      const params = {
        liveRoomId: this.liveRoomId,
        userId: this.userId,
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      chatRecordPage(params).then((res) => {
        if (this.currentPage === 1) {
          this.list = []
        }
        this.list.push(...res.data.items)
        this.total = res.data.total
        this.currentPage = this.currentPage + 1
        this.noMore = this.list.length === res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.chatRecords{
    max-height: 622px;
    padding: 20px 20px 0;
    .tTable {
        width: 100%;
        height: 100%;
        border: 1px solid #ebeef5;
        .tHeader {
            display: flex;
            border-bottom: 1px solid #ebeef5;
            .table_column {
                padding: 12px 0;
                min-width: 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                text-align: left;
                .cell {
                    display: inline-block;
                    box-sizing: border-box;
                    position: relative;
                    vertical-align: middle;
                    padding-left: 10px;
                    padding-right: 10px;
                    width: 100%;
                }
            }
            >div:nth-child(1) {
                width: 200px;
                border-right: 1px solid #ebeef5;
            }
        }
        .tBody {
            // height: calc(100% - 47px);
            max-height: calc(574px - 47px);
            // border-bottom: 1px solid #ebeef5;
            .tableRow {
                display: flex;
                .table_column {
                    padding: 12px 0;
                    min-width: 0;
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                    position: relative;
                    text-align: left;
                    .cell {
                        display: inline-block;
                        box-sizing: border-box;
                        position: relative;
                        vertical-align: middle;
                        padding-left: 10px;
                        padding-right: 10px;
                        width: 100%;
                    }
                }
                >div:nth-child(1) {
                    width: 200px;
                    min-width: 200px;
                    max-width: 200px;
                    border-right: 1px solid #ebeef5;
                }
            }
            .tableRow + .tableRow {
                border-top: 1px solid #ebeef5;
            }
        }
        .noDataText {
          min-height: 60px;
          text-align: center;
          width: 100%;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          .empty-text {
            line-height: 60px;
            width: 50%;
            color: #909399;
          }
        }
    }
}
.liveRoomTitle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 500;
  font-size: 16px;
  max-width: 250px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}
::v-deep {
  .ss-material-box-header-title {
    position: relative;
    width: 100%;
  }
}
</style>
