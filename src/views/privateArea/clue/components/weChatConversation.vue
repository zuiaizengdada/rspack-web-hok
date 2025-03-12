<template>
  <div class="weChatConversation">
    <el-form :inline="true" :model="search" class="searchTop" size="small">
      <el-form-item label="消息：">
        <el-input v-model.trim="search.message" placeholder="请输入" style="width: 180px" clearable />
      </el-form-item>
      <el-form-item label="日期：">
        <el-date-picker
          v-model="search.time"
          style="width: 220px"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchFn">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-button size="small" class="m-b-20 btn_primary syncbtn" :loading="asyncloading" @click="syncWechatTalk">手动同步最新数据</el-button> -->
    <ScrollPane ref="ScroollPane" class="chatList" @load="rollEnd" @rollTop="rollTop">
      <div v-if="!hasMore" class="noData">—— 没有更多聊天记录了 ——</div>
      <div v-for="(item, index) in tableData" :id="`contChat${item.id}`" :key="index">
        <chatView
          :item="item"
          @imgLoadSuccess="imgLoadSuccess"
        />
      </div>
    </ScrollPane>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane.vue'
import chatView from './chatView.vue'
import { getWechatTalkPage, syncWechatTalk } from '@/api/privateArea/clue'
import moment from 'moment'
export default {
  components: {
    ScrollPane,
    chatView
  },
  props: {
    clueId: {
      type: [String, Number],
      default: ''
    },
    userInfo: {
      type: Object,
      default: () => {
        return {
          age: '',
          avatar: '',
          corpAddress: '',
          corpName: '',
          description: '',
          externalUserId: '',
          followQwUserId: '',
          followWbUserId: '',
          gender: '',
          industries: '',
          mainBusiness: '',
          name: '',
          phone: '',
          position: '',
          relStatus: 0,
          remark: '',
          sparePhone: '',
          tags: [],
          wbExternalUserId: '',
          yearlyTurnover: ''
        }
      }
    }
  },
  data() {
    return {
      asyncloading: false,
      search: {
        message: '',
        time: ['', '']
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 20,
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          const minTime = moment().subtract(12, 'month').valueOf()
          return time.getTime() < minTime
          // // eslint-disable-next-line eqeqeq
          // if (this.currentTime) {
          //   // 3个月内
          //   const minTime = moment(this.currentTime).subtract(3, 'month').valueOf()
          //   const maxTime = moment(this.currentTime).add(3, 'month').valueOf()
          //   return time.getTime() < minTime || time.getTime() > maxTime
          // }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      hasMore: false,
      id: ''
    }
  },
  watch: {
    'search.time': {
      handler(val) {
        if (!val) {
          const end = moment().format('YYYY-MM-DD')
          const start = moment().subtract(12, 'month').format('YYYY-MM-DD')
          this.search.time = [start, end]
          console.log(this.search.time)
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    const end = moment().format('YYYY-MM-DD')
    const start = moment().subtract(12, 'month').format('YYYY-MM-DD')
    this.search.time = [start, end]
    this.getWechatTalkPage()
  },
  methods: {
    searchFn() {
      this.pageIndex = 1
      this.tableData = []
      this.getWechatTalkPage()
    },
    rollEnd() {},
    rollTop() {
      console.log('滚动到顶部')
      if (this.hasMore && !this.loading) {
        this.pageIndex = this.pageIndex + 1
        this.getWechatTalkPage().then(() => {
          this.$nextTick(() => {
            this.id && document.querySelector(`#contChat${this.id}`).scrollIntoView(true)
            this.tableData.length > 0 && (this.id = this.tableData[0].id)
          })
        })
      }
    },
    getWechatTalkPage() {
      this.loading = true
      const data = {
        clueId: this.clueId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        content: this.search.message,
        endTime: this.search.time && this.search.time[1] ? this.search.time[1] : '',
        startTime: this.search.time && this.search.time[0] ? this.search.time[0] : '',
        followWbUserId: this.userInfo.wbFollowQwUserId, //  'wogizUDQAAiJBfJFK_TSdaf1s8RPixsg'
        wbExternalUserId: this.userInfo.wbExternalUserId// 'wmgizUDQAAQ4NF4FoM2VFu1Ax_ofiK9A'
      }
      this.tableData.length > 0 && (this.id = this.tableData[0].id)
      return getWechatTalkPage(data).then(res => {
        res.data.items.map(v => {
          v.isMine = v.staffId === v.fromId
          v.content = JSON.parse(v.content)
        })
        this.loading = false
        if (this.pageIndex === 1) {
          // res.data.items.map(v => {
          //   this.tableData.unshift(v)
          // })
          this.tableData = res.data.items
          this.scrollBottom()
        } else {
          this.tableData = [...this.tableData, ...res.data.items]
        }
        this.hasMore = this.tableData.length < res.data.total && this.tableData !== 0
      }).catch(() => {
        this.pageIndex !== 1 && (this.pageIndex = this.pageIndex - 1)
        this.loading = false
      })
    },
    syncWechatTalk() {
      this.asyncloading = true
      const data = {
        followWbUserId: this.userInfo.wbFollowQwUserId,
        wbExternalUserId: this.userInfo.wbExternalUserId
      }
      syncWechatTalk(data).then(res => {
        this.searchFn()
        this.asyncloading = false
      }).catch(() => {
        this.asyncloading = false
      })
    },
    timeChange(val) {
      if (!val) {
        const end = moment().format('YYYY-MM-DD')
        const start = moment().subtract(12, 'month').format('YYYY-MM-DD')
        this.search.time = [start, end]
        console.log(this.search.time)
      }
      this.getWechatTalkPage()
    },
    scrollBottom() {
      this.$refs.ScroollPane && this.$refs.ScroollPane.scrollBottom()
    },
    imgLoadSuccess() {},
    clear() {
      const end = moment().format('YYYY-MM-DD')
      const start = moment().subtract(12, 'month').format('YYYY-MM-DD')
      this.search = {
        message: '',
        time: [start, end]
      }
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.weChatConversation {
  height: calc(100vh - 280px);
  display: flex;
  flex-direction: column;
  .searchTop {

  }
  .chatList {
    flex: 1 0 0;
    // height: 630px;
    background: #F5F5F5;
    border-radius: 8px;
    border: 1px solid #F5F5F5;
    // padding: 16px;
    .noData {
      padding-top: 16px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 20px;

    }
  }
  .syncbtn {
    width: 152px;
  }
}
</style>
