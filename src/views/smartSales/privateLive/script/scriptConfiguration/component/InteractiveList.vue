<template>
  <div class="InteractiveList">
    <div v-if="interactDetail.length > 0" class="InteractiveListBox">
      <div class="InteractiveListContent">
        <div ref="timeList" class="timeList overflowOuto">
          <div
            v-for="(item, index) in timeList"
            :id="`timeList_${item}`"
            :key="item"
            class="timeListView"
            :class="{active: currentTime === item}"
            @click="onhandleClick(item, index)"
          >
            {{ item | renderTime }}
          </div>
        </div>
        <div class="configurationDetail">
          <InteractiveDetail
            ref="interactiveDetail"
            :data="interactDetail"
            :multiple-selection="multipleSelection"
            @onDel="(res) => $emit('onDel', res)"
            @onEdit="(res) => $emit('onEdit', res)"
            @onListClick="(res) => $emit('onListClick', res)"
          />
        </div>
      </div>
      <div class="InteractiveListFooter">
        <el-button size="small" class="btn_primary" @click="onhandleScriptPreview">预览</el-button>
        <el-button size="small" type="primary" @click="onhandleSuccess(false)">完成配置</el-button>
        <el-button size="small" type="primary" @click="onhandleSuccess(true)">完成配置并启用</el-button>
      </div>
    </div>
    <div v-else class="noData">
      <img src="~@/assets/image/scriptConfigurationNoData.png" alt="">
      <div class="noDataText m-t-20">互动详情为空</div>
    </div>
  </div>
</template>

<script>
import InteractiveDetail from './InteractiveDetail.vue'
import { getScriptInteractInfo } from '@/api/liveRoom/script'
import { mapState } from 'vuex'
import { editScriptStatus } from '@/api/liveRoom/script'
import moment from 'moment'
export default {
  components: {
    InteractiveDetail
  },
  filters: {
    renderTime(val) {
      return moment.utc(val * 1000).format('HH:mm:ss')
    }
  },
  data() {
    return {
      scrollTimer: null,
      active: 0 // 控制时间列表高亮
    }
  },
  computed: {
    ...mapState({
      timeList: state => state.liveScript.timeList,
      interactDetail: state => state.liveScript.interactDetail,
      multipleSelection: state => state.liveScript.multipleSelection,
      currentTime: state => state.liveScript.currentTime
    })
  },
  watch: {
    'currentTime': {
      handler(val) {
        // console.log(val, '播放时间改变触发')
        // this.active = this.timeList.findIndex(v => v === val)
        // const obj = this.interactDetail.find(v => v.sendTime === val)
        // console.log(obj)
        // if (obj) {
        //   this.$store.commit('liveScript/set_configurationIndex', obj.scriptInteractId)
        //   this.$emit('onEdit', obj)
        // }
        if (document.querySelector(`#timeList_${val}`) && this.$refs.timeList) {
          const endTop = document.querySelector(`#timeList_${val}`).offsetTop - 203
          const startTop = this.$refs.timeList.scrollTop
          this.timeListScrollTo(endTop, startTop)
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    onhandleClick(row, index) {
      console.log(row, index)
      const obj = this.interactDetail.find(v => v.sendTime === row)
      if (obj) {
        // this.$store.commit('liveScript/set_configurationIndex', obj.scriptInteractId)
        this.$emit('onListClick', obj)
        this.$store.commit('liveScript/set_timeListTime', 0)
      }
      // this.$emit('')
      // this.active = index
    },
    // 获取互动详情数据
    getList() {
      this.loading = true
      const data = {
        textMsg: '', // 文本消息模糊搜索
        scriptId: '' // 脚本ID
      }
      getScriptInteractInfo(data).then(res => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击跳转预览
    onhandleScriptPreview() {
      // this.$router.push(`/liveRoom/${row.id}`)
      const { href } = this.$router.resolve({
        path: `/live/scriptPreview/${this.$route.params.id}`
      })
      window.open(href, '_blank')
    },
    // 点击完成配置
    onhandleSuccess(val) {
      console.log('点击完成配置', val)
      if (!val) {
        this.$router.replace({ path: '/live/script' })
      } else {
        this.loading = true
        const data = {
          scriptId: this.$route.params.id,
          status: 1
        }
        editScriptStatus(data).then(res => {
          this.loading = false
          this.$router.replace({ path: '/live/script' })
        }).catch(() => {
          this.loading = false
        })
      }
    },
    scrollTo(scriptInteractId) {
      this.$refs.interactiveDetail && this.$refs.interactiveDetail.scrollTo(scriptInteractId)
    },
    timeListScrollTo(endTop, startTop) {
      clearInterval(this.scrollTimer)
      const a = Math.abs(endTop - startTop)
      const step = a / 10
      let time = 1 // 次数
      this.scrollTimer = setInterval(() => {
        const element = this.$refs.timeList
        endTop > startTop ? element.scrollTop += step : element.scrollTop -= step
        time = time + 1
        if (time === 10 || step < 10) {
          clearInterval(this.scrollTimer)
          element.scrollTop = endTop
        }
      }, 20)
    }
  }
}
</script>

<style lang='scss' scoped>
.InteractiveList {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  .noData {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > img {
      width: 600px;
      height: 352px;
    }
    .noDataText {
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 28px;
    }
  }
  .InteractiveListBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    .InteractiveListContent {
      // flex: 1 0 0;
      height: calc(100% - 64px);
      display: flex;
      .timeList {
        height: 100%;
        // height: calc(100% - 64px);
        width: 164px;
        display: flex;
        flex-direction: column;
        border-right:1px solid #EFF2F6;
        .timeListView {
          height: 56px;
          line-height: 56px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          text-align: center;
          cursor: pointer;
        }
        .active {
          color: #FFFFFF;
          background: #0C6FFF;
        }
      }
      .configurationDetail {
        flex: 1 0 0;
      }
    }
    .InteractiveListFooter {
      height: 64px;
      display: flex;
      padding: 0 20px;
      align-items: center;
      justify-content: flex-end;
      box-shadow: 0px -1px 10px 0px rgba(0,0,0,0.05);
      border-radius: 0px 0px 10px 10px;
    }
  }
}
</style>
