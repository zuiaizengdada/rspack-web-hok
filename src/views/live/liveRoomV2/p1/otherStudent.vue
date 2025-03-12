<template>
  <div class="otherStudent">
    <filterTop :inviter-user-option="inviterUserOption" :search="search" :show-more-seach="false" @onGrounpClick="(res) => $emit('onGrounpClick', res)" @change="onSearchChange" />
    <div class="list-content">
      <liveLoading :visible="loading" />
      <DynamicScroller key="normalmemberonlineVirtual" ref="normalmemberonlineVirtual" :items="traineesList" :min-item-size="51" class="detailContentDynamicScroller overflowOuto">
        <template v-slot="{item, index, active}">
          <DynamicScrollerItem :item="item" :active="active" :data-index="index">
            <div v-if="index === traineesList.length - 1" :key="index" class="noMoreData">
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
</template>

<script>
import filterTop from './filterTop.vue'
import liveLoading from '../components/loading/index.vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import userList from './userList.vue'
import { mapState } from 'vuex'
export default {
  components: {
    filterTop,
    DynamicScroller,
    DynamicScrollerItem,
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
      loading: false
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
      const arr = []
      if (this.leftList.currentTrainees.length > 0) {
        arr.push({ text: '——没有更多了——', id: new Date().getTime() })
      }
      return this.leftList.currentTrainees.concat(arr)
    }
  },
  watch: {
    'liveRoomDetail.groupId': {
      handler(val) {
        val && this.onSearchChange()
      },
      deep: true,
      immediate: true
    },
    'memberQueryType': {
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
      this.loading = true
      this.getList()
      clearInterval(this.timer2)
      this.timer2 = setInterval(() => {
        this.getList()
      }, 10000)
    },
    getList() {
      this.$store.dispatch('im/getLeftListV2', {
        groupId: this.liveRoomDetail.groupId,
        searchParam: this.search.name,
        memberQueryType: this.memberQueryType
      }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.otherStudent {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
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
      .detailContentDynamicScroller{
        max-height: 100%;
      }
    }
    .leftnoData {
      padding: 207px 0 0 0;
      text-align: center;
      color: #c2c6ce;
      font-family: "Microsoft YaHei";
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
.leftnoData {
  padding: 40px 0;
  text-align: center;
  color: #999;
}
.noMoreData {
  height: 51px;
  text-align: center;
  position: relative;
  color: #c2c6ce;
  font-family: "Microsoft YaHei";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 51px;
}
</style>
