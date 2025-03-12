<template>
  <!-- 签到设置  -->
  <div>
    <el-row type="flex" justify="space-between" style="margin: 20px 0">
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="onhandleSignSetting"
        >
          签到样式设置
        </el-button>
      </div>
      <el-button
        class="btn_primary"
        :loading="exportLoading"
        size="small"
        @click="onhandleClickExportAll"
      >
        导出所有记录
      </el-button>
    </el-row>

    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:signType="{ scope }">
        {{ { 1: '立即发送', 2: '定时发送' }[scope.row.signType] }}
      </template>
      <template v-slot:signDuration="{ scope }">
        {{ scope.row.signDuration | filtersDuration }}
      </template>

      <template v-slot:operate="{ scope }">
        <el-button type="text" @click="onhandleSignResult(scope.row)">
          签到结果
        </el-button>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns } from './columns'
import {
  liveRoomSignLog,
  liveRoomSignResultExportAll
} from '@/api/liveRoom/index.js'
import Dialog from '@/views/smartSales/privateLive/room/components/Dialog/index.js'
export default {
  filters: {
    filtersDuration(val) {
      if (!val) {
        return ''
      }
      const result = parseInt(val)
      const h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10
          ? Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
      const s =
        Math.floor(result % 60) < 10
          ? '0' + Math.floor(result % 60)
          : Math.floor(result % 60)
      if (h === '00' && m === '00') {
        return s + '秒'
      } else if (h === '00' && m !== '00' && s === '00') {
        return m + '分钟'
      } else if (h === '00') {
        return m + '分钟' + s + '秒'
      } else {
        return h + '时' + m + '分' + s + '秒'
      }
    }
  },
  components: { ZBTable },
  data() {
    return {
      columns,
      exportLoading: false,
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      liveRoomId: this.$route.params.id
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
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    onhandleSignSetting() {
      Dialog.open({
        type: 'SignStyle',
        liveRoomId: this.liveRoomId,
        visible: true,
        success: () => {
          Dialog.close()
        }
      })
    },
    // 点击导出所有记录按钮
    onhandleClickExportAll() {
      this.exportLoading = true
      liveRoomSignResultExportAll(this.$route.params.id)
        .then(res => {
          window.open(res.data)
          this.exportLoading = false
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    // 点击签到结果按钮
    onhandleSignResult(row) {
      Dialog.open({
        type: 'SignRecord',
        liveRoomId: this.liveRoomId,
        liveRoomSignId: row.id,
        visible: true
      })
    },
    getList() {
      this.loading = true
      const data = {
        ...this.tableConfig,
        liveRoomId: this.$route.params.id
      }
      return liveRoomSignLog(this.$route.params.id, data)
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  color: #999;
  font-size: 12px;
  font-weight: 400;
}
::v-deep .picker-s {
  width: 245px !important;
  height: 32px;
  margin-left: 40px;
  margin-right: 16px;
  border-radius: 4px;
  border: 1px solid #cbcfd3;
}
</style>
