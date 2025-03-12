<template>
  <div class="blue-table">
    <el-table border :data="tableData" :row-class-name="tableRowClassName">
      <template v-for="item in columns">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label">
          <template v-if="item.labelTips" slot="header">
            <MTips :text="item.label" :tips="item.labelTips" />
          </template>
          <template slot-scope="scope">
            <span v-if="item.type === 'price'" :class="[...item.className]">
              {{
                scope.row[item.prop]
                  | priceFt(scope.row.productChargesItemNo, item.prop)
              }}
            </span>
            <div
              v-else-if="item.type === 'textHtml'"
              :class="[...item.className]"
            >
              <template
                v-if="scope.row[item.prop] && scope.row[item.prop].length > 40"
              >
                <el-tooltip class="item" effect="dark" placement="top">
                  <template #content>
                    <div
                      class="pre-line"
                      v-html="scope.row[item.prop]"
                    />
                  </template>
                  <div class="ellipsis2" v-html="scope.row[item.prop]" />
                </el-tooltip>
              </template>
              <template v-else>
                <div v-html="scope.row[item.prop]" />
              </template>
            </div>
            <span
              v-else-if="item.type === 'link'"
              class="blue-txt"
              @click.stop="viewFile(scope.row[item.prop])"
            >
              查看凭证
            </span>
            <span v-else-if="item.type === 'option'">
              {{ rowOptionsFt(item, scope.row) }}
            </span>
            <span v-else-if="item.type === 'button'">
              <div class="active-btn">
                <el-button
                  v-for="(btn, index) in item.btns"
                  :key="index"
                  type="primary"
                  size="mini"
                  plain
                  v-bind="btn.bind"
                  :disabled="disabled"
                  @click="btn.fn(scope.row)"
                >
                  {{ btn.label }}
                </el-button>
              </div>
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import Decimal from 'decimal.js'
export default {
  filters: {
    priceFt(number, productChargesItemNo, type) {
      if (typeof number !== 'number') {
        return '--'
      } else {
        if (number < 0) number = 0
      }
      // 直播服务百分比
      if (['LIV0001'].includes(productChargesItemNo) && type === 'unitPrice') {
        return number * 100 + '%' // 百分比输出
      }
      number = Decimal(number).div(100) // 钱单位为分 单独处理
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
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    optionObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    rowOptionsFt(item, row) {
      const optionConfig = item.optionConfig || {
        label: 'label',
        value: 'value'
      }
      const value = row.key
      const arr = this.optionObj[item.prop]
      if (!arr) return
      for (const option of arr) {
        if (row[item.prop] === option[optionConfig.value]) {
          return option[optionConfig.label]
        }
      }
      return value || '--'
    },
    viewFile(url) {
      window.open(url)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2) {
        return 'blue-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
::v-deep .el-table {
  border-radius: 8px !important;
}
::v-deep {
  thead tr {
    th {
      background-color: #ebf7ff;
      &:first-child {
        border-radius: 8px 0 0 0;
      }
      &:nth-child(3) {
        border-radius: 0 8px 0 0;
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
  .blue-row {
    background-color: #f2f9ff !important;
  }
  thead tr {
    th.el-table__cell.is-leaf {
      padding: 10px;
      border-bottom: none;
      background-color: #ebf7ff;
      .cell {
        color: #5c6387;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 16px;
      }
    }
  }
  tbody {
    td.el-table__cell {
      border-bottom: none;
    }
    .cell {
      padding: 0 10px;
      text-align: center;
      color: #333;
      font-weight: 500;
      font-size: 14px;
      .total-price {
        color: $primaryColor;
        font-family: 'Microsoft YaHei';
        font-size: 28px;
        font-style: normal;
        font-weight: 700;
        line-height: 28px;
      }
    }
  }
}

.blue-txt {
  color: #0c6fff;
  font-weight: 400;
  cursor: pointer;
}
.ellipsis2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制为两行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 溢出时显示省略号 */
}
.pre-line {
  white-space: pre-line;
}
</style>
