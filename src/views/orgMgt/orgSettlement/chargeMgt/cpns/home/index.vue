<template>
  <div class="charge-mgt-home">
    <el-button size="small" type="primary" class="add-btn" @click="addFn">
      新增
    </el-button>
    <div class="charge-mgt-cnt">
      <el-table
        v-loading="loading"
        border
        height="100%"
        :data="tableInfo.data"
        class="data-table"
      >
        <template v-for="item in tableInfo.columns">
          <el-table-column
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            v-bind="item.attrs"
          >
            <template slot-scope="scope">
              <template v-if="item.type === 'option'">
                {{ tableInfo.options[item.prop][scope.row[item.prop]] }}
              </template>
              <template v-else-if="item.prop === 'operate'">
                <template v-if="scope.row.source === 2">
                  <el-button
                    class="pg-0"
                    type="text"
                    @click="editFn(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="!scope.row.existBill"
                    class="pg-0"
                    type="text"
                    @click="delFn(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </template>
              <template
                v-else-if="
                  item.prop === 'remark' &&
                  scope.row.productChargesItemNo === 'PUB0001'
                "
              >
                <el-tooltip class="item" effect="dark" placement="top">
                  <template #content>
                    <div class="pre-line" v-html="scope.row[item.prop]" />
                  </template>
                  <div class="ellipsis" v-html="scope.row[item.prop]" />
                </el-tooltip>
                <!-- <div class="text-content">{{ scope.row[item.prop] }}</div> -->
              </template>

              <template v-else> {{ scope.row[item.prop] || '--' }}</template>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <AddDialog ref="addChargeRef" @search="getTableList" />
  </div>
</template>

<script>
// import Decimal from 'decimal.js'
import AddDialog from './addDialog.vue'
import { chargesListApi } from '@/api/orgSettlement/chargeMgt.js'
import { chargesDelApi } from '@/api/orgSettlement/billingCenter.js'

export default {
  filters: {
    // priceFt(number, productChargesItemNo) {
    //   if (typeof number !== 'number') return '--'
    //   // 直播服务百分比
    //   if (['LIV0001'].includes(productChargesItemNo)) return number * 100 + '%' // 百分比输出
    //   number = Decimal(number).div(100) // 钱单位为分 单独处理
    //   // 这里我们手动处理，不依赖于特定的区域设置
    //   const yuanString = number.toString()
    //   const parts = yuanString.split('.')
    //   let integerPart = parts[0]
    //   const decimalPart = parts[1] ? '.' + parts[1] : ''
    //   // 添加千分位分隔符
    //   if (integerPart.length > 3) {
    //     integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //   }
    //   // 合并整数部分和小数部分（如果有的话）
    //   return '￥' + integerPart + decimalPart
    // }
  },
  components: {
    AddDialog
  },
  data() {
    return {
      loading: false,
      tableInfo: {
        data: [],
        options: {
          expenseType: { 1: '账号付费', 2: '按量付费', 3: 'GMV付费' },
          billingMethod: { 1: '系统计费', 2: '手动计费' }
        },
        columns: [
          {
            prop: 'productChargesName',
            type: 'text',
            label: '产品',
            attrs: {
              minWidth: 142
            }
          },
          {
            prop: 'productChargesItemName',
            label: '产品明细',
            type: 'text',
            attrs: {
              minWidth: 142
            }
          },
          {
            prop: 'expenseType',
            label: '收费类型',
            type: 'option',
            attrs: {
              minWidth: 142
            }
          },
          {
            prop: 'remark',
            type: 'text',
            label: '单价/收费比例',
            attrs: {
              minWidth: 142
            }
          },
          {
            prop: 'billingUnit',
            type: 'text',
            label: '单价单位',
            attrs: {
              minWidth: 142
            }
          },
          {
            prop: 'billingMethod',
            type: 'option',
            label: '计费方式',
            attrs: {
              minWidth: 142
            }
          },
          {
            prop: 'operate',
            type: 'btn',
            label: '操作',
            attrs: {
              width: 122
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    addFn() {
      this.$refs.addChargeRef.openDialog()
    },
    async getTableList() {
      this.loading = true
      try {
        const { data } = await chargesListApi()
        this.tableInfo.data = data
      } catch (error) {
        console.log('aggregateCustomerApi-------error', error)
      }
      this.loading = false
    },
    editFn(data) {
      this.$refs.addChargeRef.openDialog(data)
    },
    delFn({ id }) {
      this.$delModal({
        tips: `确认删除该收费项吗?`,
        success: async () => {
          this.loading = true
          try {
            const { success } = await chargesDelApi(id)
            if (success) {
              this.getTableList()
              this.$notify.success('删除成功')
            }
          } catch (error) {
            this.loading = false
            console.log('serviceFees-del--------error', error)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.charge-mgt-home {
  position: relative;
  .add-btn {
    position: absolute;
    right: 20px;
    top: -40px;
  }
  .pg-0 {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.charge-mgt-cnt {
  @include responsive-height(68px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 15px;
  overflow-y: auto;
  .text-content {
    white-space: pre-line; /* 允许换行 */
    text-align: left;
    padding-left: 20px;
  }
  .ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 限制为两行 */
    overflow: hidden;
    text-overflow: ellipsis; /* 溢出时显示省略号 */
    padding: 0 5px;
  }
}
.pre-line {
  white-space: pre-line;
}
::v-deep .data-table {
  border-radius: 8px;
  .el-table {
    border-radius: 8px;
  }
  .el-table--border {
    border-radius: 8px;
  }
  thead tr {
    th {
      &.el-table__cell.is-leaf {
        /* padding-left: 22px; */
      }
      background-color: #ebf7ff;
      &:first-child {
        border-radius: 8px 0 0 0;
      }
      &:nth-child(3) {
        border-radius: 0 8px 0 0;
      }
      .cell {
        color: #5c6387;
      }
    }
  }
  tbody tr:last-child {
    border-radius: 0 0 8px 8px;
    td:first-child {
      border-radius: 0 0 0 8px;
    }
    td:last-child {
      border-radius: 0 0 8px 0;
    }
  }
  .cell {
    text-align: center;
    color: #333;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    padding: 4px 0;
  }
  thead th {
    background-color: #f3f3f3;
    .cell {
      text-align: center;
      color: #333333;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 14px;
      padding: 1px 0;
    }
  }
}
</style>
