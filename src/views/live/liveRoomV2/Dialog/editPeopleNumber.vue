<template>
  <AppDialog
    v-model="visible"
    title="加热直播间"
    width="602px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="editPeopleNumber overflowOuto">
      <div class="Viewform">
        <div class="fromLabel">动作</div>
        <el-radio-group v-model="action">
          <el-radio :label="1">加热</el-radio>
          <el-radio :label="2">恢复</el-radio>
        </el-radio-group>
      </div>
      <div class="Viewform">
        <div class="fromLabel">热度</div>
        <el-input v-model.trim="value" style="width: 130px;" @input="delNumber" />
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { adjustGroupOnline } from '@/api/liveRoom/im.js'
import { mapState } from 'vuex'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      loading: false,
      top: '114px',
      action: 1,
      value: ''
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 284) / 2 + 'px'
  },
  methods: {
    // 限制只能输入数字
    delNumber(e) {
      console.log(e, '123123')
      if (Number(e) > 10000) {
        this.value = 10000
        return
      }
      this.value = e.replace(/[^0-9]/g, '')
    },
    sure() {
      if (this.value === 0 || this.value === '0') {
        return this.$message.error('热度不能为0')
      }
      const params = {
        action: this.action,
        groupId: this.liveRoomDetail.groupId,
        num: Number(this.value)
      }
      adjustGroupOnline(params).then(res => {
        console.log(res)
        this.loading = false
        this.success && this.success()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.editPeopleNumber {
  height: 149px;
  padding: 20px;
  .Viewform {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .fromLabel {
      padding-right: 10px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
  }
}
</style>
