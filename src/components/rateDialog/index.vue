<template>
  <el-dialog
    width="602px"
    :title="dialogData.title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div class="dialog-container">
      <el-alert
        v-if="dialogData.warningTitle"
        :title="dialogData.warningTitle"
        type="warning"
        :closable="false"
        show-icon
      />
      <div class="progress-container">
        <el-progress
          type="circle"
          class="progress"
          :width="160"
          stroke-width="8"
          :percentage="plan"
          :format="format"
        />
        <div class="textCenter">
          <span>{{ plan }}%</span>
          <span>{{ dialogData.textCenter }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    query: {
      type: Function,
      default: () => {}
    },
    dialogData: {
      type: Object,
      default: () => ({
        title: '',
        warningTitle: '',
        textCenter: ''
      })
    }
  },
  data: () => ({
    plan: 0
  }),
  watch: {
    visible() {
      if (this.visible) {
        this.requery()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    format() {
      return ''
    },
    async requery() {
      try {
        const { code, data } = await this.query()
        if (code === 1) {
          this.plan = data.speed
          if (data.speed !== 100 && data.speed !== '100') {
            setTimeout(() => {
              if (this.visible) this.requery()
            }, 500)
          } else {
            this.$message.success({
              dangerouslyUseHTMLString: true,
              message: data.resultMsg
            })
            setTimeout(() => {
              this.$emit('handleOk')
              this.$emit('update:visible', false)
              this.plan = 0
            }, 500)
          }
        }
      } catch {
        console.log(55555)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-container::v-deep {
  display: flex;
  align-items: center;
  flex-direction: column;
  .progress {
    margin-top: 20px;
    margin-bottom: 20px;
    .el-progress__text {
      white-space: pre !important;
    }
  }
  .progress-container {
    margin-top: 20px;
    position: relative;
    .el-progress {
      border-radius: 50%;
      box-shadow: 0 0 3px 8px #f7f8ff;
    }
    > .textCenter {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      text-align: right;
      font-style: normal;
      > span:nth-of-type(1) {
        font-weight: 600;
        font-size: 36px;
        color: #333333;
        line-height: 50px;
        text-align: right;
        font-style: normal;
      }
    }
  }
}
</style>
