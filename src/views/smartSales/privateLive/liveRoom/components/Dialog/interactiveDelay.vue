<template>
  <AppDialog
    v-model="visible"
    title="互动脚本延时时间"
    width="620px"
    :loading="loading"
    height="auto"
    :top="top"
  >
    <div v-loading="loading" class="InteractiveDelay overflowOuto">
      <div class="InteractiveDelayForm">
        <span class="InteractiveDelayFormLabel m-r-10">互动整体延时时间</span>
        <el-select v-model="value" size="small" placeholder="请选择" style="width: 60px">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span class="InteractiveDelayFormLabel m-l-10">秒</span>
      </div>
      <div class="interactiveDelayTips m-t-20">
        <span>提示</span>
        <div class="interactiveDelayTipsContent">
          1、当调整延时间时，需要注意学员端的互动信息接收情况！<br>
          2、数值默认为0秒，数值越大，延时越高，数值越小，延时越小。
        </div>
        <div class="example">
          （例如：互动为0:00:15时送鲜花，往后延时5秒，则学员端收到消息的是0:00:20）
        </div>
      </div>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button size="small" :loading="loading" type="danger" @click="sure">确定</el-button>
      <el-button size="small" :loading="loading" @click="close()">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { operateInteract } from '@/api/liveRoom/im'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      value: 0,
      top: '114px',
      liveRoomId: '',
      options: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  watch: {
    visible: {
      handler(val) {
        console.log(this.liveRoomId)
        if (val) {
          this.$nextTick(() => {
            this.loading = true
            this.$store.dispatch('im/getGroupScript', this.liveRoomId).then(res => {
              this.value = res.data.delayTime
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 326) / 2 + 'px'
  },
  methods: {
    sure() {
      this.loading = true
      const data = {
        delayTime: Math.abs(this.value),
        delayType: this.value > 0 ? 1 : 2,
        liveRoomId: this.liveRoomId,
        operateType: 3
      }
      operateInteract(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.visible = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.InteractiveDelay {
    height: 262px;
    padding: 20px;
    .interactiveDelayTips {
        padding: 20px;
        background: #FEECEC;
        border-radius: 6px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #F53F3F;
        line-height: 22px;
        .interactiveDelayTipsContent {
            padding-left: 16px;
            font-size: 14px;
            color: #F53F3F;
        }
        .example {
            padding-left: 16px;
            font-size: 14px;
            color: #333333;
        }
    }
}
</style>
