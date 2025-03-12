<template>
  <div v-if="config.visible" class="modal-bg">
    <AppDialog
      v-model="config.visible"
      title="助手发布"
      width="360px"
      :append-to-body="false"
      custom-class="amap-sug-result"
      :loading="loading"
      height="auto"
      :top="top"
      @success="sure"
    >
      <div v-loading="loading" class="publicDialog">
        <div v-if="config.visible" class="aiDetail">
          <div v-if="config.row.icon" class="ailist_view_img">
            <img v-if="config.row.type === 1" src="@/assets/image/aigc/my_icon.png" alt="">
            <template v-else>
              <img v-if="!!config.row.icon" :src="config.row.icon" alt="">
              <div v-else class="title-span" :style="{ background: config.row.backgroundColor }">
                <span :style="{ color: config.row.textColor }">{{ config.row.title.split('')[0] }}</span>
              </div>
            </template>
          </div>
          <div class="ailist_detail">
            <div class="ailist_detail_title">{{ config.row.title }}</div>
            <div class="ailist_detail_describe">{{ config.row.describe }}</div>
          </div>
        </div>
      </div>
      <div slot="footer" class="ss-material-box-bottom">
        <el-button size="small" :loading="loading" @click="close()">取消</el-button>
        <el-button size="small" :loading="loading" type="primary" @click="sure">确定发布</el-button>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          row: {},
          success: () => {}
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      top: '114px',
      active: 1
    }
  },
  mounted() {
    this.top = Math.abs(document.body.clientHeight - 541) / 2 + 'px'
  },
  methods: {
    sure() {
      if (this.config.success) {
        this.config.success()
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang='scss' scoped>
.modal-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 999999999999999999;
  background-color: rgba($color: #000000, $alpha: 0.3);
}
.publicDialog {
  padding: 14px 20px 22px;
  .aiDetail {
    display: flex;
    .ailist_view_img {
      width: 58px;
      min-width: 58px;
      max-width: 58px;
      >img {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        object-fit: fill;
      }
      span {
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #313233;
      }
      >.title-span {
        width: 58px;
        min-width: 58px;
        height: 58px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .ailist_detail {
      // width: 257px;
      // max-height: 200px;
      overflow: auto;
      margin-left: 8px;
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #D8D8D8;
        transition: all 0.4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      .ailist_detail_title {
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: bolder;
        color: #333333;
        line-height: 22px;
      }
      .ailist_detail_describe {
        margin-top: 6px;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #595959;
        line-height: 17px;
      }
    }
  }
}
.ss-material-box-bottom {
  display: flex;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  // background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
::v-deep {
  .ss-material-box-header {
    border-bottom: 1px solid #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
