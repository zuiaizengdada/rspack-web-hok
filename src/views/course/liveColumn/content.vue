<template>
  <div class="content">
    <div class="content_header">
      <div class="header_left">
        <el-button v-permission="['web:content:add', permsList]" size="small" :loading="addBtnLoading" type="primary" @click="openSelectGoods()">添加商品</el-button>
      </div>
      <div class="header_right">
        <el-button size="small" class="m-r-10" @click="periodChange">
          {{ search.period.periodNum ? `${search.period.periodNum}期` : '选择期数' }}
        </el-button>
        <el-select v-model="shelveFlag" size="small" @change="init">
          <el-option label="全部" value="" />
          <el-option label="已上架" value="0" />
          <el-option label="已下架" value="1" />
          <el-option label="待上架" value="2" />
        </el-select>
        <el-input v-model.trim="contentName" size="small" class="w-200 m-l-10 m-r-10" clearable placeholder="请输入商品名称" @keyup.enter.native="init" @clear="init" />
        <el-button size="small" @click.native="clear">清空</el-button>
        <el-button size="small" @click.native="init">搜索</el-button>
      </div>
    </div>

    <div class="content_table">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        class="m-t-20"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column label="期数">
          <template slot-scope="{ row }">
            {{ row.periodNum || '-' }}期
          </template>
        </el-table-column>
        <el-table-column
          prop="contentName:"
          label="商品名称"
          min-width="280"
        >
          <template slot-scope="{ row }">
            <div class="fl goods-info-wrapper">
              <el-image
                class="m-r-10"
                style="width: 82px; height: 60px;border-radius: 4px;background: #F5F7FA"
                :src="row.coverUrl"
                fit="contain"
              />
              <div class="goods-info-detail">
                <div class="titleOptions">
                  {{ row.contentName }}
                </div>
                <div class="price-info">
                  <span v-if="row.saleType === 0" class="c_777">免费</span>
                  <span v-if="row.saleType === 1" class="c_777">￥{{ row.salePrice | filtersMoney }}</span>
                  <span v-if="[0, 1].includes(row.saleType) && [0, 1].includes(row.saleValidity)" class="c_777"> / </span>
                  <span v-if="row.saleValidity === 0" class="c_777">长期有效</span>
                  <span v-if="row.saleValidity === 1" class="c_777">有效期{{ row.validityDays }}天</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsType"
          label="类型"
          width="180"
        >
          <template slot-scope="{ row }">
            {{ ['图片', '音频', '视频', '专栏', '大专栏', '公开课', '一对一', '落地班'][row.goodsType] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="shelveFlag"
          label="上架状态"
          width="180"
        >
          <template slot-scope="{ row }">
            <AppStatus :status="['success', 'error'][row.shelveFlag]">
              <span>
                {{ ['已上架', '已下架', '待上架'][row.shelveFlag] }}
              </span>
            </AppStatus>
          </template>
        </el-table-column>
        <el-table-column
          prop="shelveTime"
          label="上架时间"
          width="180"
        />
        <el-table-column label="试看">
          <template slot-scope="{row}">
            <template v-if="permsList.includes('web:content:watch')">
              <el-checkbox v-if="row.goodsType !== 0" v-model="row.fragmentTrialFlag" :true-label="0" :false-label="1" @change="changefragmentTrialFlag(row)">设为试看</el-checkbox>
              <!-- <el-input />分钟为试看范围 -->
              <el-popover
                v-model="row.trialMinutevisible"
                placement="bottom"
                width="280"
              >
                <p>
                  视频前
                  <el-input v-model.trim="trialMinute" class="w-80" type="number" :min="0" />
                  分钟为试看范围
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="showtrialMinute(row)">取消</el-button>
                  <el-button type="primary" @click="sortshowtrialMinute(row)">确定</el-button>
                </div>
                <el-button v-show="row.fragmentTrialFlag===0 && row.goodsType !== 0" slot="reference" class="m-l-20" type="text" @click="sortChange = row.sort">试看{{ row.trialMinute }}分钟</el-button>
              </el-popover>
            </template>
            <template v-else>
              试看{{ row.trialMinute }}分钟
            </template>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="180">
          <template slot-scope="{ row }">
            <template v-if="permsList.includes('web:content:sort')">
              <el-popover
                v-model="row.visible"
                placement="bottom"
                width="240"
              >
                <p>
                  序号
                  <el-input v-model.trim="sortChange" class="w-80" type="number" :min="0" />
                  <el-tooltip class="item" effect="dark" content="序号越小越靠前" placement="top-start">
                    <i class="el-icon-info m-l-10" />
                  </el-tooltip>
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="showSort(row)">取消</el-button>
                  <el-button type="primary" @click="sort(row)">确定</el-button>
                </div>
                <el-button slot="reference" type="text" @click="sortChange = row.sort">{{ row.sort }}</el-button>
              </el-popover>
            </template>
            <template v-else>
              {{ row.sort }}
            </template>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="{ row }">
            <el-button v-permission="['web:content:edit', permsList]" type="text" @click="gotoEdit(row)">编辑</el-button>
            <el-button v-permission="['web:content:remove', permsList]" type="text" @click="_disassociateBatch(row)">移出</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <el-col :span="12">
          <div style="min-height: 52px">
            <el-button v-permission="['web:content:remove', permsList]" class="m-t-20" @click="allDisassociateBatch()">批量移出</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <el-pagination
            class="pagination"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>

    <appDialog v-model="dialog.visible" title="新增" width="600px" height="auto" @success="successFn">
      <div class="Dialog overflowOuto">
        <el-form ref="form" :model="dialog.form" label-width="80px" :rules="rule">
          <el-form-item label="期数" prop="periodNum">
            <el-button size="small" @click="selectPeriod">
              {{ dialog.form.periodNum ? `${dialog.form.periodNum}期` : '选择' }}
            </el-button>
          </el-form-item>
          <el-form-item label="商品" prop="goods">
            <el-button size="small" :loading="addBtnLoading" type="primary" @click="selectGoods">选择商品</el-button>
            <el-table :data="dialog.form.goodsList" style="width: 500px" max-height="380px" border>
              <el-table-column label="商品/素材">
                <template slot-scope="{ row }">
                  {{ row.materialName || row.contentName }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button type="text" @click="removeGoods(scope.$index)">移出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </appDialog>
  </div>
</template>

<script>
import { columPage, columnBatch, disassociateBatch, materialColumnSort, editGoods, getMaterialGoodsLiveList } from '@/api/course'
import AppStatus from '@/components/AppStatus'
import appDialog from '@/components/AppDialog'
export default {
  components: {
    AppStatus,
    appDialog
  },
  data() {
    return {
      loading: false,
      search: {
        period: { id: '', periodNum: '' } // 期数
      },
      shelveFlag: '',
      current: 1,
      size: 10,
      contentName: '',
      tableData: [],
      total: 0,
      multipleSelection: [],
      sortChange: '', // 排序
      trialMinute: '', // 试看分钟
      goodsIdList: [], // 已选中的素材id
      materialIdList: [], // 已选中的商品id
      addBtnLoading: false,
      permsList: this.$route.meta.permsList || [],
      dialog: {
        visible: false,
        form: {
          periodNum: '',
          livePeriodId: '',
          period: '',
          goodsList: []
        }
      },
      rule: {
        periodNum: [
          { required: true, message: '请选择期数', trigger: 'blur' }
        ],
        user: [
          { required: true, message: '请选人员', trigger: 'blur', type: 'array' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    changefragmentTrialFlag(row) {
      this.loading = true
      const data = {
        goodsId: row.goodsId,
        fragmentTrialFlag: row.fragmentTrialFlag
      }
      editGoods(data).then(res => {
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    showtrialMinute(row) {
      row.trialMinutevisible = false
    },
    sortshowtrialMinute(row) {
      if (!Number(this.trialMinute)) {
        return this.$message.error('试看时间需要大于0')
      }
      row.trialMinutevisible = false
      this.loading = true
      const data = {
        goodsId: row.goodsId,
        trialMinute: Number(this.trialMinute)
      }
      editGoods(data).then(res => {
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    showSort(row) {
      row.visible = false
    },
    sort(row) {
      row.visible = false
      this.loading = true
      const data = {
        goodsId: this.$route.params.id,
        smallMaterialId: row.goodsId,
        sort: this.sortChange
      }
      materialColumnSort(data).then(res => {
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.current = 1
      this.getList()
    },
    getList() {
      const params = {
        goodsId: this.$route.params.id,
        current: this.current,
        size: this.size,
        shelveFlag: this.shelveFlag,
        contentName: this.contentName,
        periodId: this.search.period.id
      }
      columPage(params).then(res => {
        console.log(res, '获取列表详情数据')
        this.tableData = res.data.records
        this.total = res.data.total
        this.getMaterialGoodsList()
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    selectGoods() {
      if (!this.dialog.form.livePeriodId) {
        return this.$message.error('请先选择期数!')
      }
      const check = this.materialIdList.concat(this.goodsIdList)
      const defaultValue = []
      this.dialog.form.goodsList.map(v => {
        defaultValue.push(v.goodsId || v.materialId)
      })
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check,
        defaultValue: defaultValue,
        tabList: [
          { id: '8', name: '视频素材', api: '' },
          { id: '9', name: '音频素材', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '1', name: '音频', api: '' },
          { id: '0', name: '图文', api: '' }
        ],
        currentId: '8',
        success: (res) => {
          console.log(res)
          res.map(v => {
            // eslint-disable-next-line no-unused-vars
            let type
            if (v.goodsId) {
              type = 1
            } else if (v.materialType) {
              type = v.materialType === 2 ? 2 : 3
            }
            v.type = type
          })
          this.dialog.form.goodsList = this.dialog.form.goodsList.concat(res)
        }
      })
    },
    _columnBatch(data) {
      this.loading = true
      columnBatch(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.dialog.visible = false
        this.search.period.id = this.dialog.form.livePeriodId
        this.search.period.periodNum = this.dialog.form.periodNum
        this.current = 1
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    gotoEdit(row) {
      console.log(row, 'row')
      const obj = {
        0: 'editImage',
        1: 'editAudio',
        2: 'editVideo',
        3: 'editColumn',
        4: 'editCollegeColumn',
        5: 'editOffline',
        6: 'editColumn'
      }
      // // window.open(window.location.origin + `#${obj[row.goodsType]}${row.goodsId}`, '_blank')
      // if (row.goodsType === 5) {
      //   window.open(window.location.origin + `#/course/offlineEdit/${row.goodsId}`, '_blank')
      // } else {
      //   }
      this.$AppEditGoods({
        type: obj[row.goodsType],
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getList()
        }
      })
    },
    // 移出商品
    _disassociateBatch(row) {
      this.$delModal({
        tips: '确定移出?',
        success: () => {
          this.loading = true
          const data = {
            list: [{
              smallMaterialId: row.goodsId,
              goodsId: this.$route.params.id
            }]
          }
          disassociateBatch(data).then(res => {
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    allDisassociateBatch() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('至少选择一项')
      }
      this.$delModal({
        tips: `确定移出这${this.multipleSelection.length}项?`,
        success: () => {
          this.loading = true
          const list = []
          this.multipleSelection.map(v => {
            list.push({
              smallMaterialId: v.goodsId,
              goodsId: this.$route.params.id
            })
          })
          const data = {
            list: list
          }
          disassociateBatch(data).then(res => {
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 根据商品id查询该商品下面那些素材/商品被选择了
    getMaterialGoodsList() {
      this.addBtnLoading = true
      this.goodsIdList = []
      this.materialIdList = []
      const params = {
        goodsId: this.$route.params.id,
        periodId: this.dialog.form.livePeriodId
      }
      getMaterialGoodsLiveList(params).then(res => {
        this.addBtnLoading = false
        this.goodsIdList = res.data.goodsIdList
        this.materialIdList = res.data.materialIdList
      }).catch(() => {
        this.addBtnLoading = false
      })
    },
    // 筛选条件处选择期数
    periodChange() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.$route.params.id },
        success: (res) => {
          this.search.period = res
          this.current = 1
          this.getList()
        }
      })
    },
    // 点击弹框确定按钮
    successFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const list = []
          this.dialog.form.goodsList.map(v => {
            list.push({
              materialId: v.materialId,
              periodId: this.dialog.form.livePeriodId,
              periodNum: this.dialog.form.periodNum,
              smallMaterialId: v.goodsId,
              type: v.type
            })
          })
          const data = {
            goodsId: this.$route.params.id,
            goodsType: 6,
            list
          }
          this._columnBatch(data)
        } else {
          return false
        }
      })
    },
    // 新增弹框选择期数
    selectPeriod() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.$route.params.id },
        success: (res) => {
          console.log(res)
          // this.dialog.form.livePeriodId = res.id
          // this.dialog.form.periodNum = res.periodNum
          this.$set(this.dialog.form, 'livePeriodId', res.id)
          this.$set(this.dialog.form, 'periodNum', res.periodNum)
          this.$refs.form.validateField('periodNum')
          this.getMaterialGoodsList()
        }
      })
    },
    // 点击打开选择商品弹框
    openSelectGoods() {
      this.dialog = {
        visible: true,
        form: {
          periodNum: this.search.period.periodNum,
          livePeriodId: this.search.period.id,
          period: '',
          goodsList: []
        }
      }
      this.getMaterialGoodsList()
    },
    // 弹框中移出选择的商品/素材
    removeGoods(index) {
      this.dialog.form.goodsList.splice(index, 1)
    },
    // 点击清空按钮
    clear() {
      this.search = {
        period: { id: '', periodNum: '' }
      }
      this.contentName = ''
      this.shelveFlag = ''
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
   .content_header {
       display: flex;
       justify-content: space-between;
       .header_left {
        }
        .header_right {

        }
   }
   .content_table {

       .pagination {
           margin-top: 20px;
           text-align: right;
       }
   }
}
.goods-info-wrapper {
  width: 100%;
  height: 60px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .goods-info-detail {
    line-height: 1.5;
    width: calc(100% - 82px);
    height: 100%;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .titleOptions {
      display: flex;
      width: 100%;
      // align-items: center;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
}
</style>
