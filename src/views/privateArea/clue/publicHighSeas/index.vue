<template>
  <div class="publicHighSeas-wrapper">
    <HokSearchForm
      ref="HokSearchFormRef"
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      :set-shrink="false"
      class="pd20"
      style="margin-top: 20px"
      @changeShrink="changeShrink"
    >
      <template #slot1>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.slot1"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
          >
            <el-option label="学员电话" value="phone" />
            <el-option label="学员邮箱" value="email" />
            <el-option label="微信昵称" value="wechatNickName" />
          </el-select>
          <el-input
            v-model="formOpts.formData.slot1Val"
            clearable
            style="padding-left: 8px"
            placeholder="请输入"
          />
        </div>
      </template>
      <template #teacherId>
        <appTemplate
          v-model="formOpts.formData.teacherId"
          style="width: 100%"
        />
      </template>
      <template #tagName>
        <el-input v-model="formOpts.formData.tagName" placeholder="请选择标签" @focus="showTag = true" />
      </template>
      <template #goodsId>
        <el-select
          v-model="formOpts.formData.goodsId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入商品名称"
          :remote-method="remoteMethodGoods"
          :loading="goodsLoading"
        >
          <el-option
            v-for="item in goodsList"
            :key="item.goodsId"
            :label="item.goodsName"
            :value="item.goodsId"
          />
        </el-select>
      </template>
      <template #channelId>
        <m-select
          v-model="formOpts.formData.channelId"
          :dict-list="channelSourceType"
          :all="true"
        />
      </template>
    </HokSearchForm>
    <CTable
      ref="CTableRef"
      :columns="columns"
      :height="changeShrinkValue ? '420px' : '520px'"
      :get-list="getList"
      is-left-bottom-slot
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <template v-slot:phone="{ scope }">
        <tablePhoneItem
          v-if="scope.row.phone"
          ref="tablePhoneRef"
          v-model="scope.row.phone"
          :phone-area-code="scope.row.phoneAreaCode"
          copy
          :row-data="scope.row"
          type="highSeasClue"
        />
        <span v-else>-</span>
      </template>

      <template v-slot:email="{ scope }">
        <watchPhoneNumber
          v-if="scope.row.email"
          :default-value="scope.row.email"
          :params="scope.row"
          :onhandle-click="operationLogsWriteEmail"
        />
        <span v-else>-</span>
      </template>
      <template v-slot:cluePersonTags="{ scope }">
        <template
          v-if="scope.row.personalTagList && scope.row.personalTagList.length"
        >
          <el-tag class="gr-tag">
            {{ scope.row.tagsName }}
          </el-tag>
        </template>
      </template>
      <template #footer>
        <el-button size="small" type="primary" @click="openDialog">
          按任务重新分配
        </el-button>
        <div />
      </template>
    </CTable>
    <el-dialog
      title="重新分配"
      :visible.sync="dialogVisible"
      width="520px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="dialogBeforeClose"
    >
      <div>
        <div v-if="!isAssignClue" class="text-st">
          <div>
            您当前共选择
            <span class="count">{{ multipleSelection.length }}</span> 条线索
          </div>
          <div>
            线索会按照当前符合的任务进行分配，并按对应的任务进行线索触达！
          </div>
        </div>
        <div v-else class="text-st">
          <div style="margin-bottom: 8px">
            <div class="drop" style="background-color: #00b42a" />
            <span style="color: #00b42a">已成功分配 </span>
            {{ assignClueRes.successNumber }} 条线索
          </div>
          <div v-if="assignClueRes.failNumber > 0">
            <div class="drop" style="background-color: #f1330d" />
            <span style="color: #f1330d">未分配</span>
            {{ assignClueRes.failNumber }} 条线索，原因：线索无符合的任务！
          </div>
        </div>
      </div>
      <div slot="footer">
        <template v-if="!isAssignClue">
          <el-button
            type="primary"
            :loading="assignClueLoading"
            @click="assignClue"
          >
            确 定
          </el-button>
          <el-button :loading="assignClueLoading" @click="dialogBeforeClose">
            取 消
          </el-button>
        </template>

        <template v-else>
          <el-button @click="dialogBeforeClose">我知道了</el-button>
        </template>
      </div>
    </el-dialog>
    <tagName ref="tagNameRef" :visible.sync="showTag" @handleChooseTag="handleChooseTag" />
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import appTemplate from '@/components/AppTemplate/teacherSelect/index'
import { materialSearchName } from '@/api/privateArea/CRM.js'
import CTable from './table'
import {
  publicHighSeasPageList,
  publicHighSeasAssignClue,
  getHighSeasClueEmail,
  assignClueData
} from '@/api/privateArea/clue'
import { columns, formConfig } from './columns'
import { clueTypeStatus } from '../columns'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { mapGetters } from 'vuex'
import TagName from '../components/tagName'
export default {
  components: {
    HokSearchForm,
    appTemplate,
    CTable,
    tablePhoneItem,
    watchPhoneNumber,
    TagName
  },
  data() {
    return {
      clueTypeStatus,
      columns,
      formOpts: {
        ...formConfig,
        operatorList: [
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
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      bindClickKeys: [
        'time',
        'clueType',
        'channelId',
        'productCategory',
        'orderStatus',
        'attribution'
      ],
      multipleSelection: [],
      goodsLoading: false,
      goodsList: [],
      dialogVisible: false,
      isAssignClue: false,
      assignClueRes: {
        failNumber: 0,
        successNumber: 0
      },
      assignClueLoading: false,
      changeShrinkValue: false,
      showTag: false
    }
  },
  computed: {
    ...mapGetters(['channelsource', 'channelSourceType'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    // 绑定change事件
    // this.formOpts.fieldList.forEach(item => {
    //   if (this.bindClickKeys.includes(item.prop)) {
    //     item.eventHandler.change = () => {
    //       this.searchFn()
    //     }
    //   }
    // })
    this.remoteMethodGoods()
  },
  activated() {
    this.searchFn()
    this.$forceUpdate()
  },
  methods: {
    handleChooseTag(tagList) {
      this.formOpts.formData.tagName = tagList.map(item => item.tagName).join(',')
      this.formOpts.formData.tagInfoVo = tagList.map(item => ({ tagId: item.id, tagName: item.tagName, tagType: item.isCompany ? 2 : 1 }))
    },
    operationLogsWriteEmail(record) {
      return new Promise((resolve, reject) => {
        getHighSeasClueEmail(record.id)
          .then(res => {
            resolve(res)
          })
          .catch(() => {
            reject()
          })
      })
    },
    changeShrink(val) {
      this.changeShrinkValue = val
    },
    dialogBeforeClose() {
      this.dialogVisible = false
      this.searchFn()
    },
    openDialog() {
      if (this.multipleSelection.length < 1) {
        this.$message.warning('请选择要重新分配的线索')
        return
      }
      this.assignClueLoading = false
      this.isAssignClue = false
      this.assignClueRes = { failNumber: 0, successNumber: 0 }
      this.dialogVisible = true
    },
    assignClue() {
      this.assignClueLoading = true
      publicHighSeasAssignClue({
        highSeasClueId: this.multipleSelection.map(m => m.id)
      })
        .then(res => {
          const tmpIt = setInterval(() => {
            this.savePoll(res.data.queryId, tmpIt)
          }, 1000)
        })
        .catch(() => {
          this.assignClueLoading = false
        })
    },
    savePoll(id, tmpIt) {
      assignClueData({ queryId: id })
        .then(res => {
          if (!this.dialogVisible) {
            clearInterval(tmpIt)
            return
          }
          if (res.data) {
            clearInterval(tmpIt)
            this.assignClueLoading = false
            this.assignClueRes = { ...res.data }
            this.multipleSelection = []
            this.isAssignClue = true
            this.searchFn()
          }
        })
        .catch(() => {
          clearInterval(tmpIt)
          this.assignClueLoading = false
        })
    },
    sortChange({ column, prop, order }) {
      this.tableConfig.sortName = prop
      this.tableConfig.sortType =
        order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : undefined

      this.searchFn()
    },
    async remoteMethodGoods(goodsName) {
      this.goodsLoading = true
      try {
        const { data } = await materialSearchName({
          goodsName
        })
        this.goodsLoading = false
        this.goodsList = data
      } catch (e) {
        this.goodsLoading = false
      }
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
          slot1: 'phone',
          slot1Val: undefined,
          orderNo: undefined,
          time: undefined,
          tagName: undefined,
          clueType: undefined,
          teacherId: undefined,
          channelId: undefined,
          productCategory: undefined,
          goodsName: undefined,
          orderStatus: '',
          attribution: undefined,
          tagInfoVo: []
        }
        this.$refs.tagNameRef.handleClear()
      }
      this.$refs.CTableRef.init(isResetPageIndex)
    },
    getList() {
      return new Promise((resolve, reject) => {
        const params = {
          ...this.tableConfig,
          ...this.formOpts.formData,
          [this.formOpts.formData.slot1]: this.formOpts.formData.slot1Val
        }
        if (params.time) {
          params.startCreateTime =
            params.time && params.time[0] ? params.time[0] + ' 00:00:00' : ''
          params.endCreateTime =
            params.time && params.time[1] ? params.time[1] + ' 23:59:59' : ''
        }
        delete params.time
        delete params.slot1Val
        delete params.slot1
        publicHighSeasPageList(params)
          .then(res => {
            res.data.items.forEach(item => {
              item.clueType =
                this.clueTypeStatus.find(f => f.value === item.clueType)
                  ?.label || '-'
              item.tagsName =
                item.personalTagList && item.personalTagList.length
                  ? item.personalTagList.map(m => m).join(',')
                  : ''
              item.wechatNickName = item.wechatNickName || '-'
              item.remark = item.remark || '-'
            })
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.publicHighSeas-wrapper {
  padding: 0px 20px 20px 20px;
  .text-st {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 1px;
    .count {
      color: #0c6fff;
    }
    .drop {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
  }
  .gr-tag {
    width: 120px;
    max-width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
::v-deep {
  .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e7e7e7;
    .el-dialog__title {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    padding: 20px 20px;
  }
}
</style>
