<template>
  <div>
    <div class="el-main">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="时间筛选">
          <el-date-picker
            v-model="dataValue"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-bottom: 20px; width: 280px"
            size="small"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item label="机构筛选">
          <el-select
            v-model="formInline.tenantId"
            size="small"
            placeholder="请选择"
            @change="onSubmit"
          >
            <el-option
              v-for="item in jgArray"
              :key="item.orginId"
              :label="item.orginName"
              :value="item.orginId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成交方式">
          <el-select
            v-model="formInline.orderSource"
            size="small"
            placeholder="请选择"
            @change="onSubmit"
          >
            <el-option
              v-for="item in cjTypeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查看商品">
          <el-switch
            v-model="formInline.showProduct"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            @change="onSubmit"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            plain
            type="primary"
            size="small"
            @click="downloadFile"
          >下载</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadDataFlag"
        :header-cell-style="headerColumStyle"
        height="600"
        :cell-style="columStyle"
        :span-method="mergeSameRows"
        :data="showDataArray"
        border
        style="width: 100%"
      >
        <el-table-column label="机构信息" align="center">
          <el-table-column
            prop="payDate"
            label="日期"
            width="150"
            align="center"
          />
          <el-table-column
            prop="tenantName"
            width="150"
            label="机构名称"
            align="center"
          >
            <template slot-scope="scope">
              <p
                v-if="scope.row.tenantName.indexOf('总计') >= 0"
                style="display: inline"
              >
                {{ scope.row.tenantName }}
              </p>
              <div v-else class="img-div">
                <img class="img-dsx" :src="scope.row.tenantLogo" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopName"
            label="店铺名称"
            width="200"
            align="center"
          />
          <el-table-column
            v-if="formInline.showProduct"
            prop="productName"
            label="商品名称"
            width="280"
            align="left"
          />
          <el-table-column
            prop="nonDecryptCount"
            label="未解密总数"
            align="center"
          />
        </el-table-column>
        <el-table-column label="H5短信解密" align="center">
          <el-table-column
            prop="h5DecryptCount"
            label="H5解密数"
            align="center"
          />
          <el-table-column
            prop="h5DecryptRate"
            label="H5解密占比"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.h5DecryptRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="h5TotalDecryptRate"
            label="H5总解密率"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.h5TotalDecryptRate) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="小程序短信解密" align="center">
          <el-table-column
            prop="smsDecryptCount"
            label="小程序解密数"
            align="center"
          />
          <el-table-column
            prop="smsDecryptRate"
            label="小程序解密占比"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.smsDecryptRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="smsTotalDecryptRate"
            label="小程序总解密率"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.smsTotalDecryptRate) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="客服小程序解密" align="center">
          <el-table-column
            prop="customerServiceCount"
            label="客服小程序解密数"
            align="center"
          />
          <el-table-column
            prop="customerServiceRate"
            label="客服解密占比"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.customerServiceRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerTotalServiceRate"
            label="客服总解密率"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.customerTotalServiceRate) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="短信解密链路" align="center">
          <el-table-column
            prop="smsDecryptTotalCount"
            label="解密总数"
            align="center"
          />
          <el-table-column
            prop="smsDecryptSuccessRate"
            label="解密率"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.smsDecryptSuccessRate) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其他方式解密" align="center">
          <el-table-column
            prop="sysArtificialCount"
            label="订单补齐解密"
            align="center"
          />
          <el-table-column
            prop="sysDecryptCount"
            label="系统解密"
            align="center"
          />
          <el-table-column
            prop="sysDdecryptTotalCount"
            label="解密总数"
            align="center"
          />
          <el-table-column
            prop="sysDecryptSuccessRate"
            label="解密率"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.sysDecryptSuccessRate) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="汇总" align="center">
          <el-table-column
            prop="decryptCount"
            label="解密总数"
            align="center"
          />
          <el-table-column
            prop="decryptSuccessRate"
            label="总解密率"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.decryptSuccessRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="nonDecryptRefundCount"
            label="未解密订单退款数"
            align="center"
          />
          <el-table-column prop="refundRate" label="退款比例" align="center">
            <template slot-scope="scope">
              <span>{{ returnBfb(scope.row.refundRate) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- <div class="page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30]"
              :page-size="pagesize"
              :current-page="currentPage"
              layout="total, sizes, prev, pager, next, jumper"
              :total="parseInt(total)">
            </el-pagination>
          </div> -->
    </div>
  </div>
</template>
<script>
import { jmData, getJGid, decryptExport } from '@/api/business/clue.js'
// eslint-disable-next-line no-extend-native
Date.prototype.pattern = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  var week = {
    0: '/u65e5',
    1: '/u4e00',
    2: '/u4e8c',
    3: '/u4e09',
    4: '/u56db',
    5: '/u4e94',
    6: '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '/u661f/u671f'
          : '/u5468'
        : '') + week[this.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
export default {
  components: {},
  data() {
    return {
      jgArray: [],
      formInline: {
        startDate: '',
        endDate: '',
        tenantId: '',
        orderSource: '',
        showProduct: false
      },
      dataValue: [],
      cjTypeArray: [
        { label: '全部', value: '' },
        { label: '自然成交', value: 0 },
        { label: '内容带货', value: 1 },
        { label: '直播带货', value: 2 }
      ],
      platFrom: '',
      orderSource: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      loadDataFlag: false,
      tableData: [],
      pagesize: 100000,
      currentPage: 1,
      total: 0,
      showDataArray: []
    }
  },
  created() {
    if (this.$route.query.token) {
      sessionStorage.setItem('fromFxyToken', this.$route.query.token)
      location.href = process.env.VUE_APP_TO_QUERY_SITE
    }
    this.loadJgIds()
    var nowday = new Date()
    nowday.setDate(nowday.getDate() - 3)
    this.dataValue.push(nowday.pattern('yyyy-MM-dd')) //, nowday.pattern('yyyy-MM-dd')
    var nowdays = new Date()
    this.dataValue.push(nowdays.pattern('yyyy-MM-dd'))
    this.onSubmit()
  },
  methods: {
    downloadFile() {
      decryptExport({
        startDate: this.formInline.startDate,
        endDate: this.formInline.endDate,
        orderSource: this.formInline.orderSource,
        showProduct: this.formInline.showProduct ? 1 : 0
      }).then(res => {
        // 导出文件
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const fileName = new Date().getTime() + '.xlsx'
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        // 释放内存
        URL.revokeObjectURL(link.href)
      })
    },
    columStyle({ row, columnIndex }) {
      if (row.tenantName.indexOf('总计') > 0 && columnIndex !== 0) {
        return 'font-weight: bold;border-right:none;'
      }
      if (row.tenantName.indexOf('总计') === 0 && columnIndex !== 0) {
        return 'background: #F6FDFF; font-weight: bold;border-right:none;'
      }
    },
    returnBfb(num) {
      return num.toFixed(2) + '%'
    },
    onSubmit() {
      if (this.dataValue) {
        this.formInline.startDate = this.dataValue?.[0]
        this.formInline.endDate = this.dataValue?.[1]
        this.loadData()
      } else {
        this.$message.error('请选择时间！')
      }
    },
    loadJgIds() {
      getJGid().then(res => {
        this.jgArray = []
        if (res.code === 1) {
          this.jgArray = res.data
          this.jgArray.unshift({ orginId: '', shopId: '', orginName: '全部' })
        }
      })
    },
    returnRowSpan(row, { columnIndex, rowIndex }, name) {
      return this.showDataArray
        .slice(0, rowIndex)
        .find(
          item => item['payDate'] === row['payDate'] && item[name] === row[name]
        )
        ? [0, 1]
        : [
          this.showDataArray.filter(
            item =>
              item['payDate'] === row['payDate'] && item[name] === row[name]
          ).length || 1,
          1
        ]
    },
    mergeSameRows({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return this.returnRowSpan(row, { columnIndex, rowIndex }, 'payDate')
      }
      if (columnIndex === 1) {
        var arr = this.returnRowSpan(
          row,
          { columnIndex, rowIndex },
          'tenantName'
        )
        return row['shopName'] == null ? [1, arr[1] + 1] : arr
      }

      if (columnIndex === 2) {
        // eslint-disable-next-line no-redeclare
        var arr = this.returnRowSpan(row, { columnIndex, rowIndex }, 'shopName')
        return row['shopName'] == null ? [0, 0] : arr
      }
    },
    headerColumStyle({ row, columnIndex }) {
      if (row.length === 4) {
        if (columnIndex === 0) {
          return 'background: #F6FDFF; font-family:"微软雅黑"； font-size: 14px; color: #000;'
        }
        if (columnIndex === 1) {
          return 'background: #F6FDFF; font-family:"微软雅黑"； font-size: 14px; color: #000;'
        }
        if (columnIndex === 2) {
          return 'background: #F6FDFF; font-family:"微软雅黑"；font-size: 14px; color: #000;'
        }
        if (columnIndex === 3) {
          return 'background: #F6FDFF; font-family:"微软雅黑"；font-size: 14px; color: #000;'
        }
      }
      if (row.length === 16 || row.length === 17) {
        if (this.formInline.showProduct) {
          if (columnIndex < 5) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
          if (columnIndex >= 5 && columnIndex < 9) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
          if (columnIndex >= 9 && columnIndex < 13) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
          if (columnIndex >= 13) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
        } else {
          if (columnIndex < 4) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
          if (columnIndex >= 4 && columnIndex < 8) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
          if (columnIndex >= 8 && columnIndex < 12) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
          if (columnIndex >= 12) {
            return 'background: #F6FDFF; font-weight: 400; color: #000'
          }
        }
      }
    },
    loadData() {
      const params = {
        startDate: this.formInline.startDate,
        endDate: this.formInline.endDate,
        orderSource: this.formInline.orderSource,
        tenantId: this.formInline.tenantId,
        showProduct: this.formInline.showProduct ? 1 : 0
      }
      jmData(params).then(res => {
        this.loadDataFlag = false
        this.tableData = res.data
        this.total = res.data.length
        this.showDataArray = []
        this.showDataArray = this.tableData.slice(
          (this.currentPage - 1) * this.pagesize,
          this.currentPage * this.pagesize
        )
      })
    },
    changePlatFrom() {
      this.loadDataFlag = true
      this.loadData()
    },
    changeOrderType() {
      this.loadDataFlag = true
      this.loadData()
    },
    changeTime() {
      if (this.dataValue) {
        this.onSubmit()
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.showDataArray = []
      this.showDataArray = this.tableData.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      )
    },
    handleCurrentChange(val) {
      this.showDataArray = []
      this.currentPage = val
      this.showDataArray = this.tableData.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      )
    }
  }
}
</script>

<style scoped lang="scss">
.el-tabs {
  width: 100%;
}
.el-header {
  line-height: 60px;
  font-size: 28px;
}

.el-main {
  width: 100%;
  min-height: 500px;
  text-align: left;
  margin-top: 20px;
}

.page {
  margin-top: 20px;
  text-align: right;
}

.download-execl {
  float: right;
}

.new-liul {
  margin-left: 20px;
}

::v-deep .el-table .yellow-row {
  background: yellow;
}
::v-deep .el-table .blue-row {
  background: blue;
}
.el-card__body,
.el-main {
  padding: 0 20px !important;
}
.el-table td.el-table__cell div {
  color: #666;
}
.el-form--inline {
  height: 60px;
}

.img-div {
  text-align: center;
}
.img-dsx {
  height: 32px;
  margin-top: 3px;
}
</style>
