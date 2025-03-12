<template>
  <div class="content">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref" />
    <ZBTable
      ref="zbTableRef"
      height="515px"
      style="margin-top: 20px"
      :columns="columns"
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:content="{ scope }">
        <div class="text-clamp">
          {{ scope.row.content }}
        </div>
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          type="text"
          @click="edit(scope.row)"
          v-permission="['btn:sensitive:groupTp:edit', permsList]"
        >
          编辑
        </el-button>
        <el-button
          type="text"
          class="red"
          @click="del(scope.row)"
          v-permission="['btn:sensitive:groupTp:delete', permsList]"
        >
          删除
        </el-button>
      </template>
      <template #footer>
        <el-button
          size="small"
          @click="allChange(0)"
          v-permission="['btn:sensitive:groupTp:deletes', permsList]"
          >批量删除</el-button
        >
      </template>
    </ZBTable>
    <ImportDialog ref="ImportDialogRef" @search="searchFn" />
    <AddDialog ref="AddDialogRef" @search="searchFn" />
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { cloneDeep } from 'lodash'
import { copy } from '@/utils'
import ImportDialog from '../common/importDialog.vue'
import AddDialog from '../common/addDialog.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns } from './columns'

import { groupConfig } from '../../data.js'

import {
  getSensitiveGroupPageApi,
  sensitiveGroupsDelApi
} from '@/api/liveRoom/sensitive.js'
export default {
  components: { HokSearchForm, ImportDialog, AddDialog, ZBTable },
  filters: {
    rowOptionsFt(value, Arr, key = 'value', label = 'label') {
      for (const item of Arr) {
        if (value === item[key]) return item[label]
      }
      return value
    }
  },
  data() {
    return {
      columns,
      permsList: this.$route.meta.permsList || [],
      formOpts: {
        ...cloneDeep(groupConfig.form),
        operatorList: [
          {
            label: '搜索',
            fn: () => {
              this.searchFn()
            }
          },
          {
            label: '重置',
            fn: () => {
              this.searchFn(true)
            },
            type: 'plain',
            bind: { plain: true }
          },
          {
            label: '导入',
            fn: this.importBtn,
            type: 'plain',
            bind: { plain: true },
            className: ['right'],
            permission: 'btn:sensitive:groupTp:lead'
          },
          {
            label: '新增敏感词',
            fn: this.add,
            className: ['right'],
            permission: 'btn:sensitive:groupTp:add'
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      options: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    allChange(index) {
      switch (index) {
        case 0:
          this.del()
          break
      }
    },
    del(row) {
      let list = []
      if (row) {
        list.push(row)
      } else {
        list = this.multipleSelection
      }
      if (list.length < 1) {
        return this.$message.warning('请先选择')
      }
      const that = this
      this.$delModal({
        tips: `确定删除【${list
          .map(item => item.groupName)
          .join('、')}】敏感词?`,
        success: async () => {
          that.loading = true
          try {
            const groupIds = list.reduce((t, v) => [...t, v.groupId], [])
            await sensitiveGroupsDelApi({ groupIds })
            that.searchFn()
          } catch (error) {
            this.$message.error('error')
          }
          that.loading = false
        }
      })
    },
    add() {
      this.$refs.AddDialogRef.openDialog({ type: 'add', sceneType: 3 })
    },
    edit(row) {
      this.$refs.AddDialogRef.openDialog({
        type: 'edit',
        form: {
          sceneType: 3,
          groupId: row.groupId,
          groupName: row.groupName,
          content: row.content.split(','),
          id: row.id
        }
      })
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = { sceneType: 3 }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    async getList() {
      return getSensitiveGroupPageApi({
        ...this.tableConfig,
        ...this.formOpts.formData
      })
    },
    clearFn() {
      this.formOpts.ref.resetFields()
      this.formOpts.formData = cloneDeep(groupConfig.form.formData)
      // this.couponTypeChange()
      this.searchFn()
    },
    goDetail(row) {
      console.log('this.$route.path--', this.$route.path)
      this.$router.push({
        name: 'CouponCenterDetails',
        query: {
          prevPath: this.$route.path + '?active=audit',
          couponNo: row.couponNo
        }
      })
    },
    importBtn() {
      this.$refs.ImportDialogRef.openDialog({ sceneType: 3 })
    },
    couponTypeChange() {
      this.formOpts.formData.couponName = undefined
      this.formOpts.formData.couponNo = undefined
    },
    copyBtn(txt) {
      copy(txt)
      this.$message.success('复制成功')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
    // MPageLayout --end
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 20px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  .text-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; // 限制为两行
    overflow: hidden; // 隐藏溢出内容
    text-overflow: ellipsis; // 使用省略号表示溢出
  }
  .pd20 {
    padding: 20px;
  }
  .pl10 {
    padding-left: 10px;
  }
  .icon-copy {
    cursor: pointer;
  }
  .coupon-table {
    flex: 1;
    overflow: hidden;
    .title {
      color: #161616;
      font-family: 'PingFang SC';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
    }
    .txt {
      color: #161616;
      font-family: 'PingFang SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
    .blue-desc {
      color: #0c6fff;
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }
    .orange-desc {
      color: #ff7d00;
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }
    .grey-desc {
      color: #999999;
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }
    .audit-status-box {
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      padding: 0 10px;
      display: inline-block;
      position: relative;
      &.audit-status1 {
        padding-left: 24px;
        color: #ff7d00;
        flex-shrink: 0;
        border-radius: 12px;
        background: #fff2e6;
        &::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          height: 12px;
          width: 12px;
          background: url('~@/assets/image/coupon/icn_chushen.png') no-repeat;
          background-size: 100%;
        }
      }
      &.audit-status2 {
        padding-left: 24px;
        color: #f53f3f;
        flex-shrink: 0;
        border-radius: 12px;
        background: #feecec;
        &::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          height: 12px;
          width: 12px;
          background: url('~@/assets/image/coupon/icn_bohui.png') no-repeat;
          background-size: 100%;
        }
      }
      &.audit-status3 {
        padding-left: 24px;
        color: #00b42a;
        flex-shrink: 0;
        border-radius: 12px;
        background: #e6f7ea;
        &::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          height: 12px;
          width: 12px;
          background: url('~@/assets/image/coupon/icn_check.png') no-repeat;
          background-size: 100%;
        }
      }
    }
    :v-deep .page_footer {
      justify-content: flex-end;
    }
  }
  .two-min-select {
    flex-shrink: 0;
    box-sizing: border-box;
    border-right: 1px solid #dcdee1;
    &.w102 {
      width: 102px !important;
    }
  }
}
::v-deep {
  .select-teacher {
    flex: 1;
    .el-select__tags .el-tag {
      background: #e7f0ff;
      color: #0c6fff;
    }
  }
  .el-table {
    th.el-table__cell > .cell {
      font-weight: 600;
    }
    .cell {
      font-weight: 450;
      font-size: 14px;
      color: #333;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
