<template>
  <el-drawer
    v-loading="loading"
    title="物流轨迹"
    :visible.sync="getVisible"
    width="40%"
    :before-close="handleClose"
    class="trajectoryInfo-drawer"
  >
    <div class="infoBox">
      <div><span>订单号</span> {{ row.orderNo }}</div>
      <div><span>物流状态</span> {{ row.logisticsStatusName }}</div>
    </div>
    <div v-for="(item,index) in list" :key="index" class="list-oy">
      <div v-if="list.length" class="info">
        <div><span>运单号</span> {{ item.expressNo }}</div>
      </div>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, i) in item.traces"
          :key="i"
          :timestamp="activity.acceptTime"
        >
          {{ activity.acceptStation }}
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="!list.length" description="暂无数据" />
    </div>
  </el-drawer>
</template>

<script>
import { getLogistics } from '@/api/business/orderLogistics'
export default {
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.getConfiguredTeacherList()
        } else {
          this.list = []
        }
      },
      deep: true
    }
  },
  methods: {
    async getConfiguredTeacherList() {
      this.loading = true
      getLogistics({ orderNo: this.row.orderNo })
        .then(res => {
          this.loading = false
          if (res.data) {
            this.list = res.data.map(item => JSON.parse(item))
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.trajectoryInfo-drawer {
  .infoBox{
    margin:20px;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    background: #f5f3a4;
    padding: 13px;
    border-radius: 5px;
    >div{
      flex:1;
      font-size: 14px;
      font-weight: 700;
      >span{
        color: #777777;
        margin-right: 10px;
      }

    }
  }
  .list-oy {
    padding: 20px;
    .info {
      display: flex;
      align-items: center;
      border-radius: 4px;
      background: #e7f0ff;
      padding: 13px;
      font-size: 14px;
      margin-bottom: 20px;
      div {
        width: 50%;
        font-weight: 700;
        span {
          font-weight: initial;
          color: #777777;
          margin-right: 10px;
        }
      }
    }
  }
}
::v-deep {
  .el-drawer__header {
    border-bottom: 1px solid #eff2f6;
    padding-bottom: 20px;
    margin-bottom: 0;
    span {
      font-weight: 700;
      color: #000;
      font-size: 16px;
    }
    .el-drawer__close-btn {
      i {
        color: #000;
      }
    }
  }
  .el-drawer__body {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #d8d8d8;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
  }
  .el-timeline-item__node {
    left: -3px;
    width: 16px;
    height: 16px;
  }
}
</style>
