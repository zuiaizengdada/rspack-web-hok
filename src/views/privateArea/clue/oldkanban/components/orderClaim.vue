<template>
  <AppDialog v-model="visible" title="订单认领" width="916px" height="auto">
    <div class="model-conten">
      <div class="notice-box notice-top">
        <div class="notice-title">认领须知：</div>
        <div class="notice-info">1、认领的订单只作为任务中业绩核算，不做其他用途。</div>
        <div class="notice-info">2、已经明确有招生老师的与业绩归属人员不一致的不能认领。</div>
        <div class="notice-info">3、订单已经在任务中的不能再认领。</div>
      </div>
      <div class="list-box flex">
        <div class="list-title">业绩归属：</div>
        <el-button
          v-if="!assessUsers.length"
          type="primary"
          size="mini"
          @click="selectUser"
        >选择人员</el-button>
        <div v-else>
          <el-tag
            closable
            @close="delAssessUsers"
          >{{ userName }}</el-tag>
        </div>
      </div>
      <div class="list-box">
        <div class="list-title">订单查询：</div>
        <div class="list-info">
          <div class="info-search">
            <el-input v-model="form.value" placeholder="请输入内容" class="model-with-input" clearable>
              <el-select slot="prepend" v-model="form.label" placeholder="请选择" class="model-with-select">
                <el-option
                  v-for="item in optionsAccurate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-input>
            <!-- <el-button v-permission="['system:order:findOrderNo', permsList]" type="primary" size="small" @click="onClickReceiveModelSearch">查询</el-button> -->
            <el-button type="primary" size="small" @click="onClickReceiveModelSearch">查询</el-button>
            <el-button size="small" @click="onClickReceiveModelReset">重置</el-button>
          </div>
          <div class="info-item">
            <order-list
              ref="orderList"
              :show-border="true"
              :operation-column="false"
              :operation="false"
              :see-detail-model="false"
            />
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <div class="footer-box">
        <el-button type="primary" size="small" @click="onClickReceiveModelOk">认领</el-button>
        <el-button size="small" @click="onClickReceiveModel">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import OrderList from '@/views/business/orderManage/components/orderList/index'
