<template>
  <!-- 聊天记录  -->
  <div>
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    />
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @sort-change="sortChange"
    >
      <template v-slot:fromUserName="{ scope }">
        {{ filtersTextPhone(scope.row.fromUserName) }}
      </template>
      <template v-slot:msgTime="{ scope }">
        {{ scope.row.msgTime | filterTime }}
      </template>
      <template v-slot:msgBody="{ scope }">
        <div
          v-if="
            scope.row.msgBody &&
              scope.row.msgBody[0].msgType === 'TIMTextElem' &&
              scope.row.msgBody[0].textMsgContent
          "
          class="comment_content_text"
          v-html="filterContent(scope.row.msgBody[0].textMsgContent.text)"
        />
        <div
          v-else-if="
            scope.row.msgBody &&
              scope.row.msgBody[0].msgType === 'TIMImageElem' &&
              scope.row.msgBody[0].imageMsgContent.origImage
          "
        >
          <el-image
            :style="{
              width: `${
                !scope.row.msgBody[0].imageMsgContent.origImage.width
                  ? 100
                  : scope.row.msgBody[0].imageMsgContent.origImage.width
              }px`,
              height: `${
                !scope.row.msgBody[0].imageMsgContent.origImage.height
                  ? 100
                  : scope.row.msgBody[0].imageMsgContent.origImage.height
              }px`,
              maxHeight: '100px',
              maxWidth: '100px'
            }"
            :src="scope.row.msgBody[0].imageMsgContent.origImage.url"
            fit="contain"
            :preview-src-list="[
              scope.row.msgBody[0].imageMsgContent.origImage.url
            ]"
          />
        </div>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig } from './columns'
import { filtersTextPhone } from '@/utils/index'
import { chatRecordPage, chatRecordExportAjax } from '@/api/liveRoom/index'
import { emojiMap } from '@/views/live/liveRoom/components/p2/Emoji/emoji.js'
import moment from 'moment'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: { ZBTable, HokSearchForm },
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
      importLoading: false,
      orderStatusList: []
    }
  },
  mounted() {
    this.setOperatorList()
    this.searchFn()
  },
  methods: {
    filtersTextPhone,
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
      if (
        this.permsList &&
        this.permsList.includes('btn:liveDetail:chatRecordsExport')
      ) {
        arr.push(
          {
            label: '导出数据',
            type: 'plain',
            bind: {
              loading: this.importLoading
            },
            fn: () => {
              this.onhandleImport()
            },
            className: ['right']
          })
      }

      this.$set(this.formOpts, 'operatorList', arr)
    },
    filterContent(value) {
      if (!value) {
        return ''
      } else {
        const reg = /\[(.*?)\]/gi
        const tmp = value.match(reg)
        if (!tmp) return value
        tmp.forEach(i => {
          let imgStr = ''
          if (emojiMap[i]) {
            imgStr = `<img src="${emojiMap[i]}" style="width:20px;height:20px;display: inline-block;vertical-align:bottom;" />`
          } else {
            imgStr = i
          }
          value = value.replace(i, imgStr)
        })
        return value
      }
    },
    // 点击导出记录
    onhandleImport() {
      this.importLoading = true
      const data = {
        liveRoomId: this.$route.params.id,
        ...this.tableConfig,
        ...this.formOpts.formData
      }
      chatRecordExportAjax(data)
        .then(res => {
          const url = res.data + '?t=' + new Date().getTime()
          window.open(url)
          this.importLoading = false
        })
        .catch(() => {
          this.importLoading = false
        })
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    sortChange({ column, prop, order }) {
      this.tableConfig.sortType =
        order === 'ascending' ? 2 : order === 'descending' ? 1 : undefined

      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          followUpPerson: undefined, //  	跟进人
          studentNickName: undefined, //  	学员昵称
          phone: undefined, //  	手机号
          isClass: '', //  	是否到课
          taskName: undefined, //  	任务名称
          orderStatus: undefined //  	订单状态
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        liveRoomId: this.$route.params.id,
        ...this.tableConfig,
        ...this.formOpts.formData
      }
      return chatRecordPage(params)
    }
  }
}
</script>

