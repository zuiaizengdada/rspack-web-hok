<template>
  <!-- 所有直播间列表  -->
  <div class="live-wrapper">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
      style="margin-top: 20px"
    >
      <template #teacherId>
        <FilterTearch
          ref="filterTearch"
          :placeholder-str="'请选择IP'"
          :local-storage-str="'engineeringManagement'"
          @handleChange="handleChangeTeacher"
        />
      </template>
      <template #time1ortime2>
        <div class="flex pl-2">
          <div
            style="width: 115px; "
          >导出日期</div>
          <el-date-picker
            v-model="
              formOpts.formData.time1ortime2Val"
            style="padding-left: 8px"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchFn()"
          />
        </div>
      </template>
    </HokSearchForm>

    <ZBTable
      ref="zbTableRef"
      key="liveLiveKey"
      :columns="columns"
      height="580px"
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:projectName="{ scope }">
        {{ scope.row.projectName }}
        <!-- <i class="el-icon-edit-outline" @click="onhandleEdit(scope.row)" /> -->
      </template>
      <template v-slot:projectSize="{ scope }">
        <p>{{ scope.row.projectSize | filterSize }}</p>
      </template>
      <template v-slot:projectExportedDatetime="{ scope }">
        {{
          moment(scope.row.projectExportedDatetime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }} </template>>
      <template v-slot:operate="{ scope }">
        <el-button
          v-permission="['web:engineeringAdd:btn', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="downLoad(scope.row)"
        >
          下载
        </el-button>
        <el-button
          v-permission="['web:engineeringDel:btn', permsList]"
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
import FilterTearch from '@/components/FilterTearch'
import { columns, formConfig } from './columns'
import {
  videoDownloadList,
  videoDownloadDel,
  videoDownloadUrl
} from '@/api/videoManagement/project'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Edit from './edit'
// import { downloadFile } from '@/utils/index.js'
export default {
  components: {
    HokSearchForm,
    ZBTable,
    Edit,
    FilterTearch
  },
  data() {
    return {
      columns,
      formOpts: {
        ...formConfig,
        operatorList: []
      },
      permsList: this.$route.meta.permsList || [],
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
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
      teacherId: undefined,
      projectName: undefined,
      time1ortime2: 'time1',
      time1ortime2Val: ['', ''],
      time1: '' // 开播时间
    }
  },
  mounted() {
    this.setOperatorList()
    this.searchFn()
  },
  methods: {
    moment,
    async downLoad(row) {
      await videoDownloadUrl({
        id: row.id
      }).then(res => {
        // downloadFile(res.data, `${row.projectName}.zip`)
        row.downloadCounted += 1
        window.open(res.data, '_self')
      })
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
      // 搜索按钮
      this.$set(this.formOpts, 'operatorList', arr)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          teacherId: undefined,
          projectName: undefined,
          time1ortime2: 'time1',
          time1ortime2Val: ['', ''],
          time1: ''
        }
        this.$refs.filterTearch.reset()
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        teacherId: this.formOpts.formData.teacherId,
        projectName: this.formOpts.formData.projectName,
        [this.formOpts.formData.time1ortime2]:
          this.formOpts.formData.time1ortime2Val
      }
      if (params.time1) {
        params.exportProjectTimeStart =
          params.time1 && params.time1[0] ? params.time1[0] + ' 00:00:00' : ''
        params.exportProjectTimeEnd =
          params.time1 && params.time1[1] ? params.time1[1] + ' 23:59:59' : ''
      }
      delete params.time1
      return videoDownloadList(params)
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: `确定删除？`,
        success: () => {
          videoDownloadDel({
            id: row.id
          }).then(res => {
            this.searchFn()
          })
        },
        fail: () => {}
      })
    },
    onhandleEdit(row) {
      this.config = {
        visible: true,
        data: row
      }
    },
    success() {
      this.config = {
        visible: false,
        data: {}
      }
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.live-wrapper {
  position: relative;
  padding: 5px 20px;
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
