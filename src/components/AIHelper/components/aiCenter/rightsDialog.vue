<template>
  <div v-if="config.visible" class="modal-bg">
    <AppDialog
      v-model="config.visible"
      title="权限设置"
      :append-to-body="false"
      custom-class="amap-sug-result"
      width="360px"
      :loading="loading"
      height="auto"
      :top="top"
      @success="sure"
    >
      <div v-loading="loading" class="rightsDialog">
        <div class="rightsList">
          <div class="rightsItem" :class="{active: active === 1}" @click="active = 1">
            <img v-if="active !== 1" class="rightsItemIcon" src="@/assets/image/aigc/lock.png">
            <img v-if="active === 1" class="rightsItemIcon" src="@/assets/image/aigc/lock_c.png">
            <div>私密·仅自己可对话</div>
            <img v-if="active === 1" class="checkIcon" src="@/assets/image/aigc/check.png">
          </div>
          <div class="rightsItem" :class="{active: active === 2}" @click="active = 2">
            <img v-if="active !== 2" class="rightsItemIcon" src="@/assets/image/aigc/global.png">
            <img v-if="active === 2" class="rightsItemIcon" src="@/assets/image/aigc/global_c.png">
            <div>公开·所有人可对话</div>
            <img v-if="active === 2" class="checkIcon" src="@/assets/image/aigc/check.png">
          </div>

          <el-button :loading="loading" type="primary" style="margin-top: 24px;width: 100%;" @click="sure">确定</el-button>
        </div>
      </div>
      <div slot="footer" />
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { editAssistantPrivate } from '@/api/aigc/index.js'
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
    }
  },
  data() {
    return {
      loading: false,
      top: '114px',
      active: 1
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.active = this.config.row.isPrivate ? 1 : 2
      }
    }
  },
  mounted() {
    this.top = Math.abs(document.body.clientHeight - 541) / 2 + 'px'
  },
  methods: {
    sure() {
      this.loading = true
      const data = {
        isPrivate: this.active === 1,
        templateId: this.config.row.templateId
      }
      editAssistantPrivate(data).then(res => {
        this.loading = false
        this.config.success && this.config.success(this.active === 1)
      }).catch(() => {
        this.loading = false
      })
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
.rightsDialog {
  padding: 24px 20px 20px;
  .rightsList {
    .rightsItem {
      position: relative;
      display: flex;
      align-items: center;
      width: 320px;
      height: 58px;
      font-weight: 400;
      border-radius: 6px;
      border: 1px solid #D3D7D8;
      cursor: pointer;
      .rightsItemIcon {
        width: 24px;
        height: 24px;
        margin-left: 20px;
        margin-right: 8px;
      }
      .checkIcon {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 20px;
        top: 20px;
      }
      &:hover {
        background: #E8EBEE;
        border: 1px solid #D3D7D8;
      }
    }
    .active {
      color: #5696FF;
      font-weight: 500;
      background: #DEE9FE!important;
      border: 1px solid #DEE9FE!important;
    }
    .disabled {
      background: #EFEFEF;
      cursor: not-allowed;
      color: #999999;
    }
    .rightsItem + .rightsItem{
      margin-top: 16px;
    }
  }
}
::v-deep {
  .dialog-body .ss-material-box-header {
    border-bottom: 1px solid #fff;
  }
}
</style>
