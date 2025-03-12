<template>
  <!-- 所有直播间列表  -->
  <div class="live-wrapper">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
      style="margin-top: 20px"
    />

    <ZBTable
      ref="zbTableRef"
      key="liveLiveKey"
      :columns="columns"
      height="540px"
      data-key="records"
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:status="{ scope }">
        {{ scope.row.status === 1 ? '启用' : '禁用' }}
      </template>
      <template v-slot:tagType="{ scope }">
        <p>{{ findLabelByValue(scope.row.tagType,tagTypeMap) }}</p>
      </template>
      <template v-slot:createTime="{ scope }">
        {{
          moment(scope.row.createTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }} </template>>
      <template v-slot:operate="{ scope }">
        <el-button
          v-if="scope.row.tagType === 99"
          v-permission="['web:label:update', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="updateTagStatus(scope.row)"
        >
          {{ scope.row.status === 1 ? '禁用' : '启用' }}
        </el-button>
        <el-button
          v-if="scope.row.tagType === 99"
          v-permission="['web:label:del', permsList]"
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
    <Edit :config="config" @success="success" />
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { columns, formConfig, tagTypeMap } from './columns'
import {
  tagPage,
  updateMaterialTag,
  deleteMaterialTag
} from '@/api/course'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Edit from './edit'
import { findLabelByValue } from '@/utils/index.js'
export default {
  components: {
    HokSearchForm,
    ZBTable,
    Edit
  },
  data() {
    return {
      tagTypeMap,
      columns,
      formOpts: {
        ...formConfig,
        operatorList: []
      },
      permsList: this.$route.meta.permsList || [],
      tableConfig: {
        current: 1,
        size: 10
      },
      config: {
        visible: false,
        data: {}
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes'])
  },
  async created() {
    this.formOpts.formData = {
      tagName: undefined
    }
  },
  mounted() {
    this.setOperatorList()
    this.searchFn()
  },
  methods: {
    moment,
    findLabelByValue,
    async updateTagStatus(row) {
      await updateMaterialTag({
        tagId: row.tagId,
        status: row.status === 1 ? 0 : 1
      }).then(res => {
        this.$message.success('操作成功')
        this.success()
        // downloadFile(res.data, `${row.projectName}.zip`)
      })
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
      if (this.permsList && this.permsList.includes('web:label:add')) {
        arr.push({
          label: '新增',
          fn: () => {
            this.handleAdd()
          },
          className: ['right']
        })
      }
      // 搜索按钮
      this.$set(this.formOpts, 'operatorList', arr)
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
          tagName: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        tagName: this.formOpts.formData.tagName
      }
      return tagPage(params)
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: `确定删除？`,
        success: () => {
          deleteMaterialTag(row.tagId).then(res => {
            this.$message.success('删除成功')
            this.searchFn()
          })
        },
        fail: () => {}
      })
    },
    success() {
      this.config = {
        visible: false,
        data: {}
      }
      this.searchFn()
    },
    handleAdd() {
      this.config = {
        visible: true,
        data: {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.live-wrapper {
  position: relative;
  padding: 0px 20px;
  background: #ffffff;
  border-radius: 10px;
  height: calc(100% - 72px);
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
</style>
