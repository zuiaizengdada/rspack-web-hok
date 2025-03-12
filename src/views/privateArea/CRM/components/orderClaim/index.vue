<template>
  <div>
    <AppDialog v-model="visible" title="订单认领" width="916px" height="auto">
      <div class="model-conten">
        <div class="notice-box notice-top">
          <div class="notice-title">认领须知：</div>
          <div class="notice-info">
            1、认领的订单只作为任务中业绩核算，不做其他用途。
          </div>
          <div class="notice-info">
            2、已经明确有招生老师的与业绩归属人员不一致的不能认领。
          </div>
          <div class="notice-info">3、订单已经在任务中的不能再认领。</div>
        </div>
        <el-form
          ref="ValidateForm"
          :model="form"
          label-width="100px"
          class="demo-dynamic"
          :inline="true"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                prop="sysUserId"
                label="业绩归属人:"
                :rules="[
                  {
                    required: true,
                    message: '请先择业绩归属人',
                    trigger: 'blur'
                  }
                ]"
              >
                <m-select
                  v-model="form.sysUserId"
                  style="max-width: 180px"
                  :dict-list="sysUserList"
                  :param="{ value: 'sysUserId', label: 'userName' }"
                >
                  <template slot-scope="{item}">
                    <div class="selectItem">
                      <span>{{ item.userName }}</span>
                      <span>{{ item.phone }}</span>
                    </div>
                  </template>
                </m-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item
                prop="orderNo"
                label="订单查询:"
                :rules="[
                  { required: true, message: '请输入订单号', trigger: 'blur' }
                ]"
              >
                <el-input
                  v-model="form.orderNo"
                  style="width: 180px"
                  placeholder="请输入内容"
                  class="model-with-input"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="info-search">
                <el-button
                  type="primary"
                  size="small"
                  @click="onClickReceiveModelSearch"
                >查询</el-button>
                <el-button
                  size="small"
                  @click="onClickReceiveModelReset"
                >重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <dynamicTable
          ref="table"
          v-model="tableData"
          class="tableWarp"
          :columns="columns"
          :get-list-api="getList"
          :checkbox="checkbox"
          :immediate-check="true"
          row-key="id"
          @selectionChange="handleSelectionChange"
        >
          <template slot="orderStatus" slot-scope="{ row }">
            <div>
              {{ $getdictName('ORDERSTATUS_OPTIONS', row.orderStatus) }}
            </div>
          </template>
        </dynamicTable>
      </div>
      <div slot="footer">
        <div class="footer-box">
          <el-button
            type="primary"
            size="small"
            @click="onClickReceiveModelOk"
          >认领</el-button>
          <el-button size="small" @click="onClickReceiveModel">取消</el-button>
        </div>
      </div>
    </AppDialog>
    <InviteClass :drawer.sync="drawer" />
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import dynamicTable from '@/components/DynamicTable/table'
import InviteClass from './InviteClass'
import {
  getCustomerSelectList,
  getCustomerselectPage,
  saleCustomerConfirm
} from '@/api/privateArea/CRM'
export default {
  name: 'OrderClaim',
  components: {
    AppDialog,
    InviteClass,
    dynamicTable
  },
  data() {
    return {
      data: {},
      tableData: [],
      checkbox: true,
      multipleSelection: [],
      drawer: false,
      sysUserList: [],
      columns: [
        { prop: 'orderNo', label: '订单号', type: 'text', width: '180' },
        { prop: 'goodsNames', label: '课程名称', type: 'text', width: '180' },
        {
          prop: 'balanceFee',
          label: '订单余额',
          type: 'text',
          slotFn: row => (row.balanceFee / 100).toFixed(2)
        },
        { prop: 'localPayTime', label: '支付时间', type: 'text', width: '180' },
        { prop: 'orderStatus', label: '支付状态', type: 'slot' }
      ],
      form: { orderNo: '', sysUserId: '' },
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getList(params) {
      return getCustomerselectPage({
        current: params.pageIndex,
        size: params.pageSize,
        orderNo: this.form.orderNo,
        sysUserId: this.form.sysUserId,
        taskId: this.data.id
      }).then(res => {
        return res
      })
    },
    async getCustomerSelectList(id) {
      const { data } = await getCustomerSelectList(id)
      this.sysUserList = data || []
    },
    open(data) {
      this.form = { orderNo: '', sysUserId: '' }
      this.data = data
      this.multipleSelection = []
      this.tableData = []
      this.visible = true
      this.$nextTick(() => {
        this.$refs.table.toggleSelection()
      })
      this.getCustomerSelectList(this.data.id)
    },
    refReshList() {
      this.$nextTick(() => {
        this.$refs.table.config.pageIndex = 1
        this.$refs.table.onRefresh()
      })
    },
    // 认领搜索
    async onClickReceiveModelSearch() {
      this.$nextTick(() => {
        this.$refs.table.toggleSelection()
        this.multipleSelection = []
      })
      await this.$refs.ValidateForm.validate()
      this.refReshList()
    },
    // 认领重置
    onClickReceiveModelReset() {
      this.form = { orderNo: '', sysUserId: '' }
      this.tableData = []
    },
    // 订单取消
    onClickReceiveModel() {
      this.visible = false
    },
    async onClickReceiveModelOk() {
      if (!this.multipleSelection?.length) return this.$message.warning('请选择认领订单')
      await this.$refs.ValidateForm.validate()
      const data = this.multipleSelection.map(item => ({
        createTime: item.createTime,
        enrollmentTeacherId: item.enrollmentTeacherId,
        orderNo: item.orderNo,
        userPhone: item.userPhone,
        channelSource: item.channelSource,
        taskId: this.data.id,
        payAmountFee: item.payAmountFee,
        refundedFee: item.refundedFee,
        sysUserId: this.form.sysUserId,
        goodsSubOrderDetail: item.goodsSubOrderDetailVos.map(items => ({
          goodsName: items.goodsName,
          balanceFee: items.balanceFee,
          goodsId: items.goodsId,
          localPayTime: items.localPayTime,
          orderStatus: items.orderStatus,
          orderNo: items.orderNo,
          refundedFee: items.refundedFee,
          payAmountFee: items.payAmountFee
        }))
      }))
      const { code } = await saleCustomerConfirm(data)
      if (code === 1) {
        this.$message({
          message: '认领成功',
          type: 'success'
        })
        this.visible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.commerce.el-select ::v-deep {
  .el-input.is-focus .el-input__inner {
    border-color: #dcdfe6 !important;
  }
}
.tableWarp {
  height: 400px;
}
.searchBox {
  display: flex;
  align-items: center;
}
.info-search {
  display: flex;
  align-items: center;
}
.list-title {
  margin-left: 20px;
}
.list-titletwo {
  margin-left: 30px;
  color: #606266;
  font-weight: bold;
}
.demo-dynamic {
  margin-top: 15px;
}
.model-with-input {
  margin-right: 8px;
}
.selectItem{
  display: flex;
  justify-content: space-between;
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
      ::v-deep .el-input__inner {
        border: none;
        border-radius: 3px 0px 0px 3px;
        border: 1px solid #d8dce6;
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
      border: 1px solid #d8dce6;
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
    border-bottom: 1px solid #e7e7e7;
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
      color: #ffffff;
    }
    .control-btn {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #161616;
    }
  }
  .approval-control {
    background: #f3f3f3;
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
        background: #f3f3f3;
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
        color: #0c6fff;
        background: #ffffff;
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
      margin-left: 20px;
    }
    .list-info {
      display: flex;
      align-items: center;
      .info-search {
        margin-top: 8px;
        .model-with-input {
          width: 426px;
          font-size: 14px;
          margin-right: 10px;
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
        color: #f53f3f;
        .icon-svg {
          margin: 16px 8px 0 0;
        }
      }
      .info-pop-pass {
        color: #00b42a;
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
  background-color: #ffffff;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  // color: #333333;
}
::v-deep .el-input__inner {
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
