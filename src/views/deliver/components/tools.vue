<template>
  <div class="tools-cont">
    <div class="table-cont-btn">
      <el-button type="primary" @click="goodsSet">商品设置</el-button>
      <el-button type="primary" @click="banqSet">班期设置</el-button>
      <el-button type="primary" @click="exportExcel">导出</el-button>
    </div>
    <el-dialog title="商品设置" :visible.sync="goodsSetVisiable">
      <el-table v-loading="setGoodsLoadding" border :data="setGoodsList.slice((setCurrent-1)*setPageSize,setCurrent*setPageSize)" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <div class="tableinline">
              <img :src="scope.row.coverUrl">
              <span>
                <p>{{ scope.row.goodsName }}</p>
                <p>¥{{ (scope.row.salePrice/100).toFixed(2) }}元 <em>{{ goodsSjStatus[scope.row.shelveFlag] }}</em></p>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="" width="200" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-row">
        <el-pagination
          :total="setTotal"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="setCurrent"
          :page-sizes="[5, 10, 15]"
          :page-size="setPageSize"
          @size-change="setHandleSizeChange"
          @current-change="setHandleCurrentChange"
        />
      </div>
      <div class="table-cont-footer">
        <el-button type="primary" @click="deleteGoodsBtn">移除</el-button>
        <el-button type="primary" @click="addGoodsSet">新增</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增商品" :visible.sync="goodsAddSetVisiable">
      <el-form :inline="true" :model="addGoodSearch">
        <el-form-item label="">
          <el-select v-model="addGoodSearch.goodsType" placeholder="全部类型">
            <el-option label="全部渠道" value="" />
            <el-option label="图片" value="0" />
            <el-option label="音频" value="1" />
            <el-option label="视频" value="2" />
            <el-option label="专栏" value="3" />
            <el-option label="大专栏" value="4" />
            <el-option label="线下课" value="5" />
            <el-option label="直播" value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="addGoodSearch.goodsName" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSearchForGoods">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="addGoodsTable" v-loading="addGoodsLoadding" border :data="addGoodsTableData.slice((addCurrent-1)*AddPageSize,addCurrent*AddPageSize)" @selection-change="handleAddGoods">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <div class="tableinline">
              <ImagePreviewer class="image-previewer" :src="scope.row.coverUrl" />
              <span>
                <p>{{ scope.row.goodsName }}</p>
                <p>¥{{ (scope.row.salePrice/100).toFixed(2) }}元 <em>{{ goodsSjStatus[scope.row.shelveFlag] }}</em></p>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-row">
        <el-pagination
          :total="addTotal"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="addCurrent"
          :page-sizes="[5, 10, 15]"
          :page-size="AddPageSize"
          @size-change="addHandleSizeChange"
          @current-change="addHandleCurrentChange"
        />
      </div>
      <div class="table-cont-footer">
        <el-button type="primary" @click="chooseGoodsAdd">确认选择</el-button>
      </div>
    </el-dialog>
    <el-dialog title="班期设置" :visible.sync="banqiSetVisiable">
      <el-form :inline="true" :model="searchDataObject">
        <el-form-item label="">
          <el-select v-model="searchDataObject.isDelivered" placeholder="交付状态">
            <el-option label="全部" value="" />
            <el-option label="未交付" value="0" />
            <el-option label="已交付" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchDataObject.goodsName" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchForGoods">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table border :data="scheduleTableData.slice((bqCurrent-1)*bqPageSize,bqCurrent*bqPageSize)">
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.isDelivered"
              @click="editForBq(scope.$index, scope.row,1)"
            >编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商品类型">
          <template slot-scope="scope">
            <p>{{ goodsTypeArray[scope.row.goodsType] }}</p>
          </template>
        </el-table-column>
        <el-table-column property="goodsName" label="商品名称" />
        <el-table-column property="className" label="商品班期" />
        <el-table-column property="isDelivered" label="商品交付状态">
          <template slot-scope="scope">
            <p>{{ scope.row.isDelivered?'已交付':'未交付' }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-row">
        <el-pagination
          :total="bqTotal"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="bqCurrent"
          :page-sizes="[5, 10, 15]"
          :page-size="bqPageSize"
          @size-change="bqHandleSizeChange"
          @current-change="bqHandleCurrentChange"
        />
      </div>
      <div class="table-cont-footer">
        <el-button type="primary" @click="addBqDialogMethod">新增班期</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="isEdit == 1 ? '编辑班期':'新增班期'" :visible.sync="addBqDialog">
      <el-form ref="bqInsertFor" :model="form" :rules="rules">
        <el-form-item label="商品名称" prop="goodsId" :label-width="formLabelWidth">
          <el-select v-model="form.goodsId" style="width: 100%;" filterable placeholder="请选择">
            <el-option
              v-for="item in setGoodsList"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班期" prop="className" :label-width="formLabelWidth">
          <el-input v-model="form.className" maxlength="20" show-word-limit />
          <span>不能重复,请按老师名称*日期定期班期,比如:张琦20220618班</span>
        </el-form-item>
        <el-form-item label="班期人数" prop="classNumber" :label-width="formLabelWidth">
          <el-input v-model="form.classNumber" />
          <span>超过人数之后,销售人员不能再加入新的客户到此班期中</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelToEditBq">取 消</el-button>
        <el-button type="primary" @click="submitFormSetBq('bqInsertFor')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteGoods, getGoodsList, porductSettingList, getSetGoodsList, getScheduleDataList, addClassSchedule, editClassSchedule, exportData } from '@/api/liveDeliver'
export default {
  name: 'Tools',
  // eslint-disable-next-line vue/require-prop-types
  props: ['goods', 'search'],
  data() {
    return {
      // 班期数据
      isEdit: 0,
      bqPageSize: 5,
      bqTotal: 0,
      bqCurrent: 1,
      scheduleTableData: [],
      setGoodsLoadding: false,
      // 商品设置信息
      setGoodsList: [],
      setPageSize: 5,
      setTotal: 0,
      setCurrent: 1,
      // 新增商品查询form
      addGoodSearch: {
        goodsType: '',
        goodsName: ''
      },
      AddPageSize: 5,
      addTotal: 0,
      addCurrent: 1,
      addGoodsChooseArray: [],
      addGoodsLoadding: false,
      goodsSjStatus: ['已上架', '未上架', '待上架'],
      addGoodsTableData: [],
      goodsSetVisiable: false,
      goodsAddSetVisiable: false,
      banqiSetVisiable: false,
      addBqDialog: false,
      searchDataObject: {
        isDelivered: '',
        goodsName: ''
      },
      multipleSelection: [],
      gridData: [],
      form: {
        goodsId: '',
        className: '',
        classNumber: ''
      },
      formLabelWidth: '120px',
      rules: {
        goodsId: [
          { required: true, message: '请选择商品！', trigger: 'change' }
        ],
        className: [
          { required: true, message: '请设置班期名称！', trigger: 'blur' }
        ],
        classNumber: [
          { required: true, message: '请设置班期人数', trigger: 'blur' }
        ]
      },
      newColumns: [
        {
          'prop': 'userName',
          'label': '客户姓名',
          'align': 'center',
          'is_co': 4
        },
        {
          'prop': 'userPhone',
          'label': '手机号码',
          'align': 'center',
          'is_co': 4
        },
        {
          'prop': 'company',
          'label': '公司名称',
          'align': 'center',
          'is_co': 4
        },
        {
          'prop': 'position',
          'label': '职位',
          'align': 'center',
          'is_co': 4
        },
        {
          'prop': 'industry',
          'label': '行业',
          'align': 'center',
          'is_co': 4
        },
        {
          'prop': 'turnover',
          'label': '营业规模',
          'align': 'center',
          'is_co': 4
        },
        {
          'prop': 'payerTotal',
          'label': '订单金额（元）',
          'align': 'center',
          'is_co': 4
        }
      ],
      goodsTypeArray: ['图片', '音频', '视频', '专栏', '大专栏', '线下课程']
    }
  },
  created() {
  },
  methods: {
    bqHandleSizeChange(val) {
      this.bqPageSize = val
    },
    bqHandleCurrentChange(val) {
      this.bqCurrent = val
    },
    setHandleSizeChange(val) {
      this.setPageSize = val
    },
    setHandleCurrentChange(val) {
      this.setCurrent = val
    },
    loadSetGoodsTableData() {
      this.setGoodsLoadding = true
      const params = {
        goodsName: '',
        isDelivered: ''
      }
      getSetGoodsList(params).then(res => {
        if (res.code === 1) {
          this.setGoodsLoadding = false
          this.setGoodsList = res.data
          this.setTotal = res.data.length
          this.setCurrent = 1
        }
      })
    },
    loadGoodsTableData() {
      this.addGoodsLoadding = true
      getGoodsList(this.addGoodSearch).then(res => {
        this.addGoodsLoadding = false
        this.addGoodsTableData = res.data
        this.addCurrent = 1
        this.addTotal = res.data.length
      })
    },
    loadScheduleData() {
      let isDeFlag = ''
      if (this.searchDataObject.isDelivered === '0') {
        isDeFlag = false
      }
      if (this.searchDataObject.isDelivered === '1') {
        isDeFlag = true
      }
      const params = {
        bqCurrent: 1,
        goodsName: this.searchDataObject.goodsName,
        isDelivered: isDeFlag,
        size: 1000
      }
      getScheduleDataList(params).then(res => {
        if (res.code === 1) {
          this.scheduleTableData = res.data.records
          this.bqCurrent = 1
          this.bqTotal = res.data.records.length
        }
      })
    },
    addHandleSizeChange(val) {
      this.AddPageSize = val
    },
    addHandleCurrentChange(val) {
      this.addCurrent = val
    },
    goodsSet() {
      this.goodsSetVisiable = true
      this.loadSetGoodsTableData()
    },
    addGoodsSet() {
      this.goodsSetVisiable = false
      this.goodsAddSetVisiable = true
      this.loadGoodsTableData()
    },
    cancelToEditBq() {
      this.addBqDialog = false
      this.banqiSetVisiable = true
    },
    handleAddGoods(val) {
      this.addGoodsChooseArray = val
    },
    banqSet() {
      this.banqiSetVisiable = true
      this.loadScheduleData()
    },
    addBqDialogMethod() {
      this.banqiSetVisiable = false
      this.addBqDialog = true
      this.loadSetGoodsTableData()
      this.form.className = ''
      this.form.classNumber = ''
      this.form.goodsId = ''
      this.isEdit = 0
      this.$refs['bqInsertFor'].resetFields()
    },
    searchForGoods() {
      this.loadScheduleData()
    },
    addSearchForGoods() {
      this.loadGoodsTableData()
    },
    deleteGoodsBtn() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择需要移除的数据！')
        return
      }
      this.$confirm('此操作将移除选中的商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const listArray = []
        this.multipleSelection.some(item => {
          listArray.push(item.id)
        })
        const params = {
          ids: listArray
        }
        deleteGoods(params).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            this.loadSetGoodsTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    chooseGoodsAdd() {
      if (this.addGoodsChooseArray.length <= 0) {
        this.$message.error('请选择需要设置的商品')
        return false
      }
      const listArray = []
      this.addGoodsChooseArray.some(item => {
        const obj = {}
        obj.goodsId = item.goodsId
        obj.goodsName = item.goodsName
        listArray.push(obj)
      })
      const params = {
        list: listArray
      }
      porductSettingList(params).then(res => {
        if (res.code === 1) {
          this.$message.success('增加成功！')
          this.goodsAddSetVisiable = false
          this.goodsSetVisiable = true
          this.$refs.addGoodsTable.clearSelection()
          this.loadSetGoodsTableData()
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(index, row) {
      this.$confirm('此操作将移除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const listArray = []
        listArray.push(row.id)
        const params = {
          ids: listArray
        }
        deleteGoods(params).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            this.loadSetGoodsTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editForBq(index, row, isBianji) {
      this.loadSetGoodsTableData()
      this.form.className = row.className
      this.form.classNumber = row.classNumber
      this.form.goodsId = row.goodsId
      this.form.classId = row.id
      this.banqiSetVisiable = false
      this.addBqDialog = true
      this.isEdit = 1
    },
    submitFormSetBq(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit === 0) {
            addClassSchedule(this.form).then(res => {
              if (res.code === 1) {
                this.$message.success('班期新增成功！')
                this.addBqDialog = false
                this.banqiSetVisiable = true
                this.loadScheduleData()
                this.$refs[formName].resetFields()
              }
            })
          } else if (this.isEdit === 1) {
            editClassSchedule(this.form).then(res => {
              if (res.code === 1) {
                this.$message.success('班期编辑成功！')
                this.addBqDialog = false
                this.banqiSetVisiable = true
                this.loadScheduleData()
                this.$refs[formName].resetFields()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    exportExcel() {
      if (this.search.time.label === 1) {
        this.search.startPayTime = this.search.time.value[0]
        this.search.endPayTime = this.search.time.value[1]
      }
      if (this.search.time.label === 2) {
        this.search.startSignedTime = this.search.time.value[0]
        this.search.endSignedTime = this.search.time.value[1]
      }
      if (this.search.order.label === 'orderNo') {
        this.search.orderNo = this.search.order.value
      }
      if (this.search.order.label === 'userName') {
        this.search.userName = this.search.order.value
      }
      if (this.search.order.label === 'userPhone') {
        this.search.userPhone = this.search.order.value
      }
      if (this.search.order.label === 'userId') {
        this.search.userId = this.search.order.value
      }

      exportData(this.search).then(res => {
        const tHeader1 = []
        const tHeader2 = []
        const propArr = []
        var columns = this.newColumns
        var data = res.data
        for (var i = 0; i < columns.length; i++) {
          if (columns[i].children) {
            tHeader1.push(columns[i].label)
            for (var j = 0; j < columns[i].children.length; j++) {
              tHeader2.push(columns[i].children[j].label)
              propArr.push(columns[i].children[j].prop)
              if (j > 0) {
                tHeader1.push('')
              }
            }
          } else {
            tHeader2.push(columns[i].label)
            propArr.push(columns[i].prop)
          }
        }
        const merges = []
        var filename = '直播交付数据导出' + new Date().getTime()
        var downEx = new this.ExportExcel2(data, tHeader2, tHeader1, merges, propArr, filename)
        downEx.export2Excel2()
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }

  }
}
</script>

<style lang="scss" scoped>
.tools-cont {
    margin-bottom: 20px
}
.table-cont-footer {
    margin-top: 20px;
    width: 100%;
}

.page-row {
  padding-top: 10px;
}

.page-row ::v-deep .el-pagination {
  text-align: right;
}

.tableinline {
  min-width: 300px;
  height: 60px;
  .image-previewer {
    margin-top: 10px;
    margin-right: 10px;
    height: 40px;
    float: left;
  }
  span {
    float: left;
    height: 50px;
    margin-top: 10px;
    width: 250px;
    p {
      margin: 0;
      height: 20px;
      line-height: 20px;
      width: 100%;
      overflow: hidden;
      em {
        font-style: normal;
        margin-left: 10px;
      }
    }
  }
}
</style>
