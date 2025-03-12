<template>
  <div class="table-cont-btn">
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      :data="orders"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="className"
        label="班期"
      />
      <el-table-column
        prop="userName"
        label="客户姓名"
      />
      <el-table-column
        prop="orderNo"
        label="订单号"
      />
      <el-table-column
        prop="goodsName"
        label="商品名称"
      />
      <el-table-column
        prop="userPhone"
        label="客户手机"
      />
      <el-table-column
        prop="afterSaleStatus"
        label="售后状态"
      >
        <template slot-scope="scope">
          <p>{{ afterSaleStatusArray[scope.row.afterSaleStatus] }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="签到状态"
      >
        <template slot-scope="scope">
          <p>{{ asignArray [scope.row.signedIn] }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="payerTotal"
        label="订单金额"
      />
      <el-table-column
        prop="payTime"
        label="支付时间"
      />
      <el-table-column
        prop="signedOn"
        label="签到时间"
      />
      <el-table-column
        prop="folowers"
        label="跟进人"
      />
    </el-table>
    <div class="page-row">
      <el-pagination
        :current-page="datas.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="datas.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="datas.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="详情" :visible.sync="addBqDialog">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="客户手机" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="form.phone" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="客户姓名" prop="realName" :label-width="formLabelWidth">
          <el-input v-model="form.realName" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsId" :label-width="formLabelWidth">
          <el-select v-model="form.goodsId" :disabled="changeForStatus" style="width: 100%" placeholder="请选择商品">
            <el-option
              v-for="item in goods"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额" prop="payerTotal" :label-width="formLabelWidth">
          <el-input v-model="form.payerTotal" :disabled="changeForStatus">
            <i slot="suffix" style="font-style:normal;margin-right: 10px;">元</i>
          </el-input>
        </el-form-item>
        <el-form-item label="支付时间" prop="payDate" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.payDate"
            :disabled="changeForStatus"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="公司名称" prop="company" :label-width="formLabelWidth">
          <el-input v-model="form.company" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="职位" prop="position" :label-width="formLabelWidth">
          <el-select v-model="form.position" placeholder="请选择">
            <el-option label="董事长" value="董事长" />
            <el-option label="总经理" value="总经理" />
            <el-option label="高管" value="高管" />
            <el-option label="中层" value="中层" />
            <el-option label="普通员工" value="普通员工" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="行业" prop="industry" :label-width="formLabelWidth">
          <el-select v-model="form.industry" filterable placeholder="请选择行业">
            <el-option
              v-for="item in hangye"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="营业规模" prop="turnover" :label-width="formLabelWidth">
          <el-select v-model="form.turnover" filterable placeholder="请选择营业规模">
            <el-option
              v-for="item in yingyee"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班期" prop="classId" :label-width="formLabelWidth">
          <el-select v-model="form.classId" :disabled="form.signedIn === 1" clearable placeholder="请选择" class="w-200">
            <el-option
              v-for="item in classData"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="for-textarea" label="服务备注" :label-width="formLabelWidth">
          <el-input
            v-model="form.serviceRemarks"
            disabled
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item class="for-textarea" label="销售备注" :label-width="formLabelWidth">
          <el-input
            v-model="form.salesRemarks"
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBqDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitFormSetBq('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getClassDataByGoodId, editForOrderClass, getMyOrderDetailData } from '@/api/liveDeliver'
export default {
  name: 'TableData',
  // eslint-disable-next-line vue/require-prop-types
  props: ['orders', 'search', 'datas', 'goods'],
  // eslint-disable-next-line vue/require-prop-types
  data() {
    return {
      yingyee: [
        {
          'dictCode': 11,
          'dictLabel': '500万以下',
          'dictValue': '1'
        },
        {
          'dictCode': 12,
          'dictLabel': '500-1000万',
          'dictValue': '2'
        },
        {
          'dictCode': 13,
          'dictLabel': '1000-3000万',
          'dictValue': '3'
        },
        {
          'dictCode': 14,
          'dictLabel': '3000-5000万',
          'dictValue': '4'
        },
        {
          'dictCode': 15,
          'dictLabel': '5000-1亿',
          'dictValue': '5'
        },
        {
          'dictCode': 16,
          'dictLabel': '1亿-3亿',
          'dictValue': '6'
        },
        {
          'dictCode': 17,
          'dictLabel': '3亿以上',
          'dictValue': '7'
        }
      ],
      hangye: [
        {
          'dictCode': 9,
          'dictLabel': '消费品：食品，日化，餐饮，零售',
          'dictValue': '1'
        },
        {
          'dictCode': 10,
          'dictLabel': '服装纺织，服装批发',
          'dictValue': '2'
        },
        {
          'dictCode': 18,
          'dictLabel': '家具，家居，家电',
          'dictValue': '3'
        },
        {
          'dictCode': 19,
          'dictLabel': '珠宝，工艺品，玩具，奢侈品',
          'dictValue': '4'
        },
        {
          'dictCode': 20,
          'dictLabel': '互联网，电商，IT服务',
          'dictValue': '5'
        },
        {
          'dictCode': 21,
          'dictLabel': '电子，通信，硬件',
          'dictValue': '6'
        },
        {
          'dictCode': 22,
          'dictLabel': '广告，传媒，教育培训，文体娱乐',
          'dictValue': '7'
        },
        {
          'dictCode': 23,
          'dictLabel': '房地产，建筑，物业',
          'dictValue': '8'
        },
        {
          'dictCode': 24,
          'dictLabel': '医疗，保健，美容',
          'dictValue': '9'
        },
        {
          'dictCode': 25,
          'dictLabel': '政府，农林牧渔',
          'dictValue': '10'
        },
        {
          'dictCode': 26,
          'dictLabel': '服务业：餐饮，母婴，零售',
          'dictValue': '11'
        },
        {
          'dictCode': 27,
          'dictLabel': '其他',
          'dictValue': '12'
        }
      ],
      asignArray: ['未签到', '已签到'],
      classData: [],
      afterSaleStatusArray: ['', '可申请', '申请中', '已完成', '用户关闭', '超时关闭'],
      currentPage4: 1,
      tableData: [],
      addBqDialog: false,
      changeForStatus: false,
      searchDataObject: {},
      form: {
        phone: '',
        realName: '',
        goodsId: '',
        payerTotal: '',
        payDate: '',
        company: '',
        position: '',
        industry: '',
        turnover: '',
        dictLabel: '',
        classId: '',
        salesRemarks: '',
        serviceRemarks: '',
        orderNo: '',
        signedIn: 0
      },
      nowRowData: {},
      formLabelWidth: '120px',
      rules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入客户姓名！', trigger: 'blur' }
        ],
        goodsId: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        payerTotal: [
          { required: true, message: '请填写订单金额', trigger: 'blur' }
        ],
        payDate: [
          { required: true, message: '请选择支付时间', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择行业', trigger: 'change' }
        ],
        turnover: [
          { required: true, message: '请选择营业规模', trigger: 'change' }
        ],
        position: [
          { required: true, message: '请选择职位', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择班期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    toSearchClassData() {
      const params = {
        goodsId: this.form.goodsId
      }
      getClassDataByGoodId(params).then(res => {
        if (res.code === 1) {
          this.classData = res.data
        }
      })
    },
    handleSizeChange(val) {
      this.search.size = val
      this.$parent.searchFn(this.search)
    },
    handleCurrentChange(val) {
      this.search.current = val
      this.$parent.searchFn(this.search)
    },
    toDetail(row) {
      this.nowRowData = row.row
      this.form.goodsId = row.row.goodsId
      this.form.phone = row.row.userPhone
      this.form.realName = row.row.userName
      this.form.payerTotal = row.row.payerTotal
      this.form.payDate = row.row.payTime
      this.form.company = row.row.company
      this.form.position = row.row.position
      this.form.classId = row.row.classId
      this.form.salesRemarks = row.row.salesRemarks
      this.form.serviceRemarks = row.row.serviceRemarks
      this.form.orderNo = row.row.orderNo
      this.form.subOrderId = row.row.subOrderId
      this.form.signedIn = row.row.signedIn
      const params = {
        subOrderId: row.row.subOrderId
      }
      getMyOrderDetailData(params).then(res => {
        if (res.code === 1) {
          this.form.position = res.data.position
          if (res.data.channelSource === 3) {
            this.changeForStatus = true
          } else {
            this.changeForStatus = false
          }
          this.form.industry = res.data.industry
          this.form.turnover = res.data.turnover
          this.form.salesRemarks = res.data.salesRemarks
        }
      })
      this.toSearchClassData()
      this.addBqDialog = true
    },
    submitFormSetBq(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const reg = /^[1][3-9][0-9]{9}$/
          // eslint-disable-next-line eqeqeq
          if ((!reg.test(this.form.phone)) && this.form.phone != '') {
            this.$message.error('请输入正确的手机号码！')
            return false
          }
          editForOrderClass(this.form).then(res => {
            if (res.code === 1) {
              this.$message.success('编辑成功！')
              this.addBqDialog = false
              this.$parent.searchFn(this.search)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-row {
    padding: 20px 0;
    text-align: right;
}
</style>
