<template>
  <div class="channel">
    <div v-if="!queryParams.isShowLogo" class="title">渠道业绩</div>
    <div v-else class="title-t">
      <div class="label-t">
        <img class="icon-t" :src="icon" alt="" />
        <span>{{ name }}店铺业绩</span>
      </div>
      <div class="back-t" @click="backQD">
        <img
          class="icon-b"
          src="@/assets/image/operateData/backqd.png"
          alt=""
        />
        <span>返回</span>
      </div>
    </div>
    <div class="tables">
      <div class="tr-t">
        <div class="th-t one" style="">{{ getLabel }}</div>
        <div class="th-t two" style="">{{ getTotalCountLabel }}</div>
        <div class="th-t three">{{ getTotalRatioLabel }}</div>
      </div>
      <div
        id="channelList"
        v-loading="loading"
        class="body-t"
        element-loading-spinner="el-icon-loading"
      >
        <div
          v-for="(item, tIndex) in tableData"
          :id="'channel' + tIndex"
          :key="tIndex"
          class="tr-d"
        >
          <div
            :class="{ 'td-t': true, 'select-td': item.isCheck }"
            @click="checkItem(item)"
          >
            <div class="headImg" style="width: 41%">
              <img :src="item.logoImgUrl" alt="" />
              <span>{{ item.name }}</span>
            </div>
            <div class="amount" style="width: 26%">
              <el-tooltip
                class="item"
                effect="dark"
                :content="filterPriceTo(item.amount)"
                placement="top"
              >
                <span>{{ filterPrice(item.amount) }}</span>
              </el-tooltip>
            </div>
            <div style="width: 32%" class="totalRatio">
              <img v-if="item.amountLinkRatio >= 0" :src="up" alt="" />
              <img v-else :src="down" alt="" />
              <span>{{ fillDataString(item.amountLinkRatio) }}</span>
            </div>
          </div>
          <span
            v-if="!queryParams.isShowLogo"
            class="detail"
            @click="toDetail(item)"
          >
            明细
            <img :src="gotoImg" alt="" />
          </span>
        </div>
        <el-empty
          v-if="tableData.length < 1"
          :image-size="70"
          description="暂无数据"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  channeRevenuelData,
  shopData
} from '@/api/business/board-hk/businessData'
import down from '@/assets/image/operateData/down.png'
import up from '@/assets/image/operateData/up.png'
import gotoImg from '@/assets/image/operateData/goto.png'
export default {
  components: {},
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      down,
      up,
      gotoImg,
      tableData: [],
      loading: false,
      active: 1, // 时间组件状态
      icon: '', // 图标
      name: '', // 店铺名称
      queryParams: {
        bizType: 3,
        isShowLogo: false, // 是否显示logo
        orderChannel: undefined
      }
    }
  },
  computed: {
    // 获取动态列文本
    getLabel() {
      return this.queryParams.isShowLogo ? '店铺' : '渠道'
    },
    // 获取动态列文本
    getTotalCountLabel() {
      return {
        1: '总营收',
        2: '退款金额',
        3: 'GMV',
        10: '直播带货',
        5: '视频带货',
        9: '线下录单',
        11: '私域线上成交'
      }[this.queryParams.bizType]
    },
    // 获取动态列文本
    getTotalRatioLabel() {
      return {
        1: '对比昨天',
        2: '较上同期',
        3: '对比上月',
        4: '对比去年',
        '': '较上同期'
      }[this.active]
    }
  },
  methods: {
    changeRecordActive(obj) {
      this.tableData.some(item => {
        if (item.shopId === obj.shopId) {
          item.isCheck = true
        }
      })
    },
    getDetail() {
      shopData({
        ...this.queryParams,
        shopId: undefined,
        isShowLogo: undefined
      }).then(res => {
        if (res.code === 1) {
          this.tableData = res.data.map((m, i) => ({
            ...m,
            isCheck:
              this.queryParams.itemIdList.findIndex(f => f === m.shopId) > -1,
            channelLevel: 3,
            index: i + 1,
            orderChannel: this.queryParams.orderChannel
          }))
        }
        this.position()
      })
    },
    toDetail(record) {
      this.name = record.name
      this.icon = record.logoImgUrl
      this.queryParams.isShowLogo = true
      this.queryParams.channelLevel = 2
      this.tableData = []
      this.$emit('checkItem', {
        ...record,
        isCheck: false,
        isShowLogo: true,
        channelLevel: 2
      })
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.quDaoDetailRecord = record
      setBuObj.quDaoRecord = {}
      setBuObj.channelLevel = this.queryParams.channelLevel
      setBuObj.isShowLogo = this.queryParams.isShowLogo
      setBuObj.orderChannel = record.orderChannel
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
    },
    position() {
      const i = this.tableData.findIndex(f => f.isCheck)
      if (i > -1) {
        this.$nextTick(() => {
          const el = document.getElementById('channelList')
          if (el) {
            const q = el.querySelector('#channel' + i)
            if (q) {
              q.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
              })
            }
          }
        })
      } else {
        this.$nextTick(() => {
          const el = document.getElementById('channelList')
          if (el) {
            el.scroll({ top: 0, behavior: 'smooth' })
          }
        })
      }
    },
    // 返回渠道
    backQD() {
      this.queryParams.orderChannel = undefined
      this.queryParams.channelLevel = undefined
      this.queryParams.itemIdList = undefined
      this.name = ''
      this.icon = ''
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.quDaoRecord = setBuObj.quDaoDetailRecord
      setBuObj.quDaoDetailRecord = {}
      setBuObj.isShowLogo = false
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.$emit('checkItem', {
        isShowLogo: false
      })
    },
    // 选择数据就行查询（渠道不同层级情况-方法共用）
    checkItem(record) {
      console.log('cccccooooorrrddddd::', record)
      if (!record.isCheck) {
        record.isCheck = true
        this.tableData.forEach(m => {
          if (m.index !== record.index) {
            m.isCheck = false
          }
        })
      } else {
        record.isCheck = false
      }
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      console.log('afterrrrrrrr:', record.isCheck)
      setBuObj.quDaoRecord = record.isCheck ? record : {}
      setBuObj.channelLevel = this.queryParams.channelLevel
      setBuObj.isShowLogo = this.queryParams.isShowLogo
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.$emit('checkItem', {
        ...record,
        isShowLogo: this.queryParams.channelLevel > 1,
        shopId:
          this.queryParams.channelLevel > 1 && record.isCheck
            ? record.shopId
            : undefined,
        orderChannel:
          this.queryParams.channelLevel > 1
            ? this.queryParams.orderChannel
            : record.isCheck
              ? record.orderChannel
              : undefined
      })
    },
    fillDataString(num) {
      const nums = num > 1000 ? '1000%+' : num.toFixed(2) + '%'
      return nums
    },
    // 过滤所有的数值
    filterPrice(value) {
      const v = Number((Number(value) / 100).toFixed(2))
      if (v < 10000) {
        return v
      }
      if (v >= 10000) return (parseInt(v * 0.0001 * 100) / 100).toFixed(2) + '万' // (v * 0.0001).toFixed(2)
    },
    filterPriceTo(value) {
      const v = (Number(value) / 100).toFixed(2) + ''
      return v
    },
    // 初始化数据
    initData(record) {
      this.active = record.type
      this.queryParams = {
        bizType: record.bizType,
        employeeUid: undefined,
        endTime: record.endTime,
        employeeDeptId: record.deptId,
        expertId: undefined,
        itemIdList:
          record.goodsId && record.goodsId.length > 0
            ? record.goodsId
            : undefined,
        productCategory: record.productCategory,
        orderChannel: record.channelLevel > 1 ? record.orderChannel : undefined,
        channelLevel: record.channelLevel,
        startTime: record.startTime,
        teacherIdList: record.teacherIdList,
        timeType: record.type,
        isShowLogo: record.isShowLogo,
        logoImgUrl: record.logoImgUrl,
        // shopId: record.shopId,
        channelLogoName: record.channelLogoName
      }

      const api =
        this.queryParams.channelLevel > 1 ? shopData : channeRevenuelData
      if (this.queryParams.channelLevel > 1 && this.queryParams.orderChannel) {
        this.icon = record.logoImgUrl
      }
      this.loading = true
      api({
        ...this.queryParams,
        shopId: undefined,
        channelLevel: undefined,
        channelLogoName: undefined,
        isShowLogo: undefined,
        logoImgUrl: undefined
      })
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.tableData = res.data.map((m, i) => ({
              ...m,
              isCheck:
                this.queryParams.channelLevel > 1 && m.shopId
                  ? m.shopId === record.shopId
                  : m.orderChannel === record.orderChannel,
              channelLevel: this.queryParams.channelLevel > 1 ? 2 : 1,
              index: i + 1,
              name:
                this.queryParams.channelLevel > 1
                  ? m.shopName
                  : m.orderChannelName,
              logoImgUrl:
                this.queryParams.channelLevel > 1
                  ? this.queryParams.logoImgUrl
                  : m.logoImgUrl
            }))
          }
          this.position()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.channel {
  width: 35%;
  min-width: 440px;
  height: 315px;
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 3px 11px 0px rgba(49, 66, 82, 0.1);
  overflow: hidden;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2c3242;
    padding: 24px;
    padding-bottom: 16px;
  }
  .tables {
    width: 100%;

    .tr-t {
      display: flex;
      align-items: center;
      padding: 0 24px;
      padding-bottom: 16px;
      .th-t {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2c3242;
      }
    }

    .body-t {
      width: 99.6%;
      overflow-y: auto;
      height: 200px;
      &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
        // display: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #d0d0d0;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
      }
      .tr-d {
        position: relative;
        .td-t {
          width: 80%;
          display: flex;
          align-items: center;
          padding: 6px 0 6px 6px;
          margin-left: 18px;
          .headImg {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #0586fe;
            img {
              width: 28px;
              height: 28px;
              margin-right: 10px;
            }
            span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .amount {
            font-size: 14px;
            font-family: ArialMT;
            color: #2c3242;
            padding-left: 2px;
            text-align: right;
          }
          .totalRatio {
            text-align: right;
            span {
              float: right;
            }
            img {
              float: right;
              width: 12px;
              height: 14px;
              margin-left: 6px;
              margin-top: 5px;
            }
          }
          &:hover {
            background-color: #fff;
            box-shadow: 0px 3px 11px 0px rgba(32, 58, 82, 0.13);
            border-radius: 8px;
          }
        }
        .select-td {
          border: 1px solid #00a3ff;
          background-color: #f4fbff !important;
          box-shadow: none !important;
          border-radius: 8px;
        }
        .detail {
          font-size: 12px;
          position: absolute;
          top: 27%;
          right: 20px;
          font-weight: 400;
          color: #00a3ff;
          margin-right: 4px;
          display: flex;
          align-items: center;
          img {
            width: 8px;
            height: 12px;
            margin-left: 8px;
            padding-top: 1px;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .one {
      min-width: 36%;
      width: 36%;
    }
    .two {
      width: 22%;
      text-align: right;
    }
    .three {
      width: 26%;
      text-align: right;
    }
  }
  .title-t {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    padding-bottom: 16px;
    .label-t {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2c3242;
      display: flex;
      align-items: center;
      .icon-t {
        width: 28px;
        height: 28px;
        margin-right: 16px;
      }
    }
    .back-t {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2f3545;
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
      .icon-b {
        width: 14px;
        height: 12px;
        margin-right: 4px;
      }
    }
  }
}
</style>
