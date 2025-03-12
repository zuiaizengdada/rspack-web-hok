<template>
  <div class="p1Content">
    <!-- 顶部筛选区域 -->
    <filterHeader :options="options" @searchBoxType="searchBoxType" @typeChange="typeChange" @keyWordChange="keyWordChange" @clearKeyword="clearKeyword" />
    <!-- 公共聊天室 -->
    <div>
      <groupList :item="AVliveRoomConversationList.length > 0 ? AVliveRoomConversationList[0] : null" @onClick="liveRoomClick(AVliveRoomConversationList.length > 0 ? AVliveRoomConversationList[0] : null)" />
    </div>

    <div class="chatBox overflowOuto">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-if="leftList.onlineTeachers.length > 0" :name="1">
          <template slot="title">
            <div class="collapseTitleSlot">
              <div class="collapseTitle">在线老师</div>
              <div class="collapseTitleRight">{{ leftList.onlineTeachers.length }}</div>
            </div>
          </template>
          <div>
            <tearchList v-for="(item, index) in leftList.onlineTeachers" :key="index" :item="item" />
          </div>
        </el-collapse-item>

        <el-collapse-item :name="2">
          <template slot="title">
            <div class="collapseTitleSlot">
              <div class="collapseTitle">
                我的学员
                <div v-if="myTraineesUnreadCount" class="badge">
                  {{ myTraineesUnreadCount > 99 ? '99+' : myTraineesUnreadCount }}
                </div>
              </div>
              <div class="collapseTitleRight">
                {{ leftList.onlineMyTrainees.length }}/{{ leftList.onlineMyTrainees.length + leftList.offMyTrainees.length }}
                <i class="el-icon-refresh" @click.stop="refresh" />
              </div>
            </div>
          </template>
          <div>
            <el-radio-group v-model="myTraineesRadio" class="traineesRadio" @change="myTraineesRadioChange">
              <el-radio :label="1">在线{{ leftList.onlineMyTrainees.length }}人</el-radio>
              <el-radio :label="2">离线{{ leftList.offMyTrainees.length }}人</el-radio>
            </el-radio-group>
            <DynamicScroller v-if="!ifSearch" key="Virtual" ref="Virtual" :items="myStudent" :min-item-size="100" class="detailContentDynamicScroller overflowOuto">
              <template v-slot="{item, index, active}">
                <DynamicScrollerItem :item="item" :active="active" :data-index="index">
                  <userList :key="index" :item="item" />
                </DynamicScrollerItem>
              </template>
            </DynamicScroller>
            <div v-if="myStudent.length === 0" class="leftnoData">
              暂无数据
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item :name="3">
          <template slot="title">
            <div class="collapseTitleSlot">
              <div class="collapseTitle">
                普通学员
                <div v-if="generalTraineesUnreadCount" class="badge">
                  {{ generalTraineesUnreadCount > 99 ? '99+' : generalTraineesUnreadCount }}
                </div>
              </div>
              <div class="collapseTitleRight">
                {{ getInLineLength }}/{{ getInLineLength + getOffLineLength }}
                <i class="el-icon-refresh" @click.stop="refresh" />
              </div>
            </div>
          </template>
          <div class="traineesRadio" style="border-bottom: 0px">
            <el-checkbox v-model="invitedStudentsCheck">仅查看邀约学员</el-checkbox>
          </div>
          <div>
            <el-radio-group v-model="traineesRadio" class="traineesRadio" @change="traineesRadioChange">
              <el-radio :label="1">在线{{ getInLineLength }}人</el-radio>
              <el-radio :label="2">离线{{ getOffLineLength }}人</el-radio>
            </el-radio-group>
            <DynamicScroller v-if="!ifSearch" key="normalmemberonlineVirtual" ref="normalmemberonlineVirtual" :items="traineesList" :min-item-size="100" class="detailContentDynamicScroller overflowOuto">
              <template v-slot="{item, index, active}">
                <DynamicScrollerItem :item="item" :active="active" :data-index="index">
                  <userList :key="index" :item="item" />
                </DynamicScrollerItem>
              </template>
            </DynamicScroller>
            <div v-if="traineesList.length === 0" class="leftnoData">
              暂无数据
            </div>
            <!-- <virtualList v-if="activeName === 3" ref="Virtual1" v-slot="{item}" height="calc(100vh - 350px)" id-name="generalTrainees" :list-data="leftList.generalTrainees" :estimated-item-size="68" style="width: 100%">
              <userList2 :key="item.memberId" :item="item" />
            </virtualList> -->
          </div>
        </el-collapse-item>
      </el-collapse>

      <transition name="slide">
        <div v-if="memberQueryType !== 1" v-loading="loading" class="searchBox">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item :name="4">
              <template slot="title">
                <div class="collapseTitleSlot">
                  <div class="collapseTitle">{{ memberQueryType | getOptionsValue(options) }}</div>
                  <div class="collapseTitleRight">{{ optionMember.length }}/{{ liveGroupDetail.currentOnlineCount }}</div>
                </div>
              </template>
              <div>
                <virtualList v-if="memberQueryType !== 1 && activeName === 4" ref="Virtual2" v-slot="{item}" height="calc(100vh - 300px)" id-name="searchBox" :list-data="optionMember" :estimated-item-size="68" style="width: 100%">
                  <userList :key="item.memberId" :item="item" @refresh="refreshSearch" />
                </virtualList>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </transition>

      <transition name="slide">
        <div v-if="ifSearch" v-loading="loading" class="searchBox2">
          <div>
            <virtualList v-if="ifSearch && searchMember.length > 0" ref="Virtual3" v-slot="{item}" height="calc(100vh - 300px)" id-name="searchBox2" :list-data="searchMember" :estimated-item-size="68" style="width: 100%">
              <userList :key="item.memberId" :item="item" @refresh="refreshSearch2" />
            </virtualList>
            <div v-if="searchMember.length === 0" class="noData">
              <img src="~@/assets/image/findTeacherNodata.png" alt="" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import groupList from './groupList.vue'
