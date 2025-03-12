<template>
  <!-- 抽奖设置  -->
  <div>
    <el-row type="flex" justify="space-between" style="margin: 20px 0">
      <div>
        <el-button
          type="primary"
          size="small"
          @click="onhandleAdd"
        >添加抽奖</el-button>
        <el-checkbox
          v-model="allowRepeat"
          style="margin-left: 10px"
          @click.native.prevent="onAllowRepeatChange"
        >
          <span class="checkTips">整场直播间不允许同一人重复中奖</span>
        </el-checkbox>
      </div>
      <el-button
        class="btn_primary"
        size="small"
        @click="onhandleAllPrizeWinner"
      >
        所有中奖名单
      </el-button>
    </el-row>

    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      is-left-bottom-slot
      :is-pages="false"
    >
      <template v-slot:participationCondition="{ scope }">
        {{
          { 1: '用户在线', 2: '参与任意评论', 3: '参与指定评论' }[
            scope.row.participationCondition
          ]
        }}
      </template>
      <template v-slot:createTime="{ scope }">
        {{ scope.row.createTime | filterTime }}
      </template>
      <template v-slot:status="{ scope }">
        <AppStatus
          :status="
            ['', 'warning', 'success', 'info', 'error'][scope.row.status]
          "
        >
          <span>
            {{ ['', '未开始', '进行中', '已结束', '已失效'][scope.row.status] }}
          </span>
        </AppStatus>
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-if="scope.row.status === 1"
          type="text"
          @click="onhandleEdit(scope.row)"
        >
          编辑
        </el-button>
        <el-button
          v-if="scope.row.status === 1"
          type="text"
          :loading="scope.row.disabledPrizeLoading"
          @click="onhandledisabledPrize(scope.row)"
        >
          失效
        </el-button>
        <el-button type="text" @click="onhandleLook(scope.row)">查看</el-button>
        <el-button
          v-if="scope.row.status === 3"
          type="text"
          @click="onhandlePrizeWinner(scope.row)"
        >
          中奖名单
        </el-button>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns } from './columns'
import {
  getPrizeList,
  prizeRepeatWinner,
  disabledPrize
} from '@/api/liveRoom/setting.js'
import Dialog from '@/views/smartSales/privateLive/room/components/Dialog/index.js'
import AppStatus from '@/components/AppStatus'
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
  components: { ZBTable, AppStatus },
  data() {
    return {
      columns,
      allowRepeat: false
    }
  },
  mounted() {
    this.updateTable()
  },
  methods: {
    updateTable() {
      this.$refs.zbTableRef.init()
    },
    getList() {
      const data = {
        liveRoomId: this.$route.params.id
      }
      return new Promise((resolve, reject) => {
        getPrizeList(data)
          .then(res => {
            this.allowRepeat = !res.data.allowRepeat
            resolve({
              data: res.data.prizeDrawList || []
            })
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      Dialog.open({
        type: 'EditLottery',
        liveRoomId: this.$route.params.id,
        prizeDrawId: row.id,
        visible: true,
        success: () => {
          this.updateTable()
        }
      })
    },
    onhandleAdd() {
      Dialog.open({
        type: 'AddLottery',
        liveRoomId: this.$route.params.id,
        visible: true,
        success: () => {
          this.updateTable()
        }
      })
    },
    // 查看所有
    onhandleAllPrizeWinner() {
      Dialog.open({
        type: 'PrizeWinner',
        title: '所有中奖名单',
        liveRoomId: this.$route.params.id,
        showAction: true,
        visible: true
      })
    },
    onhandlePrizeWinner(row) {
      Dialog.open({
        type: 'PrizeWinner',
        title: `${row.prizeDrawName}中奖名单`,
        liveRoomId: this.$route.params.id,
        prizeDrawId: row.id,
        showAction: true,
        visible: true
      })
    },
    // 点击切换是否重复中奖
    onAllowRepeatChange() {
      this.$delModal({
        tips: '确认修改当前设置？',
        success: () => {
          const data = {
            allowRepeat: this.allowRepeat,
            liveRoomId: this.$route.params.id
          }
          prizeRepeatWinner(data).then(res => {
            this.allowRepeat = !this.allowRepeat
            this.$notify.success({ title: '提示', message: '操作成功' })
          })
        }
      })
    },
    // 点击失效按钮
    onhandledisabledPrize(row) {
      this.$delModal({
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">确认失效？</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">未开始的抽奖在失效后将无法恢复！</div>`,
        success: () => {
          row.disabledPrizeLoading = true
          const data = {
            prizeDrawId: row.id
          }
          disabledPrize(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.updateTable()
              row.disabledPrizeLoading = false
            })
            .catch(() => {
              row.disabledPrizeLoading = false
            })
        }
      })
    },
    // 点击查看按钮
    onhandleLook(row) {
      console.log(row)
      Dialog.open({
        type: 'DetailLottery',
        liveRoomId: this.$route.params.id,
        prizeDrawId: row.id,
        visible: true,
        success: () => {
          this.getList()
        }
      })
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
