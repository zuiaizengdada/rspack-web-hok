<template>
  <div class="headerTop">
    <div>{{ title }}</div>
    <div>
      <el-button size="small" class="btn_primary" @click="onclickSelectLoveRoomScript">选择直播间模板</el-button>
      <el-button size="small" class="btn_primary" @click="onclickChangeRobot">更换用户名</el-button>
      <el-button size="small" type="primary" @click="onclickExportScript">导入脚本</el-button>
      <el-button v-if="interactDetail.length > 0" size="small" type="primary" :loading="exportInteractLoading" @click="exportInteract">导出脚本</el-button>
    </div>
  </div>
</template>

<script>
import Dialog from '../../../Dialog/index'
import { exportInteract } from '@/api/liveRoom/script'
import { mapState } from 'vuex'
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      exportInteractLoading: false
    }
  },
  computed: {
    ...mapState({
      interactDetail: state => state.liveScript.interactDetail
    })
  },
  mounted() {},
  methods: {
    onclickChangeRobot() {
      Dialog.open({
        type: 'ChangeRobot',
        visible: true,
        scriptId: this.$route.params.id,
        success: () => {
          this.$emit('success')
          Dialog.close()
        }
      })
    },
    onclickExportScript() {
      Dialog.open({
        type: 'ExportScript',
        scriptId: this.$route.params.id,
        excelName: this.title,
        visible: true,
        success: () => {
          this.$emit('success')
        }
      })
    },
    // 点击导出脚本按钮
    exportInteract() {
      this.exportInteractLoading = true
      const params = {
        scriptId: this.$route.params.id
      }
      exportInteract(params).then(res => {
        var newWin = window.open('loading page', '_self')
        newWin.location.href = res.data // 成功 重定向到目标页面
        this.exportInteractLoading = false
      }).catch(() => {
        this.exportInteractLoading = false
      })
    },
    // 点击打开选择直播间脚本弹框
    onclickSelectLoveRoomScript() {
      Dialog.open({
        type: 'SelectLiveRoomScript',
        scriptId: this.$route.params.id,
        excelName: this.title,
        visible: true,
        success: () => {
          this.$emit('success')
          Dialog.close()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.headerTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 73px;
    min-height: 73px;
    background: #FFFFFF;
    padding: 0 20px;
}
</style>
