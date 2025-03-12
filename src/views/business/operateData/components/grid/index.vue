<template>
  <div class="grid_c">
    <chunk ref="cjjeRef" :obj="cjjeChunkObj" @handleClick="handleClick" />
    <chunk ref="tkjeRef" :obj="tkjeChunkObj" @handleClick="handleClick" />
    <chunk ref="nrdhRef" :obj="nrdhChunkObj" @handleClick="handleClick" />
    <chunk ref="zbdhRef" :obj="zbdhChunkObj" @handleClick="handleClick" />
    <chunk ref="zrcjRef" :obj="zrcjChunkObj" @handleClick="handleClick" />
  </div>
</template>
<script>
import {
  getQmv,
  getLiveBroadcast,
  getRefundAmount,
  getExpertSales,
  getUnexpertSale
} from '@/api/business'
import chunk from './chunk.vue'
export default {
  components: { chunk },
  data() {
    return {
      cjjeChunkObj: {
        title: '成交金额',
        value: 0,
        ratio: 0,
        contemporaneousPeriodAmount: 0,
        loading: false,
        active: 0,
        isCheck: true
      },
      tkjeChunkObj: {
        title: '退款金额',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false
      },
      nrdhChunkObj: {
        title: '内容带货',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false
      },
      zbdhChunkObj: {
        title: '直播带货',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false
      },
      zrcjChunkObj: {
        title: '自然成交',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false
      }
    }
  },
  methods: {
    handleClick(key) {
      this.cjjeChunkObj.isCheck = key === '成交金额'
      this.tkjeChunkObj.isCheck = key === '退款金额'
      this.nrdhChunkObj.isCheck = key === '内容带货'
      this.zbdhChunkObj.isCheck = key === '直播带货'
      this.zrcjChunkObj.isCheck = key === '自然成交'
      // 重新定义orderSource
      const mapOrderSource = {
        成交金额: '-1',
        退款金额: 999,
        内容带货: 1,
        直播带货: 2,
        自然成交: 0
      }[key]
      this.$emit('gridChage', mapOrderSource)
    },
    initData(params) {
      this.apis(params)
    },
    apis(data) {
      const params = { ...data }

      delete params.orderSource
      return Promise.all([
        this.getQmv(params),
        this.getRefundAmount(params),
        this.getExpertSales(params),
        this.getUnexpertSale(params),
        this.getLiveBroadcast(params)
      ])
        .then(() => {})
        .catch(err => {
          console.log(err, 'err')
        })
    },
    // 成交金额
    getQmv(params) {
      this.cjjeChunkObj.loading = true
      this.cjjeChunkObj.active = params.type
      return new Promise((resolve, reject) => {
        getQmv({ ...params, type: params.type === 0 ? 1 : params.type })
          .then(res => {
            this.cjjeChunkObj.loading = false
            this.cjjeChunkObj.value = res.data.amount
            this.cjjeChunkObj.contemporaneousPeriodAmount = res.data.contemporaneousPeriodAmount
            this.cjjeChunkObj.ratio = res.data.contemporaneousPeriodRatio
            resolve()
          })
          .catch(err => {
            this.cjjeChunkObj.loading = false
            reject(err)
          })
      })
    },
    // 退款金额
    getRefundAmount(params) {
      this.tkjeChunkObj.loading = true
      this.tkjeChunkObj.active = params.type
      return new Promise((resolve, reject) => {
        getRefundAmount({ ...params, type: params.type === 0 ? 1 : params.type })
          .then(res => {
            this.tkjeChunkObj.loading = false
            this.tkjeChunkObj.value = res.data.amount
            this.tkjeChunkObj.ratio = res.data.contemporaneousPeriodRatio
            resolve()
          })
          .catch(err => {
            this.tkjeChunkObj.loading = false
            reject(err)
          })
      })
    },
    // 内容带货
    getExpertSales(params) {
      this.nrdhChunkObj.loading = true
      this.nrdhChunkObj.active = params.type
      return new Promise((resolve, reject) => {
        getExpertSales({ ...params, type: params.type === 0 ? 1 : params.type })
          .then(res => {
            this.nrdhChunkObj.loading = false
            this.nrdhChunkObj.value = res.data.amount
            this.nrdhChunkObj.ratio = res.data.contemporaneousPeriodRatio
            resolve()
          })
          .catch(err => {
            this.nrdhChunkObj.loading = false
            reject(err)
          })
      })
    },
    // 直播带货
    getLiveBroadcast(params) {
      this.zbdhChunkObj.loading = true
      this.zbdhChunkObj.active = params.type
      return new Promise((resolve, reject) => {
        getLiveBroadcast({ ...params, type: params.type === 0 ? 1 : params.type })
          .then(res => {
            this.zbdhChunkObj.loading = false
            this.zbdhChunkObj.value = res.data.amount
            this.zbdhChunkObj.ratio = res.data.contemporaneousPeriodRatio
            resolve()
          })
          .catch(err => {
            this.zbdhChunkObj.loading = false
            reject(err)
          })
      })
    },
    // 自然成交
    getUnexpertSale(params) {
      this.zrcjChunkObj.loading = true
      this.zrcjChunkObj.active = params.type
      return new Promise((resolve, reject) => {
        getUnexpertSale({ ...params, type: params.type === 0 ? 1 : params.type })
          .then(res => {
            this.zrcjChunkObj.loading = false
            this.zrcjChunkObj.value = res.data.amount
            this.zrcjChunkObj.ratio = res.data.contemporaneousPeriodRatio
            resolve()
          })
          .catch(err => {
            this.zrcjChunkObj.loading = false
            reject(err)
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.grid_c {
  width: 100%;
}
</style>
