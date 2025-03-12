<template>
  <div class="onlineStudent">
    <filterTop
      :inviter-user-option="inviterUserOption"
      :search="search"
      @onGrounpClick="res => $emit('onGrounpClick', res)"
      @change="onSearchChange"
    />
    <div class="list-content">
      <liveLoading :visible="loading" />
      <div class="userList">
        <DynamicScroller
          key="normalmemberonlineVirtual"
          ref="normalmemberonlineVirtual"
          :items="traineesList"
          :min-item-size="51"
          class="detailContentDynamicScroller overflowOuto"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
            >
              <div
                v-if="index === traineesList.length - 1"
                :key="index"
                class="noMoreData"
              >
                <span>{{ item.text }}</span>
              </div>
              <userList v-else :key="index" :item="item" @refresh="refresh" />
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
        <div v-if="traineesList.length === 0 && !loading" class="leftnoData">
          <img src="~@/assets/image/liveRoom/empty_icon.png" alt="" />
          <span>——无搜索结果——</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liveLoading from '../components/loading/index.vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import filterTop from './filterTop.vue'
import userList from './userList.vue'
import { mapState } from 'vuex'
export default {
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    filterTop,
    liveLoading,
    userList
  },
  props: {
    memberQueryType: {
      type: [String, Number],
      default: 2
    },
    search: {
      type: Object,
      default: () => {
        return {
          name: '', // 用户昵称/备注名
          inviterUser: '',
          action: '',
          invitedStudentsCheck: true
        }
      }
    },
    inviterUserOption: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  computed: {
    ...mapState({
      AVliveRoomConversationList: state => state.im.AVliveRoomConversationList,
      conversationList: state => state.im.conversationList,
      leftList: state => state.im.leftList,
      liveRoomDetail: state => state.im.liveRoomDetail,
      liveGroupDetail: state => state.im.liveGroupDetail
    }),
    traineesList() {
      let arr = []
      // 普通学员离线
      if (this.search.invitedStudentsCheck) {
        arr = this.leftList.currentTrainees.filter(v => v.isV).concat(arr)
      } else {
        arr = this.leftList.currentTrainees.concat(arr)
      }
      if (arr.length > 0) {
        arr.push({ text: '——没有更多了——', id: new Date().getTime() })
      }
      return arr
    }
  },
  watch: {
    'liveRoomDetail.groupId': {
      handler(val) {
        this.onSearchChange()
      },
      deep: true,
      immediate: true
    },
    memberQueryType: {
      handler(val) {
        this.onSearchChange()
      },
      deep: true,
      immediate: true
    }
  },
  destroyed() {
    clearInterval(this.timer2)
    this.timer2 = null
  },
  mounted() {},
  methods: {
    refresh() {
      this.getList()
    },
    liveRoomClick(res) {
      this.$emit('onGrounpClick', res)
    },
    onSearchChange() {
      console.log('onSearchChange粗发了')
      // if (this.loading) return
      this.loading = true
      this.getList()
      clearInterval(this.timer2)
      this.timer2 = setInterval(() => {
        this.getList()
      }, 10000)
    },
    getList() {
      this.$store
        .dispatch('im/getLeftListV2', {
          groupId: this.liveRoomDetail.groupId,
          behavior: this.search.action,
          searchParam: this.search.name,
          inviter: this.search.inviterUser,
          memberQueryType: this.memberQueryType
        })
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.onlineStudent {
  // height: 760px;
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  position: relative;
  .list-content {
    flex: 1 0 0;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      width: 100%;
      height: 10px;
      box-shadow: 0 0 10px 0 #0000001a;
    }
    .userList {
      height: 100%;
      flex: 1 0 0;
      .detailContentDynamicScroller {
        max-height: 100%;
      }
    }
    .leftnoData {
      padding: 207px 0 0 0;
      text-align: center;
      color: #c2c6ce;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > img {
        width: 68px;
        height: 68px;
        margin-bottom: 20px;
      }
    }
  }
}
.noMoreData {
  height: 51px;
  text-align: center;
  position: relative;
  color: #c2c6ce;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 51px;
}
</style>
