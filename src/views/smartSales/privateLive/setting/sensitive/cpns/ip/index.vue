<template>
  <div class="content">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref">
      <template #groupId>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.groupId"
            style="font-size: 14px"
            class="select-teacher"
            filterable
            clearable
            remote
            :remote-method="ipQueryByName"
            :popper-append-to-body="false"
            placeholder="请搜索选择IP老师"
            @change="ipChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
    </HokSearchForm>
    <ZBTable
      ref="zbTableRef"
      style="margin-top: 20px"
      height="515px"
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
          v-permission="['btn:sensitive:IpTp:edit', permsList]"
        >
          编辑
        </el-button>
        <el-button
          type="text"
          class="red"
          @click="del(scope.row)"
          v-permission="['btn:sensitive:IpTp:delete', permsList]"
        >
          删除
        </el-button>
      </template>
      <template #footer>
        <el-button
          size="small"
          @click="allChange(0)"
          v-permission="['btn:sensitive:IpTp:deletes', permsList]"
          >批量删除</el-button
        >
      </template>
    </ZBTable>

    <ImportDialog ref="ImportDialogRef" @search="searchFn()" />
    <AddDialog ref="AddDialogRef" @search="searchFn()" />
  </div>
</template>

<script>
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { columns } from './columns'
import ImportDialog from '../common/importDialog.vue'
import AddDialog from '../common/addDialog.vue'
import { ipConfig } from '../../data.js'

import {
  getSensitiveGroupPageApi,
  sensitiveGroupsDelApi
} from '@/api/liveRoom/sensitive.js'
import { teacherQueryByName } from '@/api/tearchCenter'
export default {
  components: { HokSearchForm, ZBTable, ImportDialog, AddDialog },
  data() {
    return {
      columns,
      permsList: this.$route.meta.permsList || [],
      formOpts: {
        ...ipConfig.form,
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
            permission: 'btn:sensitive:IpTp:lead'
          },
          {
            label: '新增敏感词',
            fn: this.add,
            className: ['right'],
            permission: 'btn:sensitive:IpTp:add'
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
  created() {
    this.ipQueryByName()
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
    ipQueryByName(query) {
      teacherQueryByName({ name: query }).then(res => {
        this.options = res.data.map(item => {
          return {
            value: item.teacherId,
            label: item.teacherName
          }
        })
      })
    },
    ipChange(value) {
      if (value) {
        // 处理选择变化的逻辑
        const obj = this.options.find(item => item.value === value)
        this.formOpts.formData.groupName = obj.label
        // 你可以在这里添加更多的逻辑
      } else {
        this.formOpts.formData.groupName = ''
      }
      this.getList()
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
            // that.getList()
            that.searchFn()
          } catch (error) {
            this.$message.error('error')
          }
          that.loading = false
        }
      })
    },
    add() {
      this.$refs.AddDialogRef.openDialog({ type: 'add', sceneType: 1 })
    },
    edit(row) {
      this.$refs.AddDialogRef.openDialog({
        type: 'edit',
        form: {
          sceneType: 1,
          groupId: row.groupId,
          groupName: row.groupName,
          content: row.content.split(','),
          id: row.id
        }
      })
    },
    searchFn(isClear, isResetPageIndex = true) {
      console.log(this.tableConfig)
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = { sceneType: 1 }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      return getSensitiveGroupPageApi({
        ...this.tableConfig,
        ...this.formOpts.formData
      })
    },
    importBtn() {
      this.$refs.ImportDialogRef.openDialog({ sceneType: 1 })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  margin-top: 20px;
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
