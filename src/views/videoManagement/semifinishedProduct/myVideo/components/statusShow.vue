<template>
  <div class="video-detail">
    <span v-if="subtitlestatus == 1">{{ zimuArray[subtitlestatus] }}</span>
    <span v-else-if="subtitlestatus == 2" class="yellow-cls">
      <i class="el-ic-time" />
      <p>{{ zimuArray[subtitlestatus] }}</p>
    </span>
    <span v-else-if="subtitlestatus == 3" class="yellow-cls success-span">
      <i class="el-icon-success" />
      <p>{{ zimuArray[subtitlestatus] }}</p>
    </span>
    <div v-else-if="subtitlestatus == 4" style="cursor: pointer">
      <template>
        <el-popover
          placement="bottom"
          width="200"
          trigger="hover"
        >
          <span class="chuli-cls">处理失败，点击<em @click="rewordCl">重新处理</em></span>
          <span slot="reference" class="yellow-cls error-span">
            <i class="el-icon-error" />
            <p>{{ zimuArray[subtitlestatus] }}</p>
          </span>
        </el-popover>
      </template>
    </div>

  </div>
</template>

<script>
import { semiVideoReflow, finishVideoReflow } from '@/api/videoManagement/vedioSetting'
export default {
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['subtitlestatus', 'videotype', 'semiVideoId'],
  data() {
    return {
      zimuArray: ['', '未开始', '处理中', '已完成', '处理失败']
    }
  },
  mounted() {
    console.log(this.videotype)
  },
  created() {
  },
  methods: {
    rewordCl() {
      if (this.videotype === 3) {
        semiVideoReflow(this.semiVideoId).then(res => {
          console.log('******************:', res)
          if (res.success) {
            this.$message.success('正在重新处理字幕')
            this.$emit('reloadData')
            this.$emit('reloadDatasg')
          }
        })
      } else if (this.videotype === 4) {
        finishVideoReflow(this.semiVideoId).then(res => {
          console.log('******************:', res)
          if (res.success) {
            this.$message.success('正在重新脱敏')
            this.$emit('reloadData')
            this.$emit('reloadDatasg')
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.video-detail {
    width: 100%;
    .yellow-cls {
        color: #FF7D00;
        height: 23px;
        float: left;
        border-radius: 10px;
        padding: 0 10px;
        background: #FFF2E6;
        i {
            float: left;
            margin-top: 5px;
            margin-right: 3px;
        }
        .el-ic-time {
              width: 14px;
              height: 14px;
              background-image: url('../../../../../assets/image/video/icn_time.png');
              background-size: 100%;
            }
        p {
            float: left;
        }
    }
    .success-span {
        color: #00B42A;
        background: #E6F7EA;
    }
    .error-span {
        color: #F53F3F;
        background: #FEECEC;
    }

}
.chuli-cls {
    em {
        font-style: normal;
        color: #0C6FFF;
        text-decoration:underline;
        cursor: pointer;
        margin-left: 5px;
    }
}

</style>

