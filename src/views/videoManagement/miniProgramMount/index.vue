<template>
  <div class="page_wrap">
    <div class="page_wrap_header">
      <el-form
        slot="headerRight"
        class="header-form"
        :inline="true"
        size="small"
      >
        <el-form-item label="IP">
          <teacherSelect v-model="form.lecturerId" style="width: 160px" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model.trim="form.contentName"
            placeholder="请输入商品名称"
            clearable
            @clear="handerSearch"
            @keyup.enter.native="handerSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handerSearch"
          >搜索</el-button>
          <!-- <el-button   @click="$message('暂不支持')">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="page_table">
      <dynamicTable
        ref="table"
        v-model="tableData"
        :columns="columns"
        :get-list-api="getList"
      >
        <template slot="action" slot-scope="{ row }">
          <el-button
            type="text"
            @click="getLink(row,1)"
          >生成直播链接</el-button>
          <el-button
            type="text"
            @click="getLink(row,2)"
          >生成投放链接</el-button>
          <el-button
            type="text"
            @click="handleOpenLog(row)"
          >生成日志</el-button>
        </template>
        <template slot="contentName" slot-scope="{ row }">
          <div class="fl goods-info-wrapper">
            <ImagePreviewer
              class="m-r-10 "
              style="
              width: 60px;
              height: 60px;
              border-radius: 4px;
              background: #f5f7fa;
            "
              :src="row.coverVerticalUrl"
              fit="contain"
              :preview-src-list="getPreviewList(row)"
            />
            <div class="goods-info-detail">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.contentName"
                placement="top"
              >
                <div class="titleOptions" @click="gotoDetail(row)">
                  {{ row.contentName }}
                </div>
              </el-tooltip>
              <div style="display: flex">
                <span style="float: left; width: 20px">ID:</span>
                <span class="fuzhi-font">{{ row.goodsId }}</span>
                <img
                  title="复制商品Id"
                  style="
                  float: left;
                  cursor: pointer;
                  margin-top: 4px;
                  width: 14px;
                  height: 14px;
                  font-style: normal;
                  margin-left: 10px;
                "
                  src="~@/assets/image/coupon/icn_copy.png"
                  @click="handleCopy(row.goodsId)"
                />
              </div>
              <div class="price-info">
                <span v-if="row.saleType === 0" class="c_777">免费</span>
                <span
                  v-if="row.saleType === 1"
                  class="c_777"
                >￥{{ row.salePrice | filtersMoney }}</span>
                <span
                  v-if="
                    [0, 1].includes(row.saleType) &&
                      [0, 1].includes(row.saleValidity)
                  "
                  class="c_777"
                >
                  /
                </span>
                <span v-if="row.saleValidity === 0" class="c_777">长期有效</span>
                <span
                  v-if="row.saleValidity === 1"
                  class="c_777"
                >有效期{{ row.validityDays }}天</span>
                <span
                  v-if="row.shelveHideFlag === 1"
                  class="c_777 m-l-10"
                >已隐藏</span>
              </div>
            </div>
          </div>
        </template>
      </dynamicTable>
    </div>
    <modal ref="modal" />
    <log-dialog ref="logDialog" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import teacherSelect from '@/components/AppTemplate/teacherSelect/index'
import modal from './components/modal'
import { goodsType } from '@/utils/enum'
import {
  goodsMountPage
} from '@/api/course'
import { copy } from '@/utils/index'
import logDialog from './components/logDialog'
export default {
  components: {
    dynamicTable,
    teacherSelect,
    modal,
    logDialog
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'contentName', width: 380, label: '商品名称', type: 'slot' },
        { prop: 'lecturerName', label: 'IP', type: 'text', slotFn: (row) => row.lecturerVos?.map(i => i.lecturerName).join('、') },
        { prop: 'salePrice', label: '价格', type: 'text', slotFn: row => this.getSalePrice(row) },
        { prop: 'goodsType', label: '课程类型', type: 'text', slotFn: (row) => goodsType[row.goodsType] },
        { prop: 'appName', label: '抖音小程序名称', type: 'text' },
        { prop: 'appId', label: '小程序ID', type: 'text' },
        { prop: 'action', width: 300, label: '操作', type: 'slot' }
      ],
      loading: false,
      permsList: this.$route.meta.permsList || [],
      form: {
        contentName: '',
        lecturerId: ''
      }
    }
  },
  mounted() {
    this.handerSearch()
  },
  methods: {
    getSalePrice(row) {
      if (row.goodsType === 5) {
        if (!row.maxSalePrice) {
          return row.salePrice ? (row.salePrice / 100).toFixed(2) : '免费'
        }
        return row.salePrice ? `${(row.salePrice / 100).toFixed(2)} ~ ${(row.maxSalePrice / 100).toFixed(2)}` : '免费'
      }
      return row.salePrice ? (row.salePrice / 100).toFixed(2) : '免费'
    },
    getPreviewList(row) {
      return [row.coverVerticalUrl]
    },
    handerSearch() {
      this.$refs.table.config.pageIndex = 1
      this.$refs.table.onRefresh()
    },
    handleCopy(val) {
      copy(val)
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    async getList(params) {
      const originInfoString = localStorage.getItem('orgInfo')
      const originInfo = JSON.parse(originInfoString)
      const tenantId = String(originInfo.organizationId)
      return goodsMountPage({
        ...params,
        current: params.pageIndex,
        size: params.pageSize,
        pageIndex: undefined,
        pageSize: undefined,
        tenantId,
        lecturerId: this.form.lecturerId,
        contentName: this.form.contentName
      }).then(res => {
        res.data.items = res.data.records
        return res
      })
    },
    getLink(row, type) {
      this.$refs.modal.open(row, type)
    },
    // 点击编辑按钮
    handleOpenLog(row) {
      this.$refs.logDialog.open(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap ::v-deep {
  height: calc(100vh - 200px);
  background: #fff;
  border-radius: 5px;
  min-width: 1200px;
  overflow: auto;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
    0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  .filter-container {
    padding: 0px;
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
      width: 100%;
      // align-items: center;
      max-width: 90%;
      max-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
}
  .page_wrap_header {
    padding-left: 20px;
    padding-right: 20px;
    font-weight: bold;
    .header_wrap {
      padding-bottom: 20px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #e7e7e7;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
    .header-form {
      display: flex;
      align-items: center;
      height: 50px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
  .page_table {
    height: calc(100% - 50px);
    padding: 6px 20px;
  }
}
::v-deep {
  .page_header {
    padding: 0 !important;
    min-height: 0 !important;
  }
  .my-table {
    margin: 0 !important;
  }
  .tablePage .page_footer {
    box-shadow: none;
  }
}
</style>
