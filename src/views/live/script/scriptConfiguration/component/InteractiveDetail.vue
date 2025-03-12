<template>
  <div class="InteractiveDetail">
    <div class="filterTop">
      <div class="search">
        <div>
          <span class="labelText">文字搜索</span>
          <el-input v-model.trim="search.name" class="w-200" size="small" clearable @clear="onhandleClear" @keyup.enter.native="onhandleSearch" />
          <el-button size="small" type="primary" class="m-l-10" @click="onhandleSearch">查询</el-button>
        </div>
        <div>
          <el-button :loading="loading" class="paramBtn btn_primary" size="small" @click="onhandleChangeTime">时间调整</el-button>
          <el-button :loading="loading" class="delBtn" size="small" @click="onhandleDel">删除</el-button>
        </div>
      </div>
      <div class="searchTips">
        <div class="searchTipsText">
          <span class="m-r-10">互动</span>
          <span style="font-size: 14px">共{{ data.length }}条</span>
        </div>
        <div>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="onhandleAll"
          >全选</el-checkbox></div>
      </div>
    </div>
    <div id="detailContent" ref="detailContent" class="detailContent overflowOuto">
      <DynamicScroller v-if="!ifSearch" key="Virtual" ref="Virtual" :items="data" :min-item-size="100" class="detailContentDynamicScroller">
        <template v-slot="{item, index, active}">
          <DynamicScrollerItem :item="item" :active="active" :data-index="index">
            <list
              :key="index"
              :item="item"
              @onEdit="$emit('onEdit', item)"
              @onListClick="$emit('onListClick', item)"
            />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
    <!-- <transition name="slide"> -->
    <div v-if="ifSearch" class="searchContent">
      <searchList ref="searchList" @onEdit="(item) => $emit('onEdit', item)" @onListClick="(item) =>$emit('onListClick', item)" />
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import list from './list.vue'
import searchList from './searchList.vue'
import { deleteInteract, deleteInteractAll } from '@/api/liveRoom/script'
import { mapState } from 'vuex'
import Dialog from '@/views/live/Dialog/index.js'
// import Virtual from './virtualList/index.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

