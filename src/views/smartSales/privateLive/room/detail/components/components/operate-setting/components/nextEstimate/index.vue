<template>
  <!-- 下一场直播预告 -->
  <div class="next-estimate-wrapper">
    <div class="flex flex-middle">
      <span class="label">下一场直播预告</span>
      <el-button type="primary" size="small" @click="showAddLiveRoomDialog">
        选择直播间
      </el-button>
    </div>
    <div v-if="form.liveRoomTrailers.length > 0" class="labelLiveRoomList">
      <el-tag
        v-for="(item, index) in form.liveRoomTrailers"
        :key="index"
        class="m-r-16 labelLiveRoomList-item"
        size="small"
        closable
        @close="delLiveRoomLabel(item, index)"
      >
        {{ item.name }}
        <span>{{ renderTearch(item.realityTeacherUserName) }}</span>
        <span> {{ moment(item.startTime).format('YYYY-MM-DD HH:mm') }}</span>
      </el-tag>
    </div>
    <addLiveRoomDialog
      :config="addLiveRoomDialogConfig"
      @select="handleLiveRoomSelect"
    />
  </div>
</template>

<script>
import addLiveRoomDialog from '../../../enroll-setting/addLiveRoomDialog.vue'
import { nextLivePreview } from '@/api/liveRoom/detail'
import { applyConfigDetailAjax } from '@/api/liveRoom/register'
import moment from 'moment'
export default {
  components: { addLiveRoomDialog },
  data() {
    return {
      moment,
      addLiveRoomDialogConfig: {
        visible: false,
        title: '选择直播间',
        liveRoomId: '',
        chooseList: []
      },
      form: {
        liveRoomTrailers: []
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    renderTearch(arr) {
      if (!arr) {
        return ''
      }
      const value = arr.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next}`)
        return pre
      }, '')
      return value
    },
    getInfo() {
      const liveRoomId = this.$route.params.id
      applyConfigDetailAjax({ liveRoomId }).then(res => {
        this.form.liveRoomTrailers = res.data.liveRoomTrailers
      })
    },
    // 删除选择的直播间
    delLiveRoomLabel(item, index) {
      this.form.liveRoomTrailers.splice(index, 1)
      this.setNextRoom()
    },
    // 选择的直播间
    handleLiveRoomSelect(val) {
      console.log(val)
      val.forEach(item => {
        item.liveRoomId = item.id
      })
      this.form.liveRoomTrailers.push(...val)
      this.setNextRoom()
    },
    setNextRoom() {
      nextLivePreview({
        liveRoomId: this.$route.params.id,
        liveRoomTrailers: this.form.liveRoomTrailers.map(m => m.liveRoomId)
      }).then(() => {
        this.$message.success('操作成功')
      })
    },
    // 显示选择直播间dialog
    showAddLiveRoomDialog() {
      this.addLiveRoomDialogConfig.visible = true
      this.addLiveRoomDialogConfig.chooseList = this.form.liveRoomTrailers
      this.addLiveRoomDialogConfig.liveRoomId = this.$route.params.id
    }
  }
}
</script>

<style lang="scss" scoped>
.next-estimate-wrapper {
  margin: 20px 0;
  .label {
    margin-right: 10px;
    font-size: 14px;
    color: #999999;
  }
  .labelLiveRoomList {
    margin-top: 16px;
    width: 448px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e1e6ed;
    padding: 16px 16px 0 16px;
    display: flex;
    flex-direction: column;
    .labelLiveRoomList-item {
      margin-bottom: 16px;
      width: max-content;
    }
  }
}
</style>
