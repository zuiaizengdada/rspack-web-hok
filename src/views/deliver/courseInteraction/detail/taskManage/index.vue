<template>
  <!-- 所有直播间列表  -->
  <div class="live-wrapper">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
      style="margin-top: 20px"
    >
    </HokSearchForm>

    <ZBTable
      ref="zbTableRef"
      key="homework"
      data-key="records"
      :columns="columns"
      height="320px"
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:startTime="{ scope }">
        <span v-if="scope.row.startTime">
          {{
            moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') +
            ' 至 ' +
            moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')
          }}
        </span>
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-permission="['homework-task-edit', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleEdit(scope.row, 'edit')"
        >
          编辑
        </el-button>
        <el-button
          v-permission="['homework-task-copy', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleEdit(scope.row, 'copy')"
        >
          复制
        </el-button>
        <el-button
          v-permission="['homework-task-del', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px; color: #f1330d"
          @click="onhandleDel(scope.row)"
        >
          删除
        </el-button>
      </template>
      <template #footer>
        <div />
      </template>
    </ZBTable>
    <el-drawer
      :title="
        config.type === 'copy'
          ? '复制任务'
          : config.type === 'add'
          ? '新增任务'
          : '编辑任务'
      "
      :visible.sync="config.visible"
      direction="rtl"
      :wrapper-closable="false"
      size="945px"
    >
      <Add
        v-if="config.visible"
        ref="editDrawwer"
        :type="config.type"
        :data="config.data"
        @success="success" 
        @close="close"
      />
    </el-drawer>
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { columns, formConfig } from './columns'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import moment from 'moment'
import Add from './add'
import { taskPage, delTask } from '@/api/deliver/punch'
export default {
  components: {
    HokSearchForm,
    ZBTable,
    Add
  },
  data() {
    return {
      columns,
      formOpts: {
        ...formConfig,
        operatorList: []
      },
      tableConfig: {
        current: 1,
        size: 10
      },
      config: {
        visible: false,
        data: {},
        type: ''
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  async created() {
    this.formOpts.formData = {
      title: undefined
    }
  },
  mounted() {
    this.setOperatorList()
    this.searchFn()
  },
  methods: {
    moment,
    handleDetail(row) {
      this.$router.push(`/deliver/courseInteractionDetail?id=${row.id}`)
    },
    handleChangeTeacher(val) {
      this.formOpts.formData.teacherId = val
      this.searchFn()
    },
    setOperatorList() {
      const arr = [
        {
          label: '查询',
          bind: { plain: true },
          fn: () => {
            this.searchFn()
          }
        },
        {
          label: '重置',
          type: 'plain',
          fn: () => {
            this.searchFn(true)
          }
        }
      ]
      if (this.permsList && this.permsList.includes('homework-task-add')) {
        arr.push({
          label: '新增',
          fn: () => {
            this.openCreate()
          },
          className: ['right']
        })
      }
      // 搜索按钮
      this.$set(this.formOpts, 'operatorList', arr)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.current = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.size = val
      this.searchFn()
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.current = 1
      }
      if (isClear) {
        this.tableConfig.current = 1
        this.tableConfig.size = 10
        this.formOpts.formData = {
          title: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        punchId: this.$route.query?.id,
        title: this.formOpts.formData.title
      }
      return taskPage(params)
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: `确定删除？`,
        success: () => {
          delTask(row.id).then(res => {
            this.$message.success('删除成功')
            this.searchFn()
          })
        },
        fail: () => {}
      })
    },
    onhandleEdit(row, type) {
      this.config = {
        visible: true,
        data: row,
        type
      }
    },
    openCreate() {
      this.config = {
        visible: true,
        data: {},
        type: 'add'
      }
    },
    close(){
      this.config = {
        visible: false,
        data: {},
        type: 'add'
      }
    },
    success() {
      this.config = {
        visible: false,
        data: {},
        type: 'add'
      }
      this.searchFn()
    }
  }
}
</script>
  
<style lang="scss" scoped>
.live-wrapper {
  position: relative;
  background: #ffffff;
  border-radius: 10px; 

  .liveType,
  .liveMode {
    display: inline-block;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    padding: 0 8px;
    border-radius: 13px;
    font-size: 10px;
    font-family: MicrosoftYaHei;
    height: 24px;
    line-height: 24px;

    .liveTypeicon,
    .liveModeicon {
      width: 13px;
      height: 13px;
      font-size: 13px;
      margin-right: 4px;
    }
  }

  .liveType0 {
    background: #eef2f9;
    color: #717f99;
  }

  .liveType1 {
    background: #e7f0ff;
    color: #1778ff;
  }

  .liveType2 {
    background: #fff2e6;
    color: #ff7d00;
  }

  .liveType3 {
    background: #feecec;
    color: #f53f3f;
  }

  .liveType9 {
    background: #f5f5f5;
    color: #999999;
  }
}

::v-deep {
  // .pageWrap {
  //   .navHeader {
  //     .navItem {
  //       font-size: 14px;
  //     }
  //   }
  // }

  .filter_teacherSelect {
    .tearchInput {
      width: 270px !important;
    }
  }
}

::v-deep {
  .delisting-tips {
    font-size: 16px;
    color: #333333;
    font-weight: 400;
  }

  .delisting-tips-text {
    color: #f1330d;
    font-weight: 600;
  }

  .el-dialog__title {
    color: #f1330d;
    font-weight: 600;
    font-size: 24px;
  }
}
::v-deep .el-drawer__header {
  margin-bottom: 0px;
  color: #333333;
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #F3F5F9;  
}
</style>
  