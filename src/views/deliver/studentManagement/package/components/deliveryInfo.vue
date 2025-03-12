<template>
  <div>
    <!-- 观看记录 -->
    <div class="sub-tab">
      <el-tabs v-model="tabType" type="card" @tab-click="handleClickTab">
        <el-tab-pane label="录播课" name="record" />
        <el-tab-pane label="直播课" name="live" />
        <el-tab-pane label="直播间" name="liveRoom" />
        <el-tab-pane label="线下课" name="offline" />
      </el-tabs>
    </div>
    <el-table
      v-if="tabType === 'record' || tabType === 'live'"
      v-loading="loading"
      :data="data"
      :header-cell-style="{ background: '#f5f5f5' }"
      :row-key="record => record.deliveryId"
      :tree-props="{ children: 'userProgressVos', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="contentName"
        label="交付单"
        :show-overflow-tooltip="true"
        width="200px"
      >
        <template slot-scope="{ row }">
          {{ row.deliveryId || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="totalDuration" label="IP">
        <template slot-scope="{ row }">
          {{ (row.ip || []).join(',') }}
        </template>
      </el-table-column>
      <el-table-column prop="accumulatedDuration" label="订单类型">
        <template slot-scope="{ row }">
          {{ row.orderType | parseOrderType }}
        </template>
      </el-table-column>
      <el-table-column prop="learnedRatio" label="看课权限">
        <template slot-scope="{ row }">
          {{
            row.permission === 1 ? '保留' : row.permission === 2 ? '解除' : ''
          }}
        </template>
      </el-table-column>
      <el-table-column prop="learnedRatio" label="课程名称">
        <template slot-scope="{ row }">
          {{ row.goodsName || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="learnedRatio" label="交付状态">
        <template slot-scope="{ row }">
          {{ $getdictName('DELIVERY_ONE_STATUS',row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="learnedRatio" label="累计观看时长" width="120px">
        <template slot-scope="{ row }">
          {{ (row.duration || 0) | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="learnedRatio" label="订单号" width="200px">
        <template slot-scope="{ row }">
          {{ row.orderNo || 0 }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tabType === 'liveRoom'"
      v-loading="loading"
      :data="data"
      :header-cell-style="{ background: '#f5f5f5' }"
      :row-key="record => record.id"
      :tree-props="{ children: 'userProgressVos', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="liveId"
        label="直播间ID"
        :show-overflow-tooltip="true"
        width="100px"
      >
        <template slot-scope="{ row }">
          {{ row.code || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="liveName" label="直播间名称" width="120px">
        <template slot-scope="{ row }">
          {{ row.name || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="liveModel" label="直播间类型" width="120px">
        <template slot-scope="{ row }">
          {{ {'PERSON_LIVE': '真人直播', 'AI_LIVE': '智能直播', 'DIGITAL_PERSON_LIVE': '数字人直播'}[row.liveModel] }}
        </template>
      </el-table-column>
      <el-table-column prop="learnedRatio" label="直播观看时长" width="120px">
        <template slot-scope="{ row }">
          {{
            (row.listenClassTime || 0) / 1000 | filterTime
          }}
        </template>
      </el-table-column>
      <el-table-column prop="listenClassTime" label="回放观看时长" width="120px">
        <template slot-scope="{ row }">
          {{ (row.playbackListenClassTime || 0) / 1000 | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开播时间">
        <template slot-scope="{ row }">
          {{ row.startTime }}
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="预约时间">
        <template slot-scope="{ row }">
          {{ row.applyTime }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="tabType === 'offline'"
      v-loading="loading"
      :data="data"
      :header-cell-style="{ background: '#f5f5f5' }"
      :tree-props="{ children: 'userProgressVos', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="userName"
        label="学员姓名"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          {{ row.userName || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="课程名称">
        <template slot-scope="{ row }">
          {{ row.goodsName || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="scheduleName" label="班期">
        <template slot-scope="{ row }">
          {{ row.scheduleName }}
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="交付状态">
        <template slot-scope="{ row }">
          {{ row.status | parseStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="orderType" label="订单类型">
        <template slot-scope="{ row }">
          {{ row.orderType | parseOrderType }}
        </template>
      </el-table-column>
      <el-table-column prop="signCount" label="已签到次数">
        <template slot-scope="{ row }">
          {{ row.signCount || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="enrollmentName" label="招生老师">
        <template slot-scope="{ row }">
          {{ row.enrollmentName || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="headteacherName" label="班主任">
        <template slot-scope="{ row }">
          {{ row.headteacherName || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="assistantName" label="助教">
        <template slot-scope="{ row }">
          {{ row.assistantName || '' }}
        </template>
      </el-table-column>
      <el-table-column prop="saleUserName" label="销售跟进人员">
        <template slot-scope="{ row }">
          {{ row.saleUserName || '' }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getRecordClassList,
  getLiveRoomList,
  getOfflineClassList
} from '@/api/deliver/studentManagement'
import { parseLiveModel, parseOrderType, parseStatus } from '@/filters'

export default {
  components: {},
  props: {
    deliveryInfoId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      tabType: 'record',
      data: [],
      currentPage: 1,
      total: 0,
      loading: false,
      pageSize: 10,
      currentTotal: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    parseStatus,
    parseOrderType,
    parseLiveModel,
    init() {
      this.data = []
      this.total = 0
      this.currentPage = 1
      this.getList()
      // if (this.type === '1') this.getUserProgressDeliveryTotal()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    async getUserProgressDeliveryTotal() {
      // const { data } = await getUserProgressDeliveryTotal({ subOrderId: this.subOrderId })
      // this.currentTotal = data
    },
    getList() {
      this.loading = true
      const param = {
        current: this.currentPage,
        size: this.pageSize,
        deliveryInfoId: this.$props.deliveryInfoId
      }
      if (this.tabType === 'record' || this.tabType === 'live') {
        param.type = this.tabType === 'record' ? 1 : 2
        getRecordClassList(param)
          .then(res => {
            this.data = res.data.records
            this.total = Number(res.data.total)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.tabType === 'liveRoom') {
        getLiveRoomList(param)
          .then(res => {
            this.data = res.data.records
            this.total = Number(res.data.total)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.tabType === 'offline') {
        getOfflineClassList(param)
          .then(res => {
            this.data = res.data.records
            this.total = Number(res.data.total)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleClickTab() {
      this.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  height: 62px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.totleBox {
  display: flex;
  margin-top: 10px;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 10px;

  > div {
    flex: 1;
    text-indent: 10px;
    font-size: 16px;
    color: #999999;
  }

  > div:nth-of-type(1) {
    min-width: 222px !important;
  }
}

.sub-table {
  el-tabs__content: {
    display: none;
  }
}
</style>
