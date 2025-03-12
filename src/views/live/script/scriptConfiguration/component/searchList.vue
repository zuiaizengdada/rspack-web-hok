<template>
  <div class="searchPageWrap">
    <div class="searchTips">
      <div class="searchTipsText">
        <span class="m-r-10">搜索结果</span>
        <span class="mysearchtext">共{{ data.length }}条</span>
      </div>
      <div>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="onhandleAll"
        >全选</el-checkbox></div>
    </div>
    <div id="searchDetailContent" ref="searchDetailContent" class="searchDetailContent overflowOuto">
      <!-- <Virtual ref="searchVirtual" v-slot="{item, index}" id-name="scriptSearch" :list-data="data" :estimated-item-size="100">
        <list
          :id="`ScriptLiveRoomSearch_${item.scriptInteractId}`"
          :key="index"
          :item="item"
          @onEdit="$emit('onEdit', item)"
          @onListClick="$emit('onListClick', item)"
        />
      </Virtual> -->
      <DynamicScroller key="searchVirtual" ref="searchVirtual" :items="data" :min-item-size="100" class="detailContentDynamicScroller">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
// import Virtual from './virtualList/index.vue'
import list from './list.vue'
export default {
  components: {
    list,
    // Virtual,
    DynamicScroller,
    DynamicScrollerItem
  },
  data() {
    return {
      data: [],
      checkAll: false,
      isIndeterminate: false,
      loading: false,
      scrollTimer: null
    }
  },
  computed: {
    ...mapState({
      interactDetail: state => state.liveScript.interactDetail,
      ifSearch: state => state.liveScript.ifSearch,
      searchKey: state => state.liveScript.searchKey,
      multipleSelection: state => state.liveScript.multipleSelection,
      currentTime: state => state.liveScript.currentTime
    })
  },
  watch: {
    searchKey: {
      handler(val) {
        this.data = this.interactDetail.filter(v => {
          return v.eventType === 1 && (v.msgType === 3 || v.msgType === 1) && v.msgContent.includes(val)
        })
      },
      deep: true,
      immediate: true
    },
    interactDetail: {
      handler(val) {
        this.data = val.filter(v => {
          return v.eventType === 1 && (v.msgType === 3 || v.msgType === 1) && v.msgContent.includes(this.searchKey)
        })
      },
      deep: true,
      immediate: true
    },
    currentTime: {
      handler(val) {
        const obj = this.data.find(v => v.sendTime === val)
        if (obj) {
          this.$nextTick(() => {
            clearInterval(this.scrollTimer)
            // document.querySelector('#detailContent').scrollTop = document.querySelector(`#ScriptLiveRoom_${val}`).offsetTop - 203
            this.scrollTo(obj.scriptInteractId)
          })
        }
      },
      immediate: true,
      deep: true
    },
    multipleSelection: {
      handler(val) {
        if (val.length === 0) {
          this.checkAll = false
          this.isIndeterminate = false
        } else {
          this.checkAll = val.length === this.data.length
          this.isIndeterminate = val.length > 0 && val.length < this.data.length
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    console.log()
  },
  methods: {
    // 点击全选按钮
    onhandleAll() {
      const multipleSelection = []
      if (this.checkAll) {
        this.data.map(v => {
          multipleSelection.push(v.scriptInteractId)
        })
      }
      this.$store.commit('liveScript/set_multipleSelection', multipleSelection)
    },
    scrollTo(scriptInteractId) {
      const index = this.data.findIndex(v => v.scriptInteractId === scriptInteractId)
      console.log(index, 'index', this.$refs.searchVirtual)
      index > -1 && this.$refs.searchVirtual.scrollToItem(index)
    }
  }
}
</script>

<style lang='scss' scoped>
.searchPageWrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: #fff;
    .searchTips {
        margin-top: 20px;
        padding: 0 20px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .searchTipsText {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #333333;
            line-height: 22px;
            display: flex;
            align-items: center;
            .mysearchtext {
                font-size: 14px;
                font-weight: 400;
            }
        }
    }
    .searchDetailContent {
        height: calc(100% - 64px);
    }
}
</style>
