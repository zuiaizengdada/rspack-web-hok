<template>
  <div class="content">
    <div class="navList">
      <div class="navhead">
        <span>二级分组</span>
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="text"
          @click="handleAddGroup"
        >新增</el-button>
      </div>
      <div class="navcontent">
        <div
          v-for="item in groupingList"
          :key="item.id"
          :class="{ active: active === item.groupingId }"
          @click="handleItem(item)"
        >
          <span>{{ item.groupingName }}</span>
          <div>
            <el-button
              size="mini"
              type="text"
              @click.stop="handleEditGroup(item)"
            >
              编辑</el-button>
            <el-button size="mini" type="text" @click.stop="handleDelete(item)">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="contentList">
      <div class="content_header">
        <div class="header_left">
          <el-button
            type="primary"
            @click="selectGoods()"
          >添加商品</el-button>
        </div>
        <el-row style="width: 90%" type="flex" :gutter="8">
          <el-col :span="6">
            <el-input
              v-model="contentName"
              placeholder="商品名称"
              clearable
              @clear="getList"
            />
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="goodsId"
              placeholder="商品Id"
              clearable
              @clear="getList"
            />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="content_table">
        <el-table
          ref="myTable"
          v-loading="loading"
          border
          :data="tableData"
          height="100%"
          style="width: 100%"
          :loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="contentName:" label="商品名称" width="220">
            <template slot-scope="{ row }">
              <div class="fl goods-info-wrapper">
                <ImagePreviewer
                  class="m-r-10"
                  style="
                    width: 60px;
                    height: 60px;
                    border-radius: 4px;
                    background: #f5f7fa;
                  "
                  :src="row.coverVerticalUrl || row.coverUrl"
                  fit="fill"
                />
                <div class="goods-info-detail">
                  <div class="titleOptions">
                    {{ row.contentName }}
                  </div>
                  <div class="price-info">
                    <span
                      v-if="row.saleType && row.saleType === 0"
                      class="c_777"
                    >免费</span>
                    <span
                      v-if="row.saleType && row.saleType === 1"
                      class="c_777"
                    >￥{{ row.salePrice | filtersMoney }}</span>
                    <span
                      v-if="
                        row.saleType &&
                          [0, 1].includes(row.saleType) &&
                          [0, 1].includes(row.saleValidity)
                      "
                      class="c_777"
                    >
                      /
                    </span>
                    <span
                      v-if="row.saleValidity && row.saleValidity === 0"
                      class="c_777"
                    >长期有效</span>
                    <span
                      v-if="row.saleValidity && row.saleValidity === 1"
                      class="c_777"
                    >有效期{{ row.validityDays }}天</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsId" label="商品Id" width="180" />
          <el-table-column prop="goodsType" label="类型" width="180">
            <template slot-scope="{ row }">
              {{ goodsType_obj[row.goodsType] }}
            </template>
          </el-table-column>
          <el-table-column prop="tenantId" label="机构名称" width="120">
            <template slot-scope="{ row }">
              {{ row.tenantVO.tenantName || '-' }}
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
          <el-table-column prop="sort" label="序号" width="180">
            <template slot-scope="{ row }">
              <el-popover v-model="row.visible" placement="bottom" width="240">
                <p>
                  排列至第
                  <el-input v-model.trim="sortChange" class="w-80" />
                  位
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="showSort(row)">取消</el-button>
                  <el-button type="primary" @click="sort(row)">确定</el-button>
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  class="m-r-10"
                  @click="sortChange = row.sort || 0"
                >{{ row.sort }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="shelveTime" label="上架时间" width="180" />
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="{ row }">
              <!-- <el-button type="text" @click="gotoEdit(row)">编辑</el-button> -->
              <el-button
                type="text"
                @click="_disassociateBatch(row)"
              >移出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-button @click="allDisassociateBatch()">批量移出</el-button>
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
      </div>
    </div>
    <el-dialog
      title="二级分组在当前分组内不能重复"
      :visible.sync="dialogVisible"
      width="350px"
    >
      <el-form ref="form" :model="detailsData" label-width="80px">
        <el-form-item label="分组名称">
          <el-input
            v-model="detailsData.groupingName"
            placeholder="请输入二级分组名称"
            maxlength="10"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="detailsData.sort" :min="0" label="排序" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {
// // groupingList,
// // groupingRelationPage,
// // groupingRelationBatch,
// // groupingRelationDisassociate,
// // groupingSort,
// // addGrouping,
// // updateSortBatch
// // groupingEdit,
// // groupingDel
// } from '@/api/shop'
import {
  selectPfHomePageLevelList,
  selectLevel2,
  insert,
  update,
  del,
  selectPageHomePageGoods,
  delGoods,
  insertGoods,
  updateSortGoods
} from '@/api/platform/homeSetting'
// import draggable from 'vuedraggable'
import AppStatus from '@/components/AppStatus'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    AppStatus
    // draggable
  },
  data() {
    return {
      // groupingId: 'b8451ff62b494cd583c5e1cba93d6200',
      active: undefined,
      detailsData: { groupingName: '', type: 1, sort: 1 },
      // id: '17',
      groupingList: [],
      dialogVisible: false,
      loading: false,
      shelveFlag: '',
      current: 1,
      size: 10,
      contentName: '',
      tableData: [],
      total: 0,
      sortChange: '', // 排序的目标值
      multipleSelection: [],
      parentId: '',
      goodsId: ''
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj']),
    ...mapState({
      recommendActive: state => state.homePageSetting.recommendActive,
      groupingId: state => state.homePageSetting.groupId.like,
      id: state => state.homePageSetting.groupId.recommendId
    })
  },
  watch: {
    recommendActive: {
      handler(val) {
        this.active = val
        this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.groupingId = this.$route.params.id
    // this.id = this.$route.query.id
    this.init()
  },
  methods: {
    resetQuery() {
      this.current = 1
      this.contentName = ''
      this.goodsId = ''
      this.getList()
    },
    handleAddGroup() {
      if (this.groupingList.length >= 7) {
        return this.$message.warning('最多添加七个二级分组')
      }
      this.dialogVisible = true
      this.detailsData = {
        groupingName: '',
        type: 1,
        parentId: this.parentId,
        sort: 1
      }
    },
    handleEditGroup(data) {
      this.dialogVisible = true
      this.detailsData = { ...data, type: 2, sort: data.sort }
    },
    handleItem(data) {
      this.active = data.groupingId
      this.$store.commit('homePageSetting/SET_recommendActive', data.groupingId)
      this.getList()
    },
    handleDelete(data) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          del(data.groupingId)
            .then(() => {
              console.log(this.active, data.groupingId)
              if (this.active === data.groupingId) {
                this.active = undefined
                return this.init()
              }
              this.getGroupingList()
            })
            .catch(() => {})
        }
      })
    },
    async handleAddSubmit() {
      if (!this.detailsData.groupingName) {
        return this.$message.warning('请填写分组名称')
      }
      this.detailsData.type === 1
        ? await insert({
          levelName: this.detailsData.groupingName,
          parentId: this.detailsData.parentId,
          sort: 1
        })
        : await update({
          id: this.detailsData.id,
          levelName: this.detailsData.groupingName,
          parentId: this.detailsData.parentId,
          sort: this.detailsData.sort
        })
      this.$message.success(
        this.detailsData.type === 1 ? '新增分组成功' : '修改分组程'
      )
      this.dialogVisible = false
      this.getGroupingList()
    },
    getGroupingList() {
      this.$store.commit('homePageSetting/SET_refreshActive', 1)
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async resolve => {
        const parentRes = await selectPfHomePageLevelList()
        const infoParent = parentRes.data.find(f => f.levelName === '爆款推荐')
        console.log(infoParent, 'infoParent')
        this.parentId = infoParent?.id
        console.log(this.parentId, 'this.parentId')

        const res = await selectLevel2({ id: this.parentId })
        if (res.code === 1) {
          this.groupingList = res.data.map(m => ({
            ...m,
            groupingId: m.id,
            groupingName: m.levelName
          }))
          if (!this.active) this.active = res?.data[0]?.groupingId
          resolve()
        }
      })
    },
    async init() {
      await this.getGroupingList()
      this.getList()
    },
    getList() {
      if (!this.groupingList.length) return
      this.loading = true
      const params = {
        homePageLevelId2: this.active ?? this.groupingList[0].groupingId,
        pageIndex: this.current,
        pageSize: this.size,
        contentName: this.contentName,
        goodsId: this.goodsId
      }
      selectPageHomePageGoods(params).then(res => {
        console.log(res.data)
        this.tableData = res.data.items
        this.total = res.data.total

        this.$nextTick(() => {
          this.$refs.myTable.doLayout()
          this.loading = false
        })
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
      if (!this.groupingList.length) {
        this.$message.warning('请先添加二级分组')
        return
      }
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check: this.tableData,
        tabList: [
          // { id: '0', name: '图文', api: '' },
          // { id: '1', name: '音频', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        currentId: '3',
        isPlaform: true,
        success: res => {
          const data = []
          res.map(v => {
            data.push({
              // groupingId: this.active ?? this.groupingList[0].groupingId,
              goodsId: v.goodsId
            })
          })
          this._columnBatch(data)
        }
      })
    },
    _columnBatch(res) {
      const data = {
        homePageLevelId: this.parentId,
        homePageLevelId2: this.active ?? this.groupingList[0].groupingId,
        pageGoodsListReq: res
      }
      insertGoods(data).then(res => {
        this.current = 1
        this.getList()
        this.refresh()
      })
    },
    gotoEdit(row) {
      console.error(row, 'row')
      // const obj = {
      //   0: '/course/imageEdit/',
      //   1: '/course/audioEdit/',
      //   2: '/course/videoEdit/',
      //   3: '/course/columnEdit/',
      //   4: '/course/collegeColumnEdit/',
      //   5: '/course/offlineEdit/'
      // }
      // this.$router.push({ path: obj[row.goodsType] + row.goodsId })

      // console.log(row, 'row')
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
          this.refresh()
          this.getList()
        }
      })
    },
    handleDragEnd(val) {
      console.log(val.newIndex)
      const data = this.groupingList.map((item, index) => ({
        id: item.id,
        sort: index + 1
        //  id: this.detailsData.id,
        // levelName: this.detailsData.groupingName,
        // parentId: this.detailsData.parentId
      }))
      console.log('222')
      update(data).then(() => {
        console.log('1111')
        this.$store.commit('homePageSetting/SET_refreshActive', 1)
      })
    },
    // 移出商品
    _disassociateBatch(row) {
      this.$delModal({
        tips: '确定移出?',
        success: () => {
          this.loading = true
          // const data = {
          //   groupingId: this.active ?? this.groupingList[0].groupingId,
          //   list: [
          //     {
          //       goodsId: row.goodsId,
          //       groupingId: this.active ?? this.groupingList[0].groupingId
          //     }
          //   ]
          // }
          delGoods({ ids: [row.id] })
            .then(res => {
              this.getList()
              this.refresh()
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
            // list.push({
            //   goodsId: v.goodsId,
            //   groupingId: this.active ?? this.groupingList[0].groupingId
            // })
            list.push(v.id)
          })
          // const data = {
          //   groupingId: this.active ?? this.groupingList[0].groupingId,
          //   list: list
          // }
          delGoods({ ids: list })
            .then(res => {
              this.refresh()
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 商品展示排序弹框
    showSort(row) {
      row.visible = false
      this.sortChange = row.sort
    },
    // 商品排序
    sort(row) {
      row.visible = false
      this.loaidng = true
      const params = {
        // groupingId: this.active ?? this.groupingList[0].groupingId,
        id: row.id,
        sort: this.sortChange
      }
      updateSortGoods(params)
        .then(res => {
          this.refresh()
          this.getList()
        })
        .catch(() => {
          this.loaidng = false
        })
    },
    refresh() {
      this.$store.commit('homePageSetting/SET_refreshActive', 2)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  display: flex;
  .active {
    background: #e9e9e9;
  }
  .navList {
    width: 200px;
    max-width: 200px;
    min-width: 200px;
    border-right: 1px solid #ccc;
    padding-right: 10px;
    height: 100%;
    overflow: auto;
    .navhead {
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .navcontent {
      margin-top: 20px;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        margin-bottom: 5px;
        cursor: pointer;
      }
    }
  }
  .contentList {
    // flex: 1;
    // width: 100%;
    width: calc(100% - 200px);
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    .content_header {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      .header_left {
      }
      .header_right {
      }
    }
    .content_table {
      flex: 1 0 0;
    }
    .pagination {
      display: flex;
      align-items: center;
      padding: 10px;
      justify-content: space-between;
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
::v-deep {
  .el-table__fixed-body-wrapper {
    border-bottom: 1px solid #dfe6ec;
  }
}
</style>
