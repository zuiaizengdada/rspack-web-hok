<template>
  <div class="wrapper-online-detail-data">
    <div class="choose-detail">
      <span :class="detailDetailType === 0?'active':''" @click="changeDetailType(0)">{{ formDetailData.employeeDeptId?'团队数据':'部门数据' }}</span>
      <span :class="detailDetailType === 1?'active':''" @click="changeDetailType(1)">IP老师</span>
      <span v-if="!hasChannel" :class="detailDetailType === 2?'active':''" @click="changeDetailType(2)">渠道</span>
      <span v-else :class="detailDetailType === 3?'active':''" @click="changeDetailType(3)">店铺</span>
    </div>
    <div class="choose-detail-line" />
    <div class="deta-data-center">
      <div v-if="detailDetailType === 0">
        <departData ref="departData" @changeDeptMent="changeDeptMent" />
      </div>
      <div v-if="detailDetailType === 1">
        <ipTearcher ref="ipTearcher" @addTearcherData="addTearcherData" />
      </div>
      <div v-if="detailDetailType === 2">
        <channelData ref="channelData" />
      </div>
      <div v-if="detailDetailType === 3">
        <shopData ref="shopData" />
      </div>
    </div>
  </div>
</template>

<script>
import departData from './detailDataCom/departData.vue'
import ipTearcher from './detailDataCom/ipTearcher.vue'
import channelData from './detailDataCom/channelData.vue'
import shopData from './detailDataCom/shopData.vue'
export default {
  components: {
    departData,
    ipTearcher,
    channelData,
    shopData
  },
  data() {
    return {
      detailDetailType: 0,
      hasChannel: false,
      formDetailData: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    addTearcherData(obj) {
      this.$emit('addTearcherData', obj)
    },
    changeDeptMent(obj, type) {
      this.$emit('changeDeptMent', obj, type)
    },
    init(item) {
      this.formDetailData = item
      console.log('进入到detail页面：', item)
      if (item.orderChannel && item.orderChannel.length > 0) {
        this.hasChannel = true
      } else {
        this.hasChannel = false
      }
      if ((item.orderChannel && item.orderChannel.length >= 1) && this.detailDetailType === 2) {
        this.detailDetailType = 3
      }
      if ((!item.orderChannel || item.orderChannel.length === 0) && this.detailDetailType === 3) {
        this.detailDetailType = 2
      }
      this.$nextTick(() => {
        if (this.detailDetailType === 0) {
          this.$refs.departData.init(item)
        } else if (this.detailDetailType === 1) {
          this.$refs.ipTearcher.init(item)
        } else if (this.detailDetailType === 2) {
          this.$refs.channelData.init(item)
        } else if (this.detailDetailType === 3) {
          this.$refs.shopData.init(item)
        }
      })
    },
    changeDetailType(type) {
      this.detailDetailType = type
      console.log('啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦')
      this.$nextTick(() => {
        if (this.detailDetailType === 0) {
          this.$refs.departData.init(this.formDetailData)
        } else if (this.detailDetailType === 1) {
          this.$refs.ipTearcher.init(this.formDetailData)
        } else if (this.detailDetailType === 2) {
          this.$refs.channelData.init(this.formDetailData)
        } else if (this.detailDetailType === 3) {
          this.$refs.shopData.init(this.formDetailData)
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-detail-data {
    margin-top: 20px;
    width: 100%;
    background: #fff;
    display: inline-block;
    padding: 20px;
    .choose-detail {
        width: 100%;
        height: 40px;
        border-radius: 10px;
        display: inline-block;
        span {
            width: 120px;
            height: 38px;
            margin-right: 5px;
            text-align: center;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            line-height: 38px;
            border-radius: 5px;
            display: inline-block;
            background: #F7F7F7;
            color: #000;
            cursor: pointer;
        }
        span.active {
            background: #E7F1FE;
            color: #0C6FFF;
        }
    }
    .choose-detail-line {
        margin-top: 20px;
        width: 100%;
        height: 1px;
        background: #d9d9d94d;
    }
    .deta-data-center {
        width: 100%;
        float: left;
    }
  }
  </style>
