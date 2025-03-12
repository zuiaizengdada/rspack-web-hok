<template>
  <div class="content">
    <div class="content_header">
      <div class="header_left">
        <el-button
          v-permission="['web:content:add', permsList]"
          :loading="addBtnLoading"
          type="primary"
          @click="selectGoods()"
        >添加商品</el-button>
      </div>
      <div class="header_right">
        <!-- <el-select v-model="shelveFlag" @change="init">
          <el-option label="全部" value="" />
          <el-option label="已上架" value="0" />
          <el-option label="已下架" value="1" />
          <el-option label="待上架" value="2" />
        </el-select>
        <el-input
          v-model.trim="contentName"
          class="w-200 m-l-10 m-r-10"
          clearable
          placeholder="请输入商品名称"
          @keyup.enter.native="init"
          @clear="init"
        />
        <el-button @click.native="init">搜索</el-button> -->
      </div>
    </div>

    <div class="content_table">
      <el-table
        :key="key"
        border
        :data="tableData"
        style="width: 100%"
        class="m-t-20"
        @selection-change="handleSelectionChange"
        @cell-mouse-leave="handleCellMouseLearve"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="contentName:" label="视频" min-width="200">
          <template slot-scope="{ row }">
            <div class="fl goods-info-wrapper">
              <ImagePreviewer
                class="m-r-10"
                style="
                  width: 82px;
                  height: 60px;
                  border-radius: 4px;
                  background: #f5f7fa;
                "
                :src="row.materialFrameUrl"
                fit="contain"
              />
              <div class="goods-info-detail">
                <div
                  v-show="row.materialId !== isCell.materialId"
                  class="titleOptions"
                >
                  {{ row.materialName
                  }}<i
                    style="margin-left: 10px"
                    class="el-icon-edit"
                    @click="handleCellMouseEneter(row)"
                  />
                </div>
                <div v-show="row.materialId === isCell.materialId" class="InputBox">
                  <el-input
                    v-show="row.materialId === isCell.materialId"
                    v-model="isCell.materialName"
                  />
                  <el-button @click="handleClickStart(row)">保存</el-button>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" label="操作人">
          <template slot-scope="{ row }">
            {{ row.createByName }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column prop="updateByName" label="更新人">
          <template slot-scope="{ row }">
            {{ row.updateByName }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
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
            >批量移出</el-button>
          </div>
        </el-col>
        <el-col :span="12">
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  disassociateBatch,
  materialColumnSort,
  editGoods,
  columnBatchSort,
  getPakcageDouyinGoods,
  updatePackageGoodsName,
  addPakcageDouyinGoods,
  getPackageDouyinGoodsIds,
  removePackageDouyinGoods
} from '@/api/course'
import AppStatus from '@/components/AppStatus'
// import Sortable from 'sortablejs'
export default {
  components: {
    AppStatus
  },
  data() {
    return {
      id: '',
      key: 1,
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
      addBtnLoading: false,
      permsList: this.$route.meta.permsList || []
      // sortable: null
    }
  },
  created() {
    this.init()
  },
  methods: {
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
    // 调换顺序
    swapArrayElements(arr, indexA, indexB) {
      const temp = arr[indexA]
      arr[indexA] = arr[indexB]
      arr[indexB] = temp
    },
    rowDrop() {
    //   const tbody = document.querySelector('.content_table tbody')
    //   const _this = this
    //   this.sortable && this.sortable.destroy()
    //   if (tbody) {
    //     this.sortable = Sortable.create(tbody, {
    //       animation: 300,
    //       async onEnd({ newIndex, oldIndex }) {
    //         _this.swapArrayElements(_this.tableData, newIndex, oldIndex)
    //         const size = _this.current * _this.size - _this.size
    //         console.log(newIndex, oldIndex, _this.tableData)
    //         const dropList = _this.tableData.map((item, index) => ({
    //           sort: index + size,
    //           id: item.id
    //         }))
    //         try {
    //           await columnBatchSort(dropList)
    //           _this.getList()
    //         } catch (e) {
    //           console.log(e)
    //         }
    //       }
    //     })
    //   }
    },
    getList() {
      const params = {
        goodsId: this.$route.params.id,
        current: this.current,
        size: this.size,
        shelveFlag: this.shelveFlag,
        contentName: this.contentName
      }
      getPakcageDouyinGoods(params).then(res => {
        console.log(res, '获取列表详情数据')
        this.key++
        this.tableData = res.data.records
        this.total = res.data.total
        this.$nextTick(() => {
          this.rowDrop()
        })
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
      // const check = this.materialIdList.concat(this.goodsIdList)
      // console.log(44444, check)
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check: this.goodsIdList,
        tabList: [
          // { id: '2', name: '视频', api: '' },
          { id: '8', name: '视频素材', api: '' }
          // { id: '9', name: '音频素材', api: '' },
          // { id: '1', name: '音频', api: '' },
          // { id: '0', name: '图文', api: '' }
          // { id: '3', name: '普通专栏', api: '' },
          // { id: '4', name: '大专栏', api: '' },
          // { id: '7', name: '套餐课', api: '' }
        ],
        currentId: '8',
        success: res => {
          if (res.length === 0) {
            this.$message.error('至少选中1项')
            return true
          }
          const data = []
          res.map(v => {
            let type
            if (v.goodsId) {
              type = 1
            } else if (v.materialType) {
              type = v.materialType === 2 ? 2 : 3
            }
            data.push({
              materialId: v.materialId,
              smallMaterialId: v.goodsId,
              type
            })
          })
          this._columnBatch(data)
        }
      })
    },
    _columnBatch(res) {
      const data = {
        goodsId: this.$route.params.id,
        list: res
      }
      addPakcageDouyinGoods(data).then(res => {
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
            list: [
              {
                smallMaterialId: row.goodsId,
                goodsId: this.$route.params.id
              }
            ]
          }
          disassociateBatch(data)
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
      this.isCell = { ...val }
    },
    async handleCellMouseLearve(val) {
      if (this.isCell.goodsId) val.contentName = this.isCell.contentName
      // this.isCell = {}
    },
    async handleClickStart(val) {
      if (this.isCell.goodsId !== val.goodsId) return
      if (!val.materialName) {
        val.materialName = this.isCell.materialName
        this.$message.warning('请填写商品名称')
        this.isCell = {}
        return
      }
      if (this.isCell.materialName.length > 30) {
        this.$message.warning('名称不能操作30个字')
        return
      }
      const res = await updatePackageGoodsName({
        materialName: this.isCell.materialName,
        id: val.id
      })
      if (res.code === 1) {
        this.$message.success('修改成功')
        val.materiailName = this.isCell.materialName
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
            // list.push({
            //   smallMaterialId: v.goodsId,
            //   goodsId: this.$route.params.id
            // })
            list.push(v.id)
          })
          const data = {
            ids: list
          }
          removePackageDouyinGoods(data)
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
      getPackageDouyinGoodsIds(this.$route.params.id)
        .then(res => {
          console.log('====================')
          console.log(res)
          console.log('====================')
          this.addBtnLoading = false
          this.goodsIdList = res.data || []
        })
        .catch(() => {
          this.addBtnLoading = false
        })
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
