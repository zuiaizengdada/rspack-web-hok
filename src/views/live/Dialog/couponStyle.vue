<template>
  <AppDialog
    v-model="visible"
    title="添加优惠券"
    width="606px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <!-- 添加优惠券弹框 -->
    <div v-loading="loading" class="CouponStyle">
      <el-radio-group v-model="radio">
        <div class="couponStyleView">
          <div v-for="(item) in list" :key="item.value" class="couponStyleViewItem" :class="{checkRadio: item.value === radio}" @click="radio = item.value">
            <img :src="item.icon" class="CouponStyleImg" />
            <el-radio :label="item.value" class="CouponStyleRadio">{{ item.text }}</el-radio>
          </div>
        </div>
      </el-radio-group>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import couponBottom from '@/assets/image/live/couponBottom.png'
import couponCenter from '@/assets/image/live/couponCenter.png'
import { getLiveRoomInfo, setCouponStyle } from '@/api/liveRoom/index.js'
export default {
  components: {
    AppDialog
  },
  props: {
    successFn: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      top: '114px',
      loading: false,
      liveRoomId: '',
      visible: false,
      list: [
        { icon: couponCenter, text: '居中展示', value: 1 },
        { icon: couponBottom, text: '右下角展示', value: 2 }
      ],
      success: () => {},
      radio: 1
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          val && this.getDetail()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    sure() {
      this.loading = true
      const data = {
        couponStyle: this.radio,
        liveRoomId: this.liveRoomId
      }
      setCouponStyle(data).then(res => {
        this.loading = false
        this.$message.success('操作成功')
        this.success && this.success()
      }).catch(() => {
        this.loading = false
      })
    },
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId
      }
      getLiveRoomInfo(data).then(res => {
        console.log(res)
        this.radio = res.data.couponStyle || 2
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.addCoupon {
  height: 622px;
  padding: 35px 80px;
}
.couponStyleView {
    width: 606px;
    display: flex;
    align-items: center;
    justify-content: center;
    .couponStyleViewItem {
        width: 192px;
        height: 402px;
        flex-shrink: 0;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        background: #FFF;
        padding: 27px 24px 0;
        display: flex;
        flex-direction: column;
        margin: 35px 31px 28px;
        align-items: center;
        .CouponStyleImg {
            width: 144px;
            height: 311px;
        }
        .CouponStyleRadio {
            margin-top: 26px;
            font-weight: 600;
        }
    }
    .checkRadio {
        border: 1px solid #0091FF;
    }
}
</style>
