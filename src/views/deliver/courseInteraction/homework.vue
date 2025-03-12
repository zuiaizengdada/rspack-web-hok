<template>
  <!-- 所有直播间列表  -->
  <div class="live-wrapper">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
      style="margin-top: 20px"
    >
      <!-- <template #time1ortime2>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.time1ortime2"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
          >
            <el-option label="起止日期" value="time1" />
          </el-select>
          <el-date-picker
            v-model="formOpts.formData.time1ortime2Val"
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
      </template> --> 
    </HokSearchForm>

    <ZBTable
      ref="zbTableRef"
      key="homework"
      data-key="records"
      :columns="columns"
      height="485px" 
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:userCount="{ scope }">
        {{ scope.row.userCount }} / {{ scope.row.punchTimes }}
      </template>
      <template v-slot:partCond="{ scope }">
        {{ findLabelByValue(scope.row.partCond, partCondOptions) }}
      </template>
      <template v-slot:isPublish="{ scope }">
        {{ findLabelByValue(scope.row.isPublish, statusOptions) }}
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-permission="['homework-detail', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="handleDetail(scope.row)"
        >
          详情
        </el-button>
        <el-button
          v-permission="['homework-edit', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleEdit(scope.row,'edit')"
        >
          编辑
        </el-button>
        <el-button
          v-permission="['homework-copy', permsList]"
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleEdit(scope.row,'copy')"
        >
          复制
        </el-button>
        <el-button
          v-permission="['homework-del', permsList]"
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
      :title="config.type==='copy' ? '复制打卡作业' : config.type==='add'? '新增打卡作业' : '编辑打卡作业'"
      :visible.sync="config.visible"
      direction="rtl"
      :wrapper-closable="false" 
      size="945px"
    >
      <Add v-if="config.visible" ref="editDrawwer" :type="config.type" :data="config.data" @success="success" />
    </el-drawer>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { columns, formConfig, partCondOptions, statusOptions } from './columns'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Add from './components/add'
import { punchPage, delPunch } from '@/api/deliver/punch'
import { findLabelByValue } from '@/utils/index.js'
export default {
  components: {
    HokSearchForm,
    ZBTable,
    Add
  },
  data() {
    return {
      columns,
      partCondOptions,
      statusOptions,
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
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    permsList() {
      const obj = this.permission_routes?.find(v => v.path === '/deliver')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'generalSettings')
        if (o && o.children && o.children.length > 0) {
          console.log(o, 'o')
          const p = o.children.find(v => v.path === '/deliver/courseInteraction')
          if (p && p.children && p.children.length > 0) {
            const pp = p.children.find(v => v.path === '/deliver/courseInteraction/homework')
            if (pp && pp.meta && pp.meta.permsList && pp.meta.permsList.length > 0) {
              return pp.meta.permsList
            }
          } 
        }
      } 
      return []
    }
  },
  async created() {
    this.formOpts.formData = {
      teacherId: undefined,
      title: undefined,
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
    findLabelByValue,
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
      if (this.permsList && this.permsList.includes('homework-add')) {
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
          title: undefined,
          isPublish: undefined,
          partCond: undefined,
          time1ortime2: 'time1',
          time1ortime2Val: ['', ''],
          time1: ''
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        isPublish: this.formOpts.formData.isPublish,
        partCond: this.formOpts.formData.partCond,
        title: this.formOpts.formData.title,
        [this.formOpts.formData.time1ortime2]:
          this.formOpts.formData.time1ortime2Val
      }
      if (params.time1) {
        params.startTime =
          params.time1 && params.time1[0] ? params.time1[0] + ' 00:00:00' : ''
        params.endTime =
          params.time1 && params.time1[1] ? params.time1[1] + ' 23:59:59' : ''
      }
      delete params.time1
      return punchPage(params)
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: `确定删除？`,
        success: () => {
          delPunch(row.id).then(res => {
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
  padding: 0 20px; 
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

