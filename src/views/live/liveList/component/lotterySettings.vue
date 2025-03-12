<template>
  <!-- 抽奖设置 -->
  <div class="couponSettings">
    <div class="tableHeader">
      <div class="tableHeaderLeft">
        <el-button style="margin-right: 24px;" type="primary" @click="onhandleAdd">添加抽奖</el-button>
        <el-checkbox v-model="allowRepeat" @click.native.prevent="onAllowRepeatChange">
          <span class="checkTips">整场直播间不允许同一人重复中奖</span>
        </el-checkbox>
      </div>
      <el-button class="btn_primary" @click="onhandleAllPrizeWinner">所有中奖名单</el-button>
    </div>
    <div class="m-t-20">
      <el-table v-loading="loading" :data="list" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="prizeDrawName" label="抽奖名称" />
        <el-table-column prop="participationCondition" label="参与方式">
          <template slot-scope="{ row }">
            {{ {1: '用户在线', 2:'参与任意评论', 3:'参与指定评论'}[row.participationCondition] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="{ row }">
            {{ row.createTime | filterTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="{ row }">
            <AppStatus :status="['', 'warning', 'success', 'info', 'error'][row.status]">
              <span>
                {{ ['', '未开始', '进行中', '已结束', '已失效'][row.status] }}
              </span>
            </AppStatus>
          </template>
        </el-table-column>
        <el-table-column prop="prizeAmount" label="奖品数量" />
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="{ row }">
            <el-button v-if="row.status === 1" type="text" @click="onhandleEdit(row)">编辑</el-button>
            <el-button v-if="row.status === 1" type="text" :loading="row.disabledPrizeLoading" @click="onhandledisabledPrize(row)">失效</el-button>
            <el-button type="text" @click="onhandleLook(row)">查看</el-button>
            <el-button v-if="row.status === 3" type="text" @click="onhandlePrizeWinner(row)">中奖名单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getPrizeList, prizeRepeatWinner, disabledPrize } from '@/api/liveRoom/setting.js'
import Dialog from '../../Dialog/index'
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
  components: {
    AppStatus
  },
  data() {
    return {
      allowRepeat: false,
      loading: false,
      list: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      getPrizeList(data).then(res => {
        console.log(res)
        res.data.prizeDrawList.map(v => {
          v.prizeDrawId = v.id
          v.disabledPrizeLoading = false
        })
        this.allowRepeat = !res.data.allowRepeat
        this.list = res.data.prizeDrawList
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      Dialog.open({
        type: 'EditLottery',
        liveRoomId: this.$route.params.id,
        prizeDrawId: row.prizeDrawId,
        visible: true,
        success: () => {
          this.getList()
        }
      })
    },
    onhandleAdd() {
      Dialog.open({
        type: 'AddLottery',
        liveRoomId: this.$route.params.id,
        visible: true,
        success: () => {
          this.getList()
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
        prizeDrawId: row.prizeDrawId,
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
            prizeDrawId: row.prizeDrawId
          }
          disabledPrize(data).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getList()
            row.disabledPrizeLoading = false
          }).catch(() => {
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
        prizeDrawId: row.prizeDrawId,
        visible: true,
        success: () => {
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.couponSettings {
  .tableHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tableHeaderLeft {
      display: flex;
      align-items: flex-end;
      .checkTips {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        // margin-left: 8px;
      }
    }
  }
}
</style>