export default {
  components: {
    list,
    // Virtual,
    DynamicScroller,
    DynamicScrollerItem,
    searchList
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      search: { name: '' },
      checkAll: false,
      isIndeterminate: false,
      loading: false,
      scrollTimer: null,
      startTop: 0,
      endTop: 0
    }
  },
  computed: {
    ...mapState({
      interactDetail: state => state.liveScript.interactDetail,
      multipleSelection: state => state.liveScript.multipleSelection,
      configurationIndex: state => state.liveScript.configurationIndex,
      currentTime: state => state.liveScript.currentTime,
      ifSearch: state => state.liveScript.ifSearch,
      timeListTime: state => state.liveScript.timeListTime
    })
  },
  watch: {
    multipleSelection: {
      handler(val) {
        if (val.length === 0) {
          this.checkAll = false
          this.isIndeterminate = false
        } else {
          this.checkAll = val.length === this.interactDetail.length
          this.isIndeterminate = val.length > 0 && val.length < this.interactDetail.length
        }
      },
      immediate: true,
      deep: true
    },
    currentTime: {
      handler(val) {
        const obj = this.interactDetail.find(v => v.sendTime === val)
        if (obj) {
          if (this.timeListTime === 1) {
            this.$store.commit('liveScript/set_timeListTime', null)
            return
          } else {
            this.$store.commit('liveScript/set_timeListTime', null)
          }
          this.$nextTick(() => {
            clearInterval(this.scrollTimer)
            this.scrollTo(obj.scriptInteractId)
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
    // 点击事件调整
    onhandleChangeTime() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选中数据')
      }
      if (this.multipleSelection.length > 100) {
        return this.$message.error('时间调整最大只能选择100条')
      }
      console.log(this.multipleSelection)
      Dialog.open({
        visible: false,
        type: 'ScriptAdjustTime',
        scriptInteractIds: this.multipleSelection,
        checkAll: this.checkAll,
        scriptId: this.$route.params.id,
        success: () => {
          Dialog.close()
          this.$store.dispatch('liveScript/init')
          return this.$store.dispatch('liveScript/getDetailList', this.$route.params.id).then(() => {
            console.log('加载完全')
            // this.listLoading = false
          })
        }
      })
    },
    // 点击删除
    onhandleDel() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选中数据')
      }
      this.$delModal({
        width: '300px',
        tips: `是否确认删除?`,
        success: () => {
          this.loading = true
          const apiFn = this.checkAll ? deleteInteractAll(this.$route.params.id) : deleteInteract(this.multipleSelection)
          apiFn.then(res => {
            this.$emit('onDel', this.multipleSelection)
            this.$notify.success({ title: '提示', message: '操作成功' })
            // this.$store.dispatch('liveScript/getDetailList', this.$route.params.id)
            if (this.checkAll) {
              // 全删
              this.$store.commit('liveScript/set_timeList', [])
              this.$store.commit('liveScript/set_interactDetail', [])
            } else {
              // 非全删
              this.multipleSelection.map(v => {
                this.$store.commit('liveScript/del_interactDetail', v)
              })
              const timeList = []
              this.interactDetail.map((v, i) => {
                !timeList.includes(v.sendTime) && timeList.push(v.sendTime)
                return
              }, [])
              this.$store.commit('liveScript/set_timeList', timeList)
            }
            this.$store.commit('liveScript/set_multipleSelection', [])
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 点击全选按钮
    onhandleAll() {
      // this.loading = true
      const multipleSelection = []
      if (this.checkAll) {
        this.interactDetail.map(v => {
          multipleSelection.push(v.scriptInteractId)
        })
      }
      this.$store.commit('liveScript/set_multipleSelection', multipleSelection)
      // this.loading = false
    },
    scrollTo(scriptInteractId) {
      const index = this.interactDetail.findIndex(v => v.scriptInteractId === scriptInteractId)
      // index > -1 && this.$refs.Virtual.scrollToItem(index)

      if (this.ifSearch) {
        this.$refs.searchList && this.$refs.searchList.scrollTo(scriptInteractId)
      } else {
        (index > -1 && this.$refs.Virtual) && this.$refs.Virtual.scrollToItem(index)
      }
    },
    // 查询
    onhandleSearch() {
      this.$store.commit('liveScript/set_multipleSelection', [])
      if (!this.search.name) {
        this.onhandleClear()
      } else {
        this.$store.commit('liveScript/set_ifSearch', true)
      }
      this.$store.commit('liveScript/set_searchKey', this.search.name)
    },
    // 清空
    onhandleClear() {
      this.$store.commit('liveScript/set_multipleSelection', [])
      this.$store.commit('liveScript/set_ifSearch', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.InteractiveDetail {
    height: 100%;
    position: relative;
    .filterTop {
        padding: 20px 20px 16px 20px;
        .search {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .labelText {
                margin-right: 8px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 22px;
            }
            .delBtn {
              // height: 32px;
              border: 1px solid #F98B8B;
              font-size: 14px;
              font-weight: 400;
              color: #F53F3F;
            }
            .paramBtn {
              border: 1px solid #0C6FFF;
              font-size: 14px;
              font-weight: 400;
              color: #FFFFFF;
              background-color: #0C6FFF;
            }
        }
        .searchTips {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .searchTipsText {
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
                line-height: 22px;
            }
        }
    }
    .detailContent {
      height: calc(100% - 115px);
      position: relative;
      .detailContentDynamicScroller {
        height: 100%;
      }
    }
    .searchContent {
      position: absolute;
      top: 56px;
      left: 0;
      bottom: 0;
      right: 0;
      height: calc(100% - 54px);
    }
}
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
