<template>
  <div v-if="visible" class="modal">
    <div class="modal-bg" />
    <div class="modal-content" :style="{ width: width }">
      <div class="close" @click="cancel">
        <div>
          <i class="el-icon-close" />
        </div>
      </div>
      <div class="modal-content-container">
        <!-- <img  src="@/assets/image/delete.png" alt=""> -->
        <svg-icon
          :class="iconClassName"
          class="modal-content-img"
          :icon-class="iconClass"
          size="28"
          style="stroke: currentColor"
        />
        <div class="modal-content-right">
          <div class="delete-tips overflowOuto" v-html="tips" />
        </div>
      </div>
      <template v-if="!noBtn">
        <div v-if="!noCancelBtn" class="modal-content-btn">
          <div
            :style="{ background: sureBtnBgColor }"
            class="btn comfirm"
            @click="sure"
          >
            <!--确定-->{{ sureBtnText }}
          </div>
          <div
            :style="{ background: cancelBtnBgColor }"
            class="btn cancel"
            @click="cancel"
          >
            <!--取消-->{{ cancelBtnText }}
          </div>
        </div>
        <div v-else class="modal-content-btn2">
          <div
            :style="{ background: sureBtnBgColor, ...sureBtnStyle }"
            class="btn comfirm"
            @click="sure"
          >
            {{ sureBtnText }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MyModal',
  data() {
    return {
      width: '390px',
      visible: false,
      sureBtnText: '确认',
      sureBtnBgColor: '#F53F3F',
      cancelBtnText: '取消',
      cancelBtnBgColor: '#fff',
      noCancelBtn: false,
      iconClass: 'icon_zhuyi',
      iconClassName: 'c_F53F3F',
      sureBtnStyle: {},
      tips: '删除后内容将无法使用，且不可恢复，确认删除吗？',
      noBtn: false
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    sure() {
      this.visible = false
      if (this.success) {
        this.success()
      }
    },
    cancel() {
      this.visible = false
      if (this.fail) {
        this.fail()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.modal {
  z-index: 99999999;
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  &-bg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #000;
    opacity: 0.3;
    z-index: 8000;
  }
  &-content {
    // width: 390px;
    background: #ffffff;
    border-radius: 6px;
    padding: 32px 32px 22px;
    position: fixed;
    border-radius: 5px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 8001;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    &-container {
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 28px;
    }
    &-img {
      width: 28px;
      height: 28px;
      margin-right: 16px;
    }
    &-right {
      flex: 1 0 0;
    }
    &-tips {
      min-height: 44px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
    }
    &-btn {
      margin-top: 11px;
      display: flex;
      cursor: pointer;
    }
    &-btn2 {
      margin-top: 25px;
      cursor: pointer;
      // align-self: flex-end;
    }
  }
  .delete-tips {
    font-size: 14px;
    color: #333;
    line-height: 26px;
    max-height: 300px;
  }
  .btn {
    min-width: 68px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #ffffff;
    border-radius: 3px;
    padding: 0 20px;
    box-sizing: border-box;
    &:hover {
      opacity: 0.7;
    }
    &.comfirm {
      background-color: #f53f3f;
      color: #fff;
    }
    &.cancel {
      // margin-left: 10px;
      background-color: #fff;
      color: #161616;
      border: 1px solid #dcdfe6;
    }
  }
  .btn + .btn {
    margin-left: 10px;
  }
}
</style>