import {
  addClueByManuallyOrder
} from '@/api/business'
export default {
  name: 'OrderClaim',
  components: {
    AppDialog,
    OrderList
  },
  data() {
    return {
      form: { label: 'orderNo', value: '' },
      optionsAccurate: [
        { label: '获客订单号', value: 'orderNo' },
        { label: '第三方订单号', value: 'transactionId' }
      ],
      visible: false,
      assessUsers: [],
      userName: ''
    }
  },
  methods: {
    open() {
      this.visible = true
      this.delAssessUsers()
    },
    // 认领搜索
    onClickReceiveModelSearch() {
      const label = this.form.label
      const value = this.form.value
      const params = {
        [label]: value,
        type: 2 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }
      this.$refs.orderList.searchPrecisen(params)
    },
    // 认领重置
    onClickReceiveModelReset() {
      this.form = { label: 'orderNo', value: '' }
      const params = {
        orderNo: '-',
        type: 2 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }
      this.$refs.orderList.searchPrecisen(params)
    },
    // 订单认领
    onClickReceiveModel() {
      this.visible = false
    },
    async onClickReceiveModelOk() {
      if (!this.form.value) {
        this.$message.error('没有可认领的关联订单')
      } else {
        if (!this.assessUsers.length) {
          this.$message.error('请选择人员')
          return
        }
        const params = {
          'orderNo': this.form.value,
          'sysUserId': this.assessUsers[0].userId,
          'taskId': this.$route.query.taskId
        }
        const adoptData = await addClueByManuallyOrder(params)
        if (adoptData.code === 1) {
          this.$message({
            message: '认领成功',
            type: 'success'
          })
          this.onClickReceiveModel()
          this.onClickReceiveModelReset()
        }
      }
    },
    delAssessUsers() {
      this.assessUsers = []
      this.userName = ''
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        checkUser: this.assessUsers,
        success: async (res) => {
          res.user.forEach((v) => {
            v.userName = v.nickName
          })
          this.assessUsers = res.user
          this.userName = res.user[0].userName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.commerce.el-select ::v-deep{
  .el-input.is-focus .el-input__inner{
    border-color:#DCDFE6 !important
  }
}
.search-box {
  width: 100%;
  // display: flex;
  position: relative;
  .search-main {
      .input-with-select {
          width: 108px;
          height: 32px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          border-radius: 3px 0px 0px 3px;
      }
      .input-with-select-chang {
          ::v-deep  .el-input__inner {
              border: none;
              border-radius: 3px 0px 0px 3px;
              border: 1px solid #D8DCE6;
              border-right: none;
          }
      }
      .input-with-input {
          width: 308px;
      }
      .input-with-time {
          width: 228px;
          border: none;
          border-radius: 0px 3px 3px 0px;
          border: 1px solid #D8DCE6;
      }
      .order-time-box {
          display: flex;
      }
      .select-width-200 {
          width: 200px;
      }
      .common-width {
          width: 308px;
          .folower-btn {
              width: 200px;
          }
          .price-in {
              width: 92px;
          }
      }
      .common-w336 {
        width: 336px;
      }
  }
  .search-control {
      display: flex;
      margin: 0 20px;
      padding-bottom: 16px;
      justify-content: space-between;
      border-bottom: 1px solid #E7E7E7;
      margin-bottom: 15px;
      .search-control-l {
          margin-left: 10px;
          .more-box {
              margin-left: 26px;
          }
      }
      .search-control-r {
        margin-right: 10px;
      }
      .control-btn-primary {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #FFFFFF;
      }
      .control-btn {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #161616;
      }
  }
  .approval-control {
      background: #F3F3F3;
      border-radius: 4px;
      padding: 2px;
      margin: 15px 30px;
      display: inline-block;
      .approval-list {
          display: flex;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
          supported by Chrome, Edge, Opera and Firefox */
          .approval-child {
              width: 88px;
              height: 32px;
              line-height: 32px;
              background: #F3F3F3;
              border-radius: 2px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              text-align: center;
              cursor: pointer;
          }
          .approval-active {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #0C6FFF;
              background: #FFFFFF;
          }
      }

  }
}
.filter-module {
  padding: 16px 16px 0 16px;
  width: 100%;
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
.model-conten {
  .notice-box {
      padding: 16px 20px 0 20px;
      .notice-title {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
          margin-bottom: 8px;
      }
      .notice-info {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
      }
  }
  .notice-top {
      margin-top: 4px;
  }
  .list-box {
      padding: 16px 20px;
      .list-title {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
      }
      .list-info {
          .info-search {
          margin-top: 8px;
          .model-with-input {
              width: 426px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              margin-right: 8px;
          }
          .model-with-select {
              width: 130px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              height: 10px;
          }
          }
          .info-item {
            margin-top: 10px;
            height: 186px;
            overflow-x: auto;
          // overflow: scroll;
          }
          .info-pop {
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #F53F3F;
          .icon-svg {
              margin: 16px 8px 0 0;
          }
          }
          .info-pop-pass {
          color: #00B42A;
          }
      }
  }
}
.footer-box {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
.w-200 {
  width: 200px;
}
::v-deep .el-input-group__prepend {
  background-color: #FFFFFF;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  // color: #333333;
}
::v-deep .el-input__inner{
  height: 32px;
}
::v-deep .ss-material-box-header-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
::v-deep ::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 0;
}
::v-deep ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}
::v-deep :hover ::-webkit-scrollbar-track-piece {
  cursor: pointer;
  background: #ededed;
  border-radius: 0;
}

::v-deep :hover::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}

::v-deep :hover::-webkit-scrollbar-thumb:vertical {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}
</style>
