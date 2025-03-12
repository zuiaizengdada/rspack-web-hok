<template>
  <div>
    <el-button type="primary" @click="handleClickChooseLiveRoom">选择直播间</el-button>
    <div v-if="liveRoomTrailers.length > 0" class="labelLiveRoomList">
      <el-tag v-for="(item, index) in liveRoomTrailers" :key="index" class="m-r-16 labelLiveRoomList-item" closable size="mini" @close="delLiveRoomLabel(item, index)">
        {{ item.name }} <span>{{ renderTearch(item.realityTeacherUserName) }}</span>  <span> {{ moment(item.startTime).format('YYYY-MM-DD HH:mm') }}</span>
      </el-tag>
    </div>
    <add-live-room-dialog :config="addLiveRoomDialogConfig" @select="handleLiveRoomSelect" />
  </div>
</template>
<script>
import moment from 'moment'
import addLiveRoomDialog from './addLiveRoomDialog.vue'
export default {
  components: {
    addLiveRoomDialog
  },
  data() {
    return {
      liveRoomTrailers: [],
      addLiveRoomDialogConfig: {
        visible: false,
        title: '选择直播间',
        liveRoomId: '',
        chooseList: []
      }
    }
  },
  methods: {
    moment,
    handleClickChooseLiveRoom() {
      this.addLiveRoomDialogConfig.visible = true
      this.addLiveRoomDialogConfig.chooseList = this.liveRoomTrailers
      // this.addLiveRoomDialogConfig.liveRoomId = this.$route.params.id
    },
    // 选择的直播间
    handleLiveRoomSelect(val) {
      this.liveRoomTrailers.push(...val)
      const list = this.filterList()
      this.$emit('select', list)
    },
    // 删除选择的直播间
    delLiveRoomLabel(item, index) {
      this.liveRoomTrailers.splice(index, 1)
      const list = this.filterList()
      this.$emit('select', list)
    },
    filterList() {
      const list = []
      this.liveRoomTrailers.forEach(item => {
        list.push(item.id)
      })
      return list
    },
    renderTearch(arr) {
      if (!arr) {
        return ''
      }
      const value = arr.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next}`)
        return pre
      }, '')
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
  .labelLiveRoomList {
      margin-top: 16px;
      width: 448px;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px solid #E1E6ED;
      padding: 16px 16px 0 16px;
      display: flex;
      flex-direction: column;
      .labelLiveRoomList-item {
        margin-bottom: 16px;
        width: max-content;
      }
  }
</style>
