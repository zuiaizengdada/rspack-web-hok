<template>
  <div class="hotspot">
    <el-tabs v-if="isFullScreen()" v-model="activeName" class="tabs-hotspot">
      <el-tab-pane label="热点推荐" name="first">
        <Recommend ref="recommendRef" />
      </el-tab-pane>
      <el-tab-pane label="选题生成" name="second">
        <el-empty
          v-if="list.length < 1"
          style="position: absolute; left: 42%"
          :image-size="200"
        />
        <div id="listSelectedTopic" class="list-selected-topic">
          <template v-for="(item, i) in list">
            <div :key="i">
              <!-- <div class="title">
                <span >热点文案提取</span>
                <span class="time">
                  时间：{{ item.extractTime || getTime }}</span>
              </div> -->
              <div
                class="content"
                :style="
                  !item.isShowSelectedTopic &&
                    !item.detailSelectedTopic.isHistory &&
                    list.length > 1
                    ? { marginBottom: '34rem' }
                    : {}
                "
              >
                <CopywritingExtract
                  :key="getTime"
                  :ref="item.detailExtract.id"
                  :obj="item.detailExtract"
                  @copywritingExtractEmit="copywritingExtractEmit"
                  @generate="generateSelectedTopic"
                />
                <GenerateSelectedTopic
                  v-if="item.isShowSelectedTopic"
                  :key="item.extractTime"
                  :obj="item.detailSelectedTopic"
                  @generateSelectedTopicSend="generateSelectedTopicSend"
                  @close="closeGenerateSelectedTopic(item)"
                />
              </div>
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Recommend from './Recommend'
import CopywritingExtract from './CopywritingExtract'
import GenerateSelectedTopic from './GenerateSelectedTopic'
import { hotNewsHistoryPage } from '@/api/aigc'
import moment from 'moment'
export default {
  components: { Recommend, CopywritingExtract, GenerateSelectedTopic },
  inject: ['isFullScreen'],
  provide() {
    return { extractChange: this.extractChange }
  },
  data() {
    return {
      activeName: 'first',
      /**
       *  热点历史列表
       * @type {Array}
       * @property {Object}  list
       * @property {String}  list.status  文案提取状态 0-未生成 1-已生成
       * @property {Boolean}  list.isShowExtract  显示热点提取
       * @property {Object}  list.detailExtract   热点详情信息
       * @property {Boolean}  list.isShowSelectedTopic  显示选题生成
       * @property {Object}  list.detailSelectedTopic  选题生成详情信息
       * @property {String}  list.detailSelectedTopic.status  选题生成状态 0-未生成 1-已生成
       */
      list: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      isLoading: false
    }
  },
  computed: {
    getTime() {
      return moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    activeName(val) {
      if (val === 'first') {
        // this.$refs.recommendRef.initData()
      }
      if (val === 'second') {
        // this.this.pageIndex = 1
        // this.initData()
        this.toBottom()
      }
    }
  },
  created() {
    this.$nextTick(() => {
      document.getElementById('listSelectedTopic') &&
        document
          .getElementById('listSelectedTopic')
          .addEventListener('scroll', this.scrollEvent)
    })
    this.initData()
  },
  deactivated() {
    // 用于组件销毁时移除事件监听
    document
      .getElementById('listSelectedTopic')
      .removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    closeGenerateSelectedTopic(record) {
      record.isShowSelectedTopic = false
      this.$nextTick(() => {
        this.$refs[record.detailExtract.id][0].isOk = false
      })
    },
    generateSelectedTopicSend() {
      const info = this.list[this.list.length - 1].detailSelectedTopic
      info.status = 2
    },
    copywritingExtractEmit(val) {
      const info = this.list[this.list.length - 1].detailExtract
      info.status = 1
      info.conversation_id = val
    },
    generateSelectedTopic(content) {
      this.activeName = 'second'
      const info = this.list[this.list.length - 1]
      info.detailExtract.status = 2
      info.isShowSelectedTopic = true

      info.detailSelectedTopic.id = info.detailExtract.conversation_id
      info.detailSelectedTopic.content = content
      this.toBottom()
    },
    scrollEvent(e) {
      // 向上滚动
      if (e.target.scrollTop === 0 && !this.isLoading) {
        if (this.list.length >= this.total) return
        this.pageIndex++
        hotNewsHistoryPage({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
          .then(res => {
            this.isLoading = false
            // 插入到数组前面
            res.data.items.map(item => {
              const info = {
                createdTime: item.createdTime,
                isShowExtract: true,
                isShowSelectedTopic: !!item.selectTopic,
                detailExtract: { ...item, status: 2 },
                detailSelectedTopic: {
                  ...item,
                  status: 2,
                  isHistory: true
                }
              }
              this.list.unshift(info)
            })
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    },
    getList() {
      this.isLoading = true
      hotNewsHistoryPage({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
        .then(res => {
          this.isLoading = false
          this.total = res.data.total
          this.list = []
          res.data.items.map(item => {
            const info = {
              extractTime: item.extractTime,
              isShowExtract: true,
              isShowSelectedTopic: !!item.selectTopic,
              detailExtract: { ...item, status: 2 },
              detailSelectedTopic: {
                ...item,
                status: 2,
                isHistory: true
              }
            }
            this.list.unshift(info)
          })
          console.log(this.list, 'this.list======================')
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    initData() {
      this.getList()
    },
    extractChange(record) {
      this.activeName = 'second'
      const lastDelete =
        this.list.length > 0
          ? this.list[this.list.length - 1].detailExtract.status < 2
          : false
      // 判断最后一个是否是未生成的文案提取 如果是则删除
      if (lastDelete) {
        this.list.splice(this.list.length - 1, 1)
      }
      //
      if (this.list.length > 0 && !lastDelete) {
        const info = this.list[this.list.length - 1]
        if (info.isShowSelectedTopic && info.detailSelectedTopic.status !== 2) {
          this.$message.warning({
            message: '正在生成选题，请稍后',
            customClass: 'amap-sug-result'
          })
          // this.list.splice(this.list.length - 1, 1)
          return
        }
        info.detailExtract.status = 2
        info.detailSelectedTopic.isHistory = true
      }
      this.list.push({
        isShowExtract: true,
        isShowSelectedTopic: false,
        detailExtract: { ...record },
        detailSelectedTopic: { status: 0, isHistory: false }
      })
      this.toBottom()
      console.log(this.list, ' this.list')
    },
    toBottom() {
      this.$nextTick(() => {
        // 滚动条置底
        document.getElementById('listSelectedTopic').scrollTop =
          document.getElementById('listSelectedTopic').scrollHeight
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hotspot {
  width: 100%;
  height: auto;
  margin: 25px 0 20px 0;
  padding: 0 0 18px 0;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e4e4e4;

  .list-selected-topic {
    width: 100%;
    height: calc(100vh - 185px);
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    padding-right: 4px;
    background-color: #fff;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #e5e5e5;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  .title {
    width: 100%;
    font-weight: 400;
    font-size: 18px;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .time {
      font-size: 12px;
      color: #838383;
    }
    margin-bottom: 20px;
  }
  .content {
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
}
::v-deep {
  .tabs-hotspot {
    .el-tabs__header {
      background: linear-gradient(90deg, #3a7fff 100%, #00acf0 0%);
      border-radius: 10px 10px 0px 0px;
      padding: 12px 24px 0 24px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
      background: linear-gradient(90deg, #3a7fff 100%, #00acf0 0%);
    }
    .el-tabs__active-bar {
      height: 4px !important;
      background-color: #0047A1 !important;
    }
    .el-tabs__item {
      font-size: 17px;
      line-height: 30px;
      color: rgba(255, 255, 255, 0.95);
    }
    .el-tabs__item.is-active {
      color: rgba(255, 255, 255) !important;
    }
  }
}
</style>
