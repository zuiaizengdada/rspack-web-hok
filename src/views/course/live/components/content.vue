<template>
  <div class="content">
    <div class="content_header">
      <div class="header_left">
        <el-button
          v-permission="['web:content:add', permsList]"
          :loading="addBtnLoading"
          type="primary"
          @click="selectGoods()"
        >添加商品
        </el-button>
      </div>
      <div class="header_right">
        商品id:
        <el-input
          v-model="search.associateGoodsId"
          class="w-200 m-l-10 m-r-10"
          clearable
          placeholder="请输入商品id"
        />
        商品名称：
        <el-input
          v-model="search.goodsName"
          class="w-200 m-l-10 m-r-10"
          clearable
          placeholder="请输入商品名称"
          @keyup.enter.native="init"
          @clear="init"
        />
        <el-button type="primary" @click.native="init">搜索</el-button>
        <el-button @click.native="handleClear">重置</el-button>
      </div>
    </div>

    <div class="content_table">
      <el-table
        :key="key"
        border
        show-summary
        :data="tableData"
        style="width: 100%"
        class="m-t-20"
        :summary-method="getSummaries"
        @selection-change="handleSelectionChange"
        @cell-mouse-leave="handleCellMouseLearve"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="goodsType" label="商品ID">
          <template slot-scope="{ row }">
            {{ row.associateGoodsId }}
          </template>
        </el-table-column>
        <el-table-column prop="contentName:" label="商品名称">
          <template slot-scope="{ row }">
            {{ row.goodsName }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsType" label="课程类型" width="130">
          <template slot-scope="{ row }">
            {{ row.associateGoodsType | parsePackageGoodsType }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsType" label="原单价">
          <template slot-scope="{ row }">
            ¥ {{ row.originalPrice | filtersMoneyByZero }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsType" label="套餐单价">
          <template slot-scope="{ row }">
            <div v-show="row.associateGoodsId !== isCell.associateGoodsId" class="titleOptions">
              ¥ {{ row.packagePrice | filtersMoneyByZero }}
              <i
                style="margin-left: 10px"
                class="el-icon-edit"
                @click="handleCellMouseEneter(row)"
              />
            </div>
            <div v-show="row.associateGoodsId === isCell.associateGoodsId" class="InputBox">
              <el-input
                v-show="row.associateGoodsId === isCell.associateGoodsId"
                v-model="isCell.packagePrice"
              />
              <el-button @click="handleClickSavePrice(row)">保存</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsType" label="操作时间" width="180">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsType" label="操作人">
          <template slot-scope="{ row }">
            {{ row.updateByName }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button
              v-permission="['web:content:edit', permsList]"
              type="text"
              @click="gotoEdit(row)"
            >编辑
            </el-button>
            <el-button
              v-permission="['web:content:remove', permsList]"
              type="text"
              @click="_disassociateBatch(row)"
            >移出
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <el-col :span="12">
          <div style="min-height: 52px">
            <el-button
              v-permission="['web:content:remove', permsList]"
              class="m-t-20"
              @click="allDisassociateBatch()"
            >批量移出
            </el-button>
          </div>
        </el-col>
        <!-- <el-col :span="12">
          <el-pagination
            class="pagination"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40, 100]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  // getPackageGoodsList,
  materialColumnSort,
  editGoods,
  updatePackageGoodsPrice,
  removePackageGoods,
  addPakcageGoods,
  getPackageGoodsIds,
  getGoodsPackageAll
} from '@/api/course'
import { filtersMoneyByZero, parsePackageGoodsType } from '@/filters'

export default {
  data() {
    return {
      id: '',
      key: 1,
      search: { associateGoodsId: '', goodsName: '' },
      loading: false,
      isCell: {},
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
      packageTotalPrice: 0, // 当前商品总价
      addBtnLoading: false,
      permsList: this.$route.meta.permsList || [],
      sortable: null
    }
  },
  created() {
    this.init()
  },
  methods: {
    filtersMoneyByZero,
    parsePackageGoodsType,
    changefragmentTrialFlag(row) {
      this.loading = true
      const data = {
        materialId: row.goodsId,
        goodsId: this.id,
        fragmentTrialFlag: row.fragmentTrialFlag
      }
      editGoods(data)
        .then(res => {
          this.getList()
        })
        .catch(() => {
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
        materialId: row.goodsId,
        goodsId: this.id,
        trialMinute: Number(this.trialMinute)
      }
      editGoods(data)
        .then(res => {
          this.getList()
        })
        .catch(() => {
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
      materialColumnSort(data)
        .then(res => {
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.current = 1
      this.id = this.$route.params.id
      this.getList()
    },
    handleClear() {
      this.search = {}
      this.init()
    },
    getList() {
      this.loading = true
      const params = {
        goodsId: this.$route.params.id,
        // current: this.current,
        // size: this.size,
        ...this.search
        // shelveFlag: this.shelveFlag,
        // contentName: this.contentName
      }
      getGoodsPackageAll(params).then(res => {
        console.log(res, '获取列表详情数据')
        this.key++
        this.tableData = res.data
        this.total = res.data.length
        this.getMaterialGoodsList()
      }).catch(() => {
        this.loading = false
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
      const check = this.materialIdList.concat(this.goodsIdList)
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check: check,
        packagePrice: true,
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' }
        ],
        currentId: '3',
        packageChildren:  JSON.parse(JSON.stringify(this.tableData)),
        success: (res) => {
          if (res.length === 0) {
            this.$message.error('至少选中1项')
            return true
          }
          const data = []
          console.log(res)
          res.map(v => {
            // let type
            // if (v.goodsId) {
            //   type = 1
            // } else if (v.materialType) {
            //   type = v.materialType === 2 ? 2 : 3
            // }
            data.push({
              associateGoodsId: v.goodsId,
              associateGoodsType: v.goodsType,
              originalPrice: v.salePrice,
              packagePrice: (v.packagePrice || 0) * 100
            })
          })
          return this._columnBatch(data)
        }
      })
    },
    _columnBatch(res) {
      const data = {
        goodsId: this.$route.params.id,
        list: res
      }
      return addPakcageGoods(data).then(res => {
        this.current = 1
        this.getList()
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
        5: 'editOffline'
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
            ids: [row.id]
          }
          removePackageGoods(data)
            .then(res => {
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCellMouseEneter(val) {
      this.isCell = { ...val, packagePrice: val.packagePrice / 100 }
    },
    async handleCellMouseLearve(val) {
      if (this.isCell.goodsId) val.contentName = this.isCell.contentName
    },
    async handleClickSavePrice(val) {
      if (this.isCell.associateGoodsId !== val.associateGoodsId) return
      if (!this.isCell.packagePrice) {
        // val.packagePrice = this.isCell.packagePrice
        this.$message.warning('请填写套餐价格')
        this.isCell = {}
        return
      }
      if (!/^\d+(\.\d{1,2})?$/.test(this.isCell.packagePrice)) {
        this.$message.warning('请填写正确的价格')
        return
      }
      const req = {
        id: val.id,
        goodsId: val.goodsId,
        packagePrice: this.isCell.packagePrice * 100
      }
      const res = await updatePackageGoodsPrice(req)
      if (res.code === 1) {
        this.$message.success('修改成功')
        val.packagePrice = req.packagePrice
        this.getList()
      }
      this.isCell = {}
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
            list.push(v.id)
          })
          const data = {
            ids: list
          }
          removePackageGoods(data)
            .then(res => {
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 根据商品id查询该商品下面那些素材/商品被选择了
    getMaterialGoodsList() {
      this.addBtnLoading = true
      // const params = {
      //   goodsId: this.$route.params.id
      // }
      getPackageGoodsIds(this.$route.params.id)
        .then(res => {
          this.addBtnLoading = false
          this.goodsIdList = res.data.associateGoodsIds || []
          this.materialIdList = res.data.materialIdList || []
          this.packageTotalPrice = res.data.packageTotalPrice || 0
          this.loading = false
        })
        .catch(() => {
          this.addBtnLoading = false
          this.loading= false
        })
    },
    getSummaries(param) {
      const sums = []
      sums[0] = '总价'
      sums[5] = `¥ ${filtersMoneyByZero(this.packageTotalPrice)}`
      return sums
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

    .InputBox {
      display: flex;
    }
  }
}
</style>
