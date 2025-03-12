<template>
  <!-- 列表区域 -->
  <div class="p1 no-copy">
    <div class="ss-tabs-v2">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`在线(${optionMemberOnlineSum || 0})`" name="2" />
        <el-tab-pane :label="`离线(${optionMemberOfflineSum || 0})`" name="8" />
        <el-tab-pane label="已禁言" name="3" />
        <el-tab-pane label="自嗨" name="6" />
        <el-tab-pane label="黑名单" name="7" />
      </el-tabs>
      <onlineStudent v-if="activeName === '2'" :inviter-user-option="inviterUserOption" :search="search" :member-query-type="activeName" @onGrounpClick="res => $emit('onGrounpClick', res)" />
      <onlineStudent v-else-if="activeName === '8'" :inviter-user-option="inviterUserOption" :search="search" :member-query-type="activeName" @onGrounpClick="res => $emit('onGrounpClick', res)" />
      <otherStudent v-else :inviter-user-option="inviterUserOption" :search="search" :member-query-type="activeName" />
    </div>
  </div>
</template>

<script>
import onlineStudent from './onlineStudent.vue'
import otherStudent from './otherStudent.vue'
import { mapState, mapGetters } from 'vuex'
import { querytutor } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {
    onlineStudent,
    otherStudent
  },
  data() {
    return {
      timer2: null,
      loading: false,
      activeName: '2',
      inviterUserOption: [],
      search: {
        name: '', // 用户昵称/备注名
        inviterUser: '',
        action: '',
        invitedStudentsCheck: true
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      optionMemberOfflineSum: state => state.im.leftList.optionMemberOfflineSum,
      optionMemberOnlineSum: state => state.im.leftList.optionMemberOnlineSum
    })
  },
  mounted() {
    this.remoteMethod()
  },
  methods: {
    handleClick(res) {
      if (res.name === this.activeName) return
      this.$store.commit('im/SET_currentTrainees', [])
    },
    remoteMethod() {
      console.log('1111')
      this.loading = true
      const data = {
        liveRoomId: this.$route.params.id,
        pageIndex: 1,
        pageSize: 1000
      }
      querytutor(data).then((res) => {
        this.inviterUserOption = res.data.items
        if (this.inviterUserOption.length > 0) {
          console.log(this.userInfo, 'userInfo', this.inviterUserOption)
          const obj = this.inviterUserOption.find(v => v.teacherId === this.userInfo.userId)
          if (obj) {
            this.search.inviterUser = obj.teacherId
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.p1 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  position: relative;
  .ss-tabs-v2 {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
::v-deep {
  .el-tabs__nav-prev{
    left: 4px;
  }
  .el-tabs__nav-next{
    right: 4px;
  }
  .el-tabs__nav {
    display: flex;
    min-width: 100%;
  }
  .el-tabs__item {
    padding: 0 16px;
    flex: 1;
    height: 56px;
    line-height: 56px;
    text-align: center;
    font-weight: bolder;
    font-size: 16px;
  }
  .el-tabs--top .el-tabs__item.is-top:nth-child(2), .el-tabs--top .el-tabs__item.is-bottom:nth-child(2), .el-tabs--bottom .el-tabs__item.is-top:nth-child(2), .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2) {
    padding-left: 16px;
  }
  .el-tabs--top .el-tabs__item.is-top:last-child, .el-tabs--top .el-tabs__item.is-bottom:last-child, .el-tabs--bottom .el-tabs__item.is-top:last-child, .el-tabs--bottom .el-tabs__item.is-bottom:last-child {
    padding-right: 16px;
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #DCDEE1;
  }
  .el-tabs__nav-next, .el-tabs__nav-prev {
    line-height: 56px;
    height: 56px;
  }
  .el-tabs__active-bar {
    opacity: 0;
  }
  .el-tabs__item.is-active {
    color: #0C6FFF;
    position: relative;
    // border-bottom: 1px solid #0C6FFF;
    &::after {
      content: '';
      position: absolute;
      height: 2px;
      width: 42px;
      bottom: 0px;
      left: 50%;
      height: 2px;
      background-color: #0C6FFF;
      transform: translateX(-50%);
    }
  }
}
.no-copy {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
