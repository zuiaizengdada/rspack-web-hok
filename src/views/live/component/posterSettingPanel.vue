<template>
  <div class="posterSettingPanel">
    <div class="formItem">
      <slot />
    </div>
    <div v-if="setting && setting.showName" class="formItem">
      <slot name="userName" />
    </div>
    <div class="formItem">
      <div class="formLabel">文字大小</div>
      <div class="formValue">
        <span class="m-r-12">14</span>
        <el-slider v-model="form.fontSize" class="m-r-12" style="width: 180px" :min="14" :max="28" :step="1" />
        <span>28</span>
        <span class="m-l-10 cfontWeight" :style="{'font-weight': form.fontWeight, opacity: setting && setting.showFontWeight ? 1:0}" @click="onhandleClickFontWeight">加粗</span>
      </div>
    </div>
    <div class="formItem">
      <div class="formLabel">文字颜色</div>
      <div class="formValue">
        <el-color-picker v-model="form.color" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    setting: {
      type: Object,
      default: () => {
        return {
          showName: false,
          showFontWeight: true
        }
      }
    },
    value: {
      type: Object,
      default: () => {
        return {
          userName: '',
          opacity: 1,
          fontSize: 16,
          color: '#000',
          fontWeight: 'bold',
          position: { left: 0, bottom: 0 }
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {},
  methods: {
    onhandleClickFontWeight() {
      console.log(this.form.fontWeight)
      this.form.fontWeight = this.form.fontWeight === 'bold' ? '400' : 'bold'
    //   this.$set(this.form, 'fontWeight', this.form.fontWeight === 'bold' ? '400' : 'bold')
    }
  }
}
</script>

<style lang='scss' scoped>
.posterSettingPanel {
  border-radius: 4px;
  border: 1px solid #DCDFE5;
  padding: 16px 14px;
  .formItem {
    display: flex;
    align-items: center;
    .formLabel {
      color: #000;
      margin-right: 8px;
    }
    .formValue {
      flex: 1 0 0;
      display: flex;
      align-items: center;
      .cfontWeight {
        color: #0C6FFF;
        cursor: pointer;
      }
    }
  }
  .m-r-12 {
    margin-right: 12px;
  }
  .formItem + .formItem {
    margin-top: 12px;
  }
}
::v-deep {
  .el-form-item--small.el-form-item {
    margin-bottom: 14px;
  }
  .el-form-item__label {
    color: #000000;
    text-align: right;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-style: normal;
    font-weight: bolder;
    line-height: 14px;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0 0 16px 0;
  }
}
</style>
