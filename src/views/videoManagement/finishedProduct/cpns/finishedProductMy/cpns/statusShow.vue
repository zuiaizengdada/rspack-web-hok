<template>
  <div class="video-detail">
    <span v-if="subtitlestatus == 1">{{ zimuArray[subtitlestatus] }}</span>
    <span v-else-if="subtitlestatus == 2" class="yellow-cls">
      <i class="el-icon-info" />
      <p>{{ zimuArray[subtitlestatus] }}</p>
    </span>
    <span v-else-if="subtitlestatus == 3" class="yellow-cls success-span">
      <i class="el-icon-success" />
      <p>{{ zimuArray[subtitlestatus] }}</p>
    </span>
    <div v-else-if="subtitlestatus == 4" style="cursor: pointer">
      <span slot="reference" class="yellow-cls error-span">
        <i class="el-icon-error" />
        <p>{{ zimuArray[subtitlestatus] }}</p>
      </span>
    </div>

  </div>
</template>

<script>
export default {
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['subtitlestatus'],
  data() {
    return {
      zimuArray: ['', '未开始', '处理中', '已完成', '处理失败']
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
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
              width: 12px;
              height: 12px;
              background-image: url('~@/assets/image/video/icn_time.png');
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

