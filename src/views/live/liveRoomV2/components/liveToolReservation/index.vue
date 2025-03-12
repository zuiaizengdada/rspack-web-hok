<template>
  <!-- 预约下一场 -->
  <div class="page_wrap">
    <div v-loading="loading" class="liveToolCoupon">
      <el-scrollbar ref="P5ScrollContainer" :vertical="false" class="liveToolCoupon_scroll">
        <div ref="formView" class="form">
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
            <el-empty description="暂无预约直播间" :image-size="150" :image="require('@/assets/image/live/noLive.png')" />
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="footerBtn">
      <el-button size="small" :loading="loading" @click="onhandleAddLiveRoom">添加直播间</el-button>
      <el-button v-if="list.length" size="small" :loading="loading" type="primary" @click="sure">发送</el-button>
      <!-- <el-button size="small" :loading="loading" type="primary" @click="toRegisterSetting">预约配置</el-button> -->
      <!-- <el-button size="small" :loading="loading" @click="close">取消</el-button> -->
    </div>

    <addLiveRoomDialog :config="addLiveRoomDialogConfig" @select="handleLiveRoomSelect" />
  </div>
</template>

<script>
import { liveSendSubscribeAjax } from '@/api/liveRoom/register'
import { getNextLivePreviewList, nextLivePreview } from '@/api/liveRoom/liveRoom.js'
import moment from 'moment'
import addLiveRoomDialog from './addLiveRoomDialog.vue'
import router from '@/router'
import { mapState } from 'vuex'
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
    addLiveRoomDialog
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
      liveRoomId: this.$route.params.id,
      groupId: '',
      options: [
        { label: '30秒', value: 30 },
        { label: '1分钟', value: 60 },
        { label: '5分钟', value: 300 },
        { label: '30分钟', value: 1800 },
        { label: '60分钟', value: 3600 }
      ],
      addLiveRoomDialogConfig: {
        visible: false,
        title: '选择直播间',
        liveRoomId: '',
        chooseList: []
      },
      select: '',
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  computed: {
    ...mapState({
      activeChangeType: state => state.im.activeChangeType
    })
  },
  watch: {
    'activeChangeType': {
      handler(val) {
        if (val.type === 'SUBSCRIBE_LIVE_ROOM_CHANGE') {
          this.getList()
        }
      }
    }
  },

  mounted() {
    this.pageInit()
    this.getList()
  },
  methods: {
    pageInit() {
      this.select = ''
    },
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
      getNextLivePreviewList(params).then(res => {
        console.log(res, 'res')
        // if (res.data?.liveRoomTrailers) {
        //   this.list = res.data?.liveRoomTrailers.map(item => {
        //     item.startTime = moment(item.startTime)
        //     return item
        //   }).sort((a, b) => a.startTime - b.startTime)
        // }
        this.list = res.data
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
        this.$message.success('操作成功')
        this.success && this.success()
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击添加直播间
    onhandleAddLiveRoom() {
      this.addLiveRoomDialogConfig.visible = true
      this.addLiveRoomDialogConfig.chooseList = this.list
      this.addLiveRoomDialogConfig.liveRoomId = this.$route.params.id
    },
    // 选择的直播间
    handleLiveRoomSelect(val) {
      console.log(val)
      this.loading = true
      val.forEach(item => {
        item.liveRoomId = item.id
      })
      const arr = JSON.parse(JSON.stringify(this.list))
      arr.push(...val)
      const liveRoomTrailers = arr.reduce((pre, next) => {
        pre.push(next.liveRoomId)
        return pre
      }, [])
      const data = {
        liveRoomId: this.liveRoomId,
        liveRoomTrailers: liveRoomTrailers
      }
      nextLivePreview(data).then(() => {
        this.getList()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // this.form.liveRoomTrailers.push(...val)
      // console.log(this.form.liveRoomTrailers)
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .liveToolCoupon {
    height: 100%;
    flex: 1 0 0;
    overflow: hidden;
    .liveToolCoupon_scroll {
      height: 100%;
    }
  }
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
    // padding-top: 10px;
    display: flex;
    align-items: center;
    /* padding-top: 10px; */
    justify-content: center;
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
  .pagination {
    position: absolute;
    right: 0;
    top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .page_btn {
      cursor: pointer;
      width: 19px;
      height: 19px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .page_btn + .page_btn {
      margin-left: 10px;
    }
    .previous_page {
      background-image: url(~@/assets/image/liveRoom/previous_page_d.png);
      &:hover {
        background-image: url(~@/assets/image/liveRoom/previous_page_c.png);
      }
    }
    .next_page {
      background-image: url(~@/assets/image/liveRoom/next_page_d.png);
      &:hover {
        background-image: url(~@/assets/image/liveRoom/next_page_c.png);
      }
    }
  }
  .footerBtn {
    width: 100%;
    height: 52px;
    min-height: 52px;
    max-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #DCDEE1;
    background: #fff;
    .footerBtnSure {
      width: 70px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #0C6FFF;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
    .revoke {
      border: 1px solid #DCDFE5;
      background: #F9F9F9;
      color: #000000;
    }
  }
}
</style>
