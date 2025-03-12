<template>
  <el-dialog
    ref="mydialog"
    v-el-drag-dialog="drag"
    :width="width"
    :title="title"
    :visible.sync="newValue"
    :append-to-body="appendToBody"
    :custom-class="customClass"
    :show-close="false"
    :close-on-click-modal="false"
    :press-escape="false"
    :modal="modal"
    :close-on-press-escape="closeOnPressEscape"
    :top="top"
    @open="open"
    @close="$emit('beforeClose')"
  >
    <div slot="title" class="ss-material-box-header">
      <div class="ss-material-box-header-title">
        {{ title }}
        <slot name="title" />
      </div>
      <i v-if="showClose" class="el-icon-close close" @click="close()" />
    </div>
    <div :style="{width: width, height: height}" class="dialog-body-content">
      <slot />
    </div>
    <slot name="footer">
      <div class="ss-material-box-bottom">
        <el-button v-if="btnFooter" size="small" :loading="loading" type="primary" @click="succese()">{{ footerText[0] }}</el-button>
        <el-button v-if="btnFooter" size="small" :loading="loading" @click="close()">{{ footerText[1] }}</el-button>
      </div>
    </slot>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  directives: {
    elDragDialog
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: 'custom-class'
    },
    modal: {
      type: Boolean,
      default: true
    },
    drag: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    width: {
      type: String,
      default: '900px'
    },
    height: {
      type: String,
      default: '600px'
    },
    top: {
      type: String,
      default: '15vh'
    },
    btnFooter: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: (done) => { done() }
    },
    loading: {
      type: Boolean,
      default: false
    },
    footerText: {
      type: Array,
      default: () => ['确 定', '取 消']
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
    }
  },
  computed: {
    newValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
  },
  methods: {
    open() {
      !this.modal && this.$refs.mydialog.$el.setAttribute('style', 'pointer-events:none')
    },
    close() {
      this.$emit('close')
      if (this.beforeClose) {
        this.beforeClose(this.done)
      } else {
        this.done()
      }
    },
    succese() {
      this.$emit('success')
    },
    done() {
      console.log('done')
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1020;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .dialog-body {
    position: relative;
    width: 900px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    border-radius: 10px;
  }
  .el-dialog__header {
    padding: 0;
    padding-bottom: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
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
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    // background: #fafbfc;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    // font-weight: 500;
    font-weight: bold;
    .ss-material-box-header-title {
      // max-width: 300px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .el-dialog {
    overflow: hidden;
    pointer-events: auto;
  }
}

</style>
