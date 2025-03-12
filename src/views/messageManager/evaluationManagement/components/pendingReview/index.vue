
<template>
  <div class="table-container">
    <filterTop @search="handleSearch" />
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      list-key="records"
      immediate-check
      row-key="id"
      class="table"
      :get-list-api="getList"
      checkbox
      @selectionChange="handleSelectionChange"
    >
      <template #imgNum="{ row }">
        <el-button type="text" @click="handleClickImageView(row)">{{
          row.imgNum
        }}</el-button>
      </template>
      <template #footer>
        <el-button
          :disabled="!multipleSelection.length"
          type="text"
          size="small"
          @click="handleClick('recommend')"
        >设置为推荐</el-button>
        <el-button
          :disabled="!multipleSelection.length"
          type="text"
          size="small"
          @click="handleClick('stopRecommend')"
        >取消推荐</el-button>
        <el-button
          :disabled="!multipleSelection.length"
          type="text"
          size="small"
          @click="handleClick('process')"
        >审核通过</el-button>
        <el-button
          :disabled="!multipleSelection.length"
          type="text"
          size="small"
          @click="handleClick('stopProcess')"
        >审核不通过</el-button>
      </template>
      <template #isRecommend="{ row }">
        <el-switch
          v-model="row.isRecommend"
          :active-value="1"
          :inactive-value="0"
        />
      </template>
      <template #goodsName="{ row }">
        <div class="nameBox">
          <img :src="row.coverUrl" alt="" />
          {{ row.goodsName }}
        </div>
      </template>
      <template #orderNo="{ row }">
        {{ row.orderNo }}
        <i
          v-clipboard:copy="row.orderNo"
          v-clipboard:success="clipboardSuccess"
          class="el-icon-document-copy copy"
        />
      </template>
      <template #phone="{ row }">
        <watchPhoneNumber :default-value="row.phone" :phone-area-code="row.phoneAreaCode" :user-id="row.userId" />
      </template>
      <template #auditorState="{ row }">
        {{ $getdictName('AUDITOR_STATE', row.auditorState) }}
      </template>
      <template #level="{ row }">
        {{ $getdictName('LEVEL_GRADE', row.level) }}
      </template>
      <template #markContent="{ row }">
        <el-tooltip placement="top">
          <div slot="content" v-html="row.markContent" />
          <div class="testBox" v-html="row.markContent" />
        </el-tooltip>
      </template>
      <template #action="{ row }">
        <el-button
          type="text"
          @click="goDetail(row, 'order')"
        >订单详情</el-button>
        <!-- <el-button
          type="text"
          @click="goDetail(row, 'user')"
        >用户详情</el-button> -->
        <el-button
          type="text"
          @click="goDetail(row, 'goods')"
        >商品详情</el-button>
      </template>
    </dynamicTable>
    <imageViewer ref="imageViewer" />
    <!-- 弹框 -->
    <model
      :config.sync="config"
      :multiple-selection="multipleSelection"
      @handleOk="handleOk"
    />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import imageViewer from '@/components/AppTemplate/imageViewer/index'
import filterTop from '../filterTop'
import mixin from '../mixin'
import { getColumns } from './column'
import model from '../components/model'
import watchPhoneNumber from '@/views/deliver/components/watchPhoneNumber.vue'
import { evaluatePage } from '@/api/messageManagement/message'
export default {
  name: 'SpecialManagement',
  components: {
    dynamicTable,
    imageViewer,
    filterTop,
    model,
    watchPhoneNumber
  },
  mixins: [mixin],
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      multipleSelection: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  methods: {
    getList(params) {
      const res = evaluatePage(params)
      res.then(res => {
        this.$emit('setNum', res?.data?.total || 0)
      })
      return res
    },
    handleSearch(params) {
      this.$nextTick(() => {
        this.$refs.table.onRefresh({
          ...params,
          auditorState: 1
        })
      })
    },
    handleClickImageView(row) {
      if (row.files.length) this.$refs.imageViewer.open(row.files)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleProcess() {
      this.$delModal({
        tips: '确定解除绑定?',
        success: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  display: flex;
  flex-direction: column;
  .table {
    flex: 1;
  }
}
.nameBox {
  display: flex;
  > img {
    height: 60px;
    width: 60px;
  }
}
.copy {
  cursor: pointer;
}
.testBox {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 指定行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
