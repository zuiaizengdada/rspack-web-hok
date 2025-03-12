<template>
  <AppDialog
    v-model="visible"
    title="预约直播间"
    width="666px"
    :loading="loading"
    height="auto"
    :top="top"
  >
    <div v-if="list.length" class="sendGoods">
      <div class="myTable">
        <el-table :data="list" :header-cell-style="{ background: '#f3f3f3' }" @cell-click="cellClick">
          <el-table-column width="50">
            <template slot-scope="{ row }">
              <el-radio v-model="select" :label="row.liveRoomId"><span /></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="直播间名称" show-overflow-tooltip />
          <el-table-column prop="startTime" label="开播时间">
            <template slot-scope="{ row }">
              {{ row.startTime | filterTime }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="讲师" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ renderTearch(row.realityTeacherUserName) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sendGoodsFooter">
        <span class="c_F53F3F">*</span>
        <span class="sendGoodsFooterTxt">停留时间</span>
        <el-select v-model="value" placeholder="请选择" style="width: 83px" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div v-else class="noDataPage">
      <el-empty description="暂无预约直播间" :image-size="320" :image="require('@/assets/image/live/noLive.png')" />
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button v-if="list.length" size="small" :loading="loading" type="primary" @click="sure">确定</el-button>
      <el-button v-else size="small" :loading="loading" type="primary" @click="toRegisterSetting">预约设置</el-button>
      <el-button size="small" :loading="loading" @click="close">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { applyConfigDetailAjax, liveSendSubscribeAjax } from '@/api/liveRoom/register'
import moment from 'moment'
import router from '@/router'

export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      loading: false,
      top: '114px',
      search: { goodsName: '' },
      list: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      value: 30, // 选择停留时间
      liveRoomId: '',
      groupId: '',
      options: [
        { label: '30秒', value: 30 },
        { label: '1分钟', value: 60 },
        { label: '5分钟', value: 300 },
        { label: '30分钟', value: 1800 },
        { label: '60分钟', value: 3600 }
      ],
      select: '',
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.select = ''
        val && this.searchFn()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 561) / 2 + 'px'
  },
  methods: {
    renderTearch(arr) {
      if (!arr) {
        return ''
      }
      const value = arr.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next}`)
        return pre
      }, '')
      return value
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
    getList() {
      this.loading = true
      const params = {
        liveRoomId: this.liveRoomId
      }
      applyConfigDetailAjax(params).then(res => {
        this.list = res.data?.liveRoomTrailers.map(item => {
          item.startTime = moment(item.startTime)
          return item
        }).sort((a, b) => a.startTime - b.startTime)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    cellClick(row, column, cell, event) {
      this.select = row.liveRoomId
    },
    close() {
      this.visible = false
    },
    // 跳转直播间报名设置
    toRegisterSetting() {
      const routeUrl = router.resolve(`/live/liveDetail/${this.liveRoomId}?type=registerSettings`)
      window.open(routeUrl.href, '_blank')
    },
    sure() {
      if (!this.select) {
        return this.$message.error('请选择预约直播间')
      }
      this.loading = true
      const params = {
        groupId: this.groupId,
        subscribeLiveRoomId: this.select,
        liveRoomId: this.liveRoomId,
        stayTime: this.value
      }
      liveSendSubscribeAjax(params).then(() => {
        this.loading = false
        this.success && this.success()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.sendGoods {
  // height: 433px;
  padding: 20px 20px 12px;
  .filterTop {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .myTable {
    width: 100%;
    height: 266px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #CBCFD3;
    overflow: hidden;
    .pagination {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: right;
    }
  }
  .sendGoodsFooter {
    padding: 20px 0;
    display: flex;
    align-items: center;
    .c_F53F3F {
      color: #F53F3F;
    }
    .sendGoodsFooterTxt {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-right: 10px;
    }
  }
}
.noDataPage {
  height: 370px;
  padding-top: 10px;
}
.ImageViewer {
  display: flex;
  align-items: center;
  .imgUrl {
    background: #fafafa;
    width: 80px;
    height: 60px;
    max-width: 80px;
    min-width: 80px;
  }
}
</style>
