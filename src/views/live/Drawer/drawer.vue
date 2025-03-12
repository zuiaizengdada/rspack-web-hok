<template>
  <el-drawer
    :visible.sync="newValue"
    direction="rtl"
    :with-header="false"
    :size="width"
    @close="$emit('beforeClose')"
  >
    <div class="hok-drawer">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">
          {{ title }}
          <slot name="title" />
        </div>
        <i class="el-icon-close close" @click="close()" />
      </div>

      <div class="dialog-body-content">
        <slot />
      </div>

      <slot name="footer">
        <div class="ss-material-box-bottom">
          <el-button v-if="btnFooter" size="small" :loading="loading" type="primary" @click="succese()">{{ footerText[0] }}</el-button>
          <el-button v-if="btnFooter" size="small" :loading="loading" @click="close()">{{ footerText[1] }}</el-button>
        </div>
      </slot>
    </div>
  </el-drawer>
</template>
<script>
export default {
  components: {},
  props: {
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
      default: '368px'
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
  mounted() {},
  methods: {
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

<style lang='scss' scoped>
.hok-drawer {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
  position: relative;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
        .ss-material-box-header-title {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
    .close {
      color: #b2b2b2;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .dialog-body-content {
        flex: 1 0 0;
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
      border-top: 1px solid #f2f2f2;
      // background-color: #fafbfc;
      border-radius: 2px 2px 0 0;
    }
}
</style>
