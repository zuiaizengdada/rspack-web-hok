<template>
  <div class="content">
    <div class="content_header">
      <div class="header_left">
        <el-button
          v-permission="['web:content:add', permsList]"
          :loading="addBtnLoading"
          type="primary"
          @click="selectGoods()"
          >添加商品</el-button
        >
      </div>
      <div class="header_right">
        <el-select v-model="shelveFlag" @change="init">
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
        <el-button @click.native="init">搜索</el-button>
      </div>
    </div>

    <div class="content_table">
      <el-table
        v-loading="loading"
        border
        :data="tableData"
        style="width: 100%"
        class="m-t-20"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="contentName:" label="商品名称" min-width="280">
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
                :src="row.coverUrl"
                fit="contain"
              />
              <div class="goods-info-detail">
                <div class="titleOptions">
                  {{ row.contentName }}
                </div>
                <div class="price-info">
                  <span v-if="row.saleType === 0" class="c_777">免费</span>
                  <span v-if="row.saleType === 1" class="c_777"
                    >￥{{ row.salePrice | filtersMoney }}</span
                  >
                  <span
                    v-if="
                      [0, 1].includes(row.saleType) &&
                      [0, 1].includes(row.saleValidity)
                    "
                    class="c_777"
                  >
                    /
                  </span>
                  <span v-if="row.saleValidity === 0" class="c_777"
                    >长期有效</span
                  >
                  <span v-if="row.saleValidity === 1" class="c_777"
                    >有效期{{ row.validityDays }}天</span
                  >
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsType" label="类型" width="180">
          <template slot-scope="{ row }">
            {{
              [
                '图片',
                '音频',
                '视频',
                '专栏',
                '大专栏',
                '公开课',
                '一对一',
                '落地班'
              ][row.goodsType]
            }}
          </template>
        </el-table-column>
        <el-table-column prop="shelveFlag" label="上架状态" width="180">
          <template slot-scope="{ row }">
            <AppStatus :status="['success', 'error'][row.shelveFlag]">
              <span>
                {{ ['已上架', '已下架', '待上架'][row.shelveFlag] }}
              </span>
            </AppStatus>
          </template>
        </el-table-column>
        <el-table-column prop="shelveTime" label="上架时间" width="180" />
        <el-table-column label="试看">
          <template slot-scope="{ row }">
            <template v-if="permsList.includes('web:content:watch')">
              <el-checkbox
                v-if="row.goodsType !== 0"
                v-model="row.fragmentTrialFlag"
                :true-label="0"
                :false-label="1"
                @change="changefragmentTrialFlag(row)"
                >设为试看</el-checkbox
              >
              <!-- <el-input />分钟为试看范围 -->
              <el-popover
                v-model="row.trialMinutevisible"
                placement="bottom"
                width="280"
              >
                <p>
                  视频前
                  <el-input
                    v-model.trim="trialMinute"
                    class="w-80"
                    type="number"
                    :min="0"
                  />
                  分钟为试看范围
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="showtrialMinute(row)"
                    >取消</el-button
                  >
                  <el-button type="primary" @click="sortshowtrialMinute(row)"
                    >确定</el-button
                  >
                </div>
                <el-button
                  v-show="row.fragmentTrialFlag === 0 && row.goodsType !== 0"
                  slot="reference"
                  class="m-l-20"
                  type="text"
                  @click="sortChange = row.sort"
                  >试看{{ row.trialMinute }}分钟</el-button
                >
              </el-popover>
            </template>
            <template v-else> 试看{{ row.trialMinute }}分钟 </template>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="180">
          <template slot-scope="{ row }">
            <template v-if="permsList.includes('web:content:sort')">
              <el-popover v-model="row.visible" placement="bottom" width="240">
                <p>
                  序号
                  <el-input
                    v-model.trim="sortChange"
                    class="w-80"
                    type="number"
                    :min="0"
                  />
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="序号越小越靠前"
                    placement="top-start"
                  >
                    <i class="el-icon-info m-l-10" />
                  </el-tooltip>
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="showSort(row)">取消</el-button>
                  <el-button type="primary" @click="sort(row)">确定</el-button>
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  @click="sortChange = row.sort"
                  >{{ row.sort }}</el-button
                >
              </el-popover>
            </template>
            <template v-else>
              {{ row.sort }}
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button
              v-permission="['web:content:edit', permsList]"
              type="text"
              @click="gotoEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['web:content:remove', permsList]"
              type="text"
              @click="_disassociateBatch(row)"
              >移出</el-button
            >
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
              >批量移出</el-button
            >
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
  </div>
</template>

<script>
import {
  getOfflineContent,
  addOfflineContent,
  delOfflineContent,
  materialColumnSort,
  editGoods,
  getMaterialGoodsList
} from '@/api/course'
import AppStatus from '@/components/AppStatus'
export default {
  components: {
    AppStatus
  },
  data() {
    return {
      loading: false,
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
        goodsId: row.goodsId,
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
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        goodsId: this.$route.params.id,
        current: this.current,
        size: this.size,
        shelveFlag: this.shelveFlag,
        contentName: this.contentName
      }
      getOfflineContent(params)
        .then(res => {
          console.log(res, '获取列表详情数据')
          this.tableData = res.data.records || []
          this.total = res.data.total
          this.getMaterialGoodsList()
        })
        .catch(() => {
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
      const currentId = this.tableData?.length && this.tableData[0].goodsType
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check: check,
        sameSelected: true,
        tabList:
          currentId === 2
            ? [
                { id: '8', name: '视频素材', api: '' },
                { id: '2', name: '视频', api: '' },
                { id: '3', name: '普通专栏', api: '', disabled: true }
              ]
            : currentId === 3
            ? [
                { id: '8', name: '视频素材', api: '', disabled: true },
                { id: '2', name: '视频', api: '', disabled: true },
                { id: '3', name: '普通专栏', api: '' }
              ]
            : [
                { id: '8', name: '视频素材', api: '' },
                { id: '2', name: '视频', api: '' },
                { id: '3', name: '普通专栏', api: '' }
              ],
        currentId: currentId === 3 ? '3' : '8',
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
      addOfflineContent(data).then(res => {
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
          delOfflineContent(data)
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
          delOfflineContent(data)
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
      const params = {
        goodsId: this.$route.params.id
      }
      getMaterialGoodsList(params)
        .then(res => {
          this.addBtnLoading = false
          this.goodsIdList = res.data?.goodsIdList || []
          this.materialIdList = res.data?.materialIdList || []
          this.loading = false
        })
        .catch(() => {
          this.addBtnLoading = false
          this.loading = false
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
  }
}
</style>