import filterHeader from './filterHeader.vue'
import userList from './userList.vue'
// import userList2 from './userList2.vue'
import tearchList from './tearchlist.vue'
import { getTraineeByName } from '@/api/liveRoom/im.js'
import { mapState } from 'vuex'
import virtualList from './virtualList'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
export default {
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    groupList,
    filterHeader,
    userList,
    tearchList,
    // userList2,
    virtualList
  },
  data() {
    return {
      options: [
        { value: 1, label: '全部用户' },
        { value: 2, label: '在线学员' },
        { value: 3, label: '已禁言学员' },
        { value: 4, label: '已标记学员' },
        { value: 5, label: '已备注学员' },
        { value: 6, label: '自嗨学员' },
        { value: 7, label: '黑名单' }
      ],
      optionMember: [],
      searchMember: [],
      loading: false,
      ifSearch: false,
      generalTraineesUnreadCount: 0, // 普通学员未读消息数量
      myTraineesUnreadCount: 0, // 我得学员未读消息总数
      myTraineesRadio: 1, // 我的学员在线离线状态
      traineesRadio: 1, // 普通学员在线离线状态
      searchText: '',
      invitedStudentsCheck: false,
      activeName: 2,
      timer: null
    }
  },
  computed: {
    ...mapState({
      AVliveRoomConversationList: state => state.im.AVliveRoomConversationList,
      conversationList: state => state.im.conversationList,
      leftList: state => state.im.leftList,
      liveRoomDetail: state => state.im.liveRoomDetail,
      liveGroupDetail: state => state.im.liveGroupDetail,
      memberQueryType: state => state.im.memberQueryType
    }),
    myStudent() {
      if (this.myTraineesRadio === 1) {
        return this.leftList.onlineMyTrainees
      } else {
        // 我的学员离线
        return this.leftList.offMyTrainees
      }
    },
    getInLineLength() {
      return this.invitedStudentsCheck ? this.leftList.onlineGeneralTrainees.filter(v => v.isV).length : this.leftList.onlineGeneralTrainees.length
    },
    getOffLineLength() {
      return this.invitedStudentsCheck ? this.leftList.offGeneralTrainees.filter(v => v.isV).length : this.leftList.offGeneralTrainees.length
    },
    traineesList() {
      if (this.traineesRadio === 1) {
        // 普通学员在线
        return this.invitedStudentsCheck ? this.leftList.onlineGeneralTrainees.filter(v => v.isV) : this.leftList.onlineGeneralTrainees
      } else {
        // 普通学员离线
        return this.invitedStudentsCheck ? this.leftList.offGeneralTrainees.filter(v => v.isV) : this.leftList.offGeneralTrainees
      }
    }
  },
  watch: {
    // 会话更新时触发
    'leftList': {
      handler(val) {
        console.log(val, 444)
        // 会话更新，统计未读消息数量
        this.generalTraineesUnreadCount = val.onlineGeneralTrainees.concat(val.offGeneralTrainees).reduce((pre, next) => {
          next.message && (pre += next.message.unreadCount)
          return pre
        }, 0)
        this.myTraineesUnreadCount = val.onlineMyTrainees.concat(val.offMyTrainees).reduce((pre, next) => {
          next.message && (pre += next.message.unreadCount)
          return pre
        }, 0)
      },
      immediate: true,
      deep: true
    },
    'memberQueryType': {
      handler(val) {
        console.log(val, '切换')
        if (val === 1) {
          this.timer && clearInterval(this.timer)
          this.timer = null
        } else {
          // this.typeChange(val)
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.typeChange(val)
          }, 10000)
        }
      }
    }
  },
  mounted() {},
  methods: {
    chatClick(item) {
      this.$emit('chatClick', item)
    },
    liveRoomClick(item) {
      if (Object.prototype.toString.call(item) === '[object Null]') {
        return
      }
      this.$emit('liveRoomClick', item)
    },
    systemClick(item) {
      this.$emit('systemClick', item)
    },
    // 刷新学员列表重新排序
    refresh(type) {
      // this.$store.dispatch('im/getLeftList', { groupId: this.liveGroupDetail.groupID, memberQueryType: 1 })
      this.$store.dispatch('im/getOnlineStudentList')
      this.$store.dispatch('im/getmymemberoffline')
      this.$store.dispatch('im/normalmemberoffline')
    },
    // 筛选栏切换触发
    typeChange(type) {
      this.$store.dispatch('im/getLeftList', { groupId: this.liveGroupDetail.groupID, memberQueryType: type }).then(res => {
        res.data.optionMember.map(item => {
          const obj = this.conversationList.find(v => {
            return v.toAccount === item.memberId
          })
          item['message'] = obj || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
          item['isVisitor'] = item.memberType === 4
        }).sort((a, b) => {
          return (a.message?.lastMessage?.lastTime || 0) - (b.message?.lastMessage?.lastTime || 0)
        })
        this.optionMember = res.data.optionMember
        // this.loading = false
      }).catch(() => {
        // this.loading = false
      })
    },
    keyWordChange(val) {
      console.log(val, '搜索')
      if (!val) {
        return this.$message.error('请输入关键词')
      }
      this.searchText = val
      this.searchMember = []
      this.ifSearch = true
      this.loading = true
      const params = {
        groupId: this.liveRoomDetail.groupId,
        nickName: val
      }
      getTraineeByName(params).then(res => {
        res.data.map(item => {
          const obj = this.conversationList.find(v => {
            return v.toAccount === item.memberId
          })
          item['message'] = obj || { toAccount: null, userProfile: {}, lastMessage: {}, conversationID: '', unreadCount: 0 }
        }).sort((a, b) => {
          return (a.message?.lastMessage?.lastTime || 0) - (b.message?.lastMessage?.lastTime || 0)
        })
        this.searchMember = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    clearKeyword() {
      this.searchMember = []
      // this.ifSearch = false
    },
    refreshSearch() {
      this.typeChange(this.memberQueryType)
    },
    refreshSearch2() {
      this.keyWordChange(this.searchText)
    },
    searchBoxType(val) {
      console.log(val)
      this.ifSearch = val
      this.searchMember = []
    },
    async myTraineesRadioChange(res) {
      if (res === 2) {
        this.normalmemberofflineLoading = true
        await this.$store.dispatch('im/getmymemberoffline')
        this.normalmemberofflineLoading = false
      }
    },
    async traineesRadioChange(res) {
      if (res === 2) {
        this.normalmemberofflineLoading = true
        await this.$store.dispatch('im/normalmemberoffline')
        this.normalmemberofflineLoading = false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.p1Content {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  user-select: none;
  .chatBox {
    background: #fff;
    flex: 1 0 0;
    position: relative;
    .searchBox {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background: #fff;
    }
    .searchBox2 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 11;
      background: #fff;
      .noData {
        display: flex;
        justify-content: center;
        > img {
          margin-top: 120px;
          width: 260px;
        }
      }
    }
  }
  .traineesRadio {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 23px;
    border-bottom: 1px solid #F0F0F0;
  }
}
.detailContentDynamicScroller {
  max-height: calc(100vh - 382px);
}
::v-deep {
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse-item__header {
    height: 50px;
  }
  .el-collapse {
    border-top: none;
    border-bottom:1px solid #F0F0F0;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
  .el-collapse-item__header {
    border-bottom: none;
  }
  .el-collapse-item__header{
    border-bottom:1px solid #F0F0F0;
    background: #FAFCFF!important;
  }
  .el-collapse-item__arrow {
    margin: 0 20px 0 auto;
  }
}
.collapseTitleSlot {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 24px;
  .collapseTitle {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    height: 42px;
    line-height: 42px;
  }
  .collapseTitleRight {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    height: 42px;
    line-height: 42px;
  }
  .badge {
    display: inline-block;
    background: #F53F3F;
    border-radius: 6px;
    color: #fff;
    font-size: 10px;
    font-family: PingFangSC-Semibold, PingFang SC;
    color: #FFFFFF;
    line-height: 14px;
    padding: 0 4px;
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
.leftnoData {
  padding: 40px 0;
  text-align: center;
  color: #999;
}
</style>
