<template>
  <div class="videoGeneration">
    <div v-if="!clipTask.length" class="task-no-data">
      <div class="task-no-data-icon-box">
        <svg-icon icon-class="t_nodata" class="task-no-data-icon" />
      </div>
      <div>暂无内容</div>
    </div>

    <div class="videoGenerationContent">
      <scrollPane style="height: 100%">
        <div v-for="item in clipTask" :key="item.id" class="p-l-20 p-r-20">
          <div class="task-child-clip">
            <div class="task-child-clip-l">
              <svg-icon icon-class="gongchengshengcheng" class="task-child-clip-l-icon" />
            </div>
            <div class="task-child-clip-r">
              <div class="task-child-clip-r-title">
                <div>{{ item.name }}</div>
                <div>
                  <span v-if="item.status === 3" class="task-color-red">导出失败</span>
                  <span v-else-if="item.status === 2" class="task-color-green">已完成</span>
                  <span v-else-if="item.status === 1" class="c_FF7D00">进行中...</span>
                </div>
              </div>
              <div class="task-child-clip-r-status">
                <div>创建时间:{{ item.createTime }} 用时{{ item.duration }}分钟<span v-if="item.status===2">/共{{ item.count }}条</span></div>
                <div v-if="item.status===2" class="task-child-clip-r-status-down" @click.stop="download(item.url)">下载数据</div>
                <div class="task-child-clip-r-status-del" @click.stop="delClip(item.id)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </scrollPane>
    </div>

    <div v-if="clipTask.length" class="footer">
      <span class="footerTotal">合计{{ pageConfig.total }}条</span>
      <pagination :total="pageConfig.total" :current="pageConfig.current" :size="pageConfig.size" @currentChange="pageChange" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import scrollPane from './scrollPane.vue'
import pagination from './pagination.vue'
import { getExportTaskList, deletaExportTaskList } from '@/api/task/index'
import axios from 'axios'

export default {
  components: {
    scrollPane,
    pagination
  },
  data() {
    return {
      clipTask: [],
      pageConfig: {
        total: 0,
        current: 1,
        size: 10
      },
      loading: false,
      CancelToken: axios.CancelToken,
      source: null,
      clipTimeout: null
    }
  },
  mounted() {},
  methods: {
    init() {
      this.pageConfig.current = 1
      this.setClipTimeout()
    },
    // 获取生成视频列表
    getList() {
      if (this.source) {
        // 取消上一次发出的请求
        this.source.cancel('cancel')
      }
      this.source = this.CancelToken.source()
      this.loading = true
      const params = {
        current: this.pageConfig.current,
        size: this.pageConfig.size
      }
      getExportTaskList(params, this.source.token).then(res => {
        this.clipTask = res.data.records.map(i => {
          const duration = moment(i.status === 1 ? new Date() : i.updateTime).diff(moment(i.createTime), 'minutes')
          return {
            ...i,
            createTime: moment(i.createTime).format('YYYY-MM-DD'),
            updateTime: moment(i.updateTime).format('YYYY-MM-DD'),
            duration: duration < 1 ? 1 : duration
          }
        })
        this.pageConfig.total = +res.data.total
        this.$emit('numberChange', +res.data.total)
        if (res.data.items.length === 0 && this.pageConfig.current !== 1) {
          this.pageConfig.current--
          this.getList()
        }
        this.loading = false
      }).catch((err) => {
        console.log(err.message)
        this.loading = false
      })
    },
    // 分页改变触发
    pageChange(res) {
      this.pageConfig.current = res
      this.getList()
    },
    // 点击删除按钮触发
    delClip(id) {
      this.loading = true
      deletaExportTaskList(id).then((res) => {
        this.getList()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 开启轮询查询
    setClipTimeout() {
      this.getList()
      this.clearClipTimeout()
      this.clipTimeout = window.setInterval(() => {
        this.getList()
      }, 10000)
    },
    // 清除轮询
    clearClipTimeout() {
      if (this.clipTimeout) {
        clearInterval(this.clipTimeout)
        this.clipTimeout = null
      }
    },
    download(url) {
      window.open(url, '_self')
    }
  }
}
</script>

  <style lang='scss' scoped>
  .videoGeneration {
    height: 432px;
    position: relative;
    .task-no-data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: normal;
      font-size: 18px;
      font-family: MicrosoftYaHei;
      padding-top: 76px;
      color: #919293;
      .task-no-data-icon-box {
          height: 148px;
          overflow: hidden;
          .task-no-data-icon {
              font-size: 175px
          }
      }
    }
    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px -2px 8px 0px rgba(0,0,0,0.1);
      .footerTotal {
        padding-left: 20px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #999999;
        line-height: 22px;
      }
    }
    .videoGenerationContent {
      height: calc(100% - 54px);
      overflow: auto;
      padding-bottom: 10px;
      .task-child-clip {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #EFF2F6;
        display: flex;
        line-height: normal;
        margin-top: 16px;
        width: 100%;
        .task-child-clip-l {
          margin-right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          min-width: 52px;
          height: 52px;
          background: #ECF5FE;
          border-radius: 4px;
          position: relative;
          .task-child-clip-l-icon {
            font-size: 38px;
          }
          .task-child-clip-l-stop {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            font-size: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(71,160,251,0.4);
            border-radius: 4px;
            backdrop-filter: blur(1px);
          }
        }
        .task-child-clip-r {
          flex: 1;
          width: 0;
          .task-child-clip-r-title {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            // display:-webkit-box;
            // text-overflow:ellipsis;
            // overflow:hidden;
            // -webkit-line-clamp: 1;
            // -webkit-box-orient:vertical;
            display: flex;
            justify-content: space-between;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
          }
          .task-child-clip-r-progress {
            margin-top: 8px;
          }
          .task-child-clip-r-status {
            margin-top: 8px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333;
            display: flex;
            justify-content: space-between;
            .task-child-clip-r-status-del {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #F53F3F;
              cursor: pointer;
            }
            .task-child-clip-r-status-down {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #0C6FFF;
              cursor: pointer;
            }
            .estimated-time {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #FF7D00;
              line-height: 22px;
            }
          }
        }
      }
    }
  }
  .p-l-20 {
    padding-left: 20px;
  }
  .p-r-20 {
    padding-right: 20px;
  }
  .c_FF7D00 {
    color: #FF7D00;
  }
  .task-color-green {
    color: #00B42A;
  }
  .task-color-red {
    color: #F53F3F;
  }
  </style>
