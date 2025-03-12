<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="visible"
    :title="isDel ? '删除' : '详情'"
    width="710px"
    :loading="loading"
    height="auto"
    @success="sure"
    @close="closeDialog"
  >
    <div class="dialog">
      <div class="title mt25 mb25">机构选择</div>
      <div class="cell-group mb25">
        <div v-for="item in jgxz" :key="item.prop" class="cell-item">
          <div class="cell-label">{{ item.label }}</div>
          <div class="cell-value">{{ info[item.prop] }}</div>
        </div>
      </div>
      <div class="title mt25 mb25">费用内容</div>
      <div class="cell-group mb25">
        <div v-for="item in fwfy" :key="item.prop" class="cell-item">
          <div class="cell-label">{{ item.label }}</div>
          <div class="cell-value">
            <template v-if="item.prop === 'voucherUrl'">
              <span class="blue-txt" @click.stop="viewFile(info[item.prop])">
                查看凭证
              </span>
            </template>
            <template v-else-if="item.prop === 'chargesAmount'">
              {{ info[item.prop] | priceFt }}
            </template>
            <template v-else>
              {{ info[item.prop] }}
            </template>
          </div>
        </div>
      </div>
      <div class="title mt25 mb25">费用信息</div>
      <div class="cell-group">
        <div v-for="item in fyxx" :key="item.prop" class="cell-item">
          <div class="cell-label">{{ item.label }}</div>
          <div class="cell-value">{{ info[item.prop] }}</div>
        </div>
      </div>
    </div>
    <div slot="footer" :class="['ss-material-box-bottom', !isDel ? 'hg0' : '']">
      <el-button v-if="isDel" size="small" type="danger" @click="sure">
        删除
      </el-button>
      <el-button v-if="isDel" size="small" @click="closeDialog">
        取消
      </el-button>
    </div>
  </AppDialog>
</template>

<script>
import Decimal from 'decimal.js'
import AppDialog from '@/components/AppDialog'
import { codeTransAPpi } from '@/views/orgMgt/orgSettlement/billingCenter/usageDetails/data.js'
import { serviceFees } from '../../data'
export default {
  components: {
    AppDialog
  },
  filters: {
    priceFt(number) {
      if (typeof number !== 'number') {
        return '--'
      } else {
        number = Decimal(number).div(100) // 金钱单位后端存储的分
      }
      // 这里我们手动处理，不依赖于特定的区域设置
      const yuanString = number.toString()
      const parts = yuanString.split('.')
      let integerPart = parts[0]
      const decimalPart = parts[1] ? '.' + parts[1] : ''

      // 添加千分位分隔符
      if (integerPart.length > 3) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      // 合并整数部分和小数部分（如果有的话）
      return '￥' + integerPart + decimalPart
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      info: {},
      row: {},
      isDel: false,
      jgxz: [
        { prop: 'tenantName', label: '机构名称' },
        { prop: 'billCycle', label: '账单月份' }
      ],
      fyxx: [
        { prop: 'createdByName', label: '录入人' },
        { prop: 'createTime', label: '录入时间' }
      ],
      fwfy: [],
      delFn: null // 删除接口
    }
  },
  watch: {},
  methods: {
    async sure() {
      this.loading = true
      try {
        const { success } = await this.delFn({
          billCycle: this.info.billCycle + '-01',
          tenantId: this.info.tenantId,
          productChargesItemNo: this.row?.productChargesItemNo
        })
        if (success) {
          this.$message.success(this.info.productChargesItemName + '已删除')
          this.$emit('search')
          this.closeDialog()
        }
      } catch (error) {
        this.$message.error(error.message)
      }
      this.loading = false
    },

    // 打开弹窗
    async openDialog(row, isDel) {
      this.visible = true
      this.loading = true
      const isCUSTOM = row.productChargesItemNo.includes('CUSTOM')
      const api = codeTransAPpi[isCUSTOM ? 'CUSTOM' : row.productChargesItemNo].api
      try {
        const { data } = await api.detail({
          billCycle: row.billCycle + '-01',
          tenantId: row.tenantId,
          productChargesItemNo: row.productChargesItemNo
        })
        this.info = data
      } catch (error) {
        this.$message.error(error.message)
      }
      this.fwfy = serviceFees.detailColumns[isCUSTOM ? 'CUSTOM' : row.productChargesItemNo]
      this.isDel = isDel
      if (isDel) {
        this.delFn = api.del
        this.row = row
      }
      this.loading = false
    },
    // 关闭弹窗
    closeDialog() {
      this.visible = false
      this.loading = false
      this.isDel = false
    },
    viewFile(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.hg0 {
  height: 0 !important;
}
.dialog {
  max-height: 600px;
  height: auto;
  padding: 20px;
  width: 100%;
  overflow-y: auto;
  .mb25 {
    margin-bottom: 25px;
  }
  .w515 {
    width: 515px;
  }
  .title {
    color: #000000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px;
    padding-left: 11px;
    text-align: left;
    position: relative;

    &::before {
      content: '';
      height: 100%;
      width: 2px;
      background: #0c6fff;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .cell-group {
    width: 100%;
    height: auto;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
    .cell-item {
      display: flex;
      height: auto;
      &:not(:first-child) {
        border-top: 1px solid #e7e7e7;
      }
      .cell-label {
        color: #333333;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        background: #f3f3f3;
        flex-shrink: 0;
        width: 200px;
        text-align: center;
        border-right: 1px solid #e7e7e7;
        padding: 10px 0;
      }
      .cell-value {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        padding: 10px 27px;
        flex: 1;
        .blue-txt {
          color: #0c6fff;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
  }

  ::v-deep .el-form-item__label {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}
</style>
