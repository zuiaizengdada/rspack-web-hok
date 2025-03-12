<template>
  <div v-if="addAccountFlag" class="add_account_page">
    <el-dialog
      width="695px"
      :visible.sync="addAccountFlag"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <p class="p-title">提示</p>
      </div>
      <div class="add-group-center">
        <div class="mess-content">
          <el-row class="mess-el-row">
            <span>应付金额：</span>
            <span>￥{{ amountPay }}</span>
          </el-row>
          <el-row class="mess-el-row" style="color: #ff4949; font-weight: bold;">
            <span>实付金额：</span>
            <span>￥{{ paidIn }}</span>
          </el-row>
        </div>
        <div class="tips-block">
          <i class="el-icon-warning" />
          <span>
            <p class="title">注意</p>
            <p>您输入的流水金额总计，大于订单应付金额，请确认商品数量是否选择过少，商品类型选择过少。如确认无问题，请点击确认。订单超出部分将记入用户的余额中。</p>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddAccount',
  components: {
  },
  props: {
    amountPay: {
      type: String,
      default: '0.00'
    },
    paidIn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addAccountFlag: false,
      ruleForm: {}
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    submit() {
      this.$emit('submit')
      this.addAccountFlag = false
    },
    show() {
      this.addAccountFlag = true
    },
    handleClose() {
      this.addAccountFlag = false
    }
  }
}
</script>

      <style scoped lang='scss'>
      .add_account_page {
          width: 100%;
          height: 100%;
          position: absolute;
          ::v-deep .el-dialog {
              border-radius: 10px;
          }
          ::v-deep .el-dialog__header {
              border-bottom: 1px solid #e7e7e7;
          }
          .p-title {
              font-size: 16px;
          }
          .plat_array_content {
              width: 100%;
              height: 280px;
              .plat_content {
                  float: left;
                  margin-right: 54px;
                  width: 64px;
                  height: 64px;
                  cursor: pointer;
                  img {
                      width: 64px;
                      height: 64px;
                  }
                  p {
                      font-size: 16px;
                      line-height: 30px;
                      height: 30px;
                      width: 100%;
                      text-align: center;
                      color: #333;
                      float: left;
                      margin-top: 5px;
                  }
              }
          }
      }
      .add-group-center {
        p {
          font-size: 14px;
          color: #777;
        }
        .demo-ruleForm {
            margin-top: 20px;
        }
        .w-300 {
            width: 230px;
        }
        .w-100 {
            width: 100px;
        }
      }
      .tips-span {
        margin-left: 10px;
        font-size: 12px;
        color: #0C6FFF;
      }
      .btn-cls {
        margin-left: 10px;
      }

      .tips-block {
        width: 100%;
        padding: 20px;
        background: #F7F8F9;
        border-radius: 8px;
        margin-bottom: 20px;
        i {
            float: left;
            font-size: 22px;
            margin-right: 15px;
            margin-top: 3px;
            color: #F18649;
        }
        span {
            width: 560px;
            display: inline-block;
            .title {
                font-size: 16px;
                margin-bottom: 8px;
            }
        }
    }

    .from-line-ban {
      width: 50%;
      float: left;
    }

    .posi-relative {
      position: relative
    }
    .add-group-center p.tips-reds {
      font-size: 12px;
      color: #ff4949;
      position: absolute;
      bottom: -25px;
    }

    .mess-el-row {
        margin-bottom: 15px;
        font-size: 18px;
    }
      </style>

