<template>
  <div class="img-line">
    <div>
      <span>
        <el-tooltip
          v-if="statusd.autoDesensitizedStatus === 2"
          class="item"
          effect="dark"
          content="已自动脱敏"
          placement="top"
        >
          <img src="@/assets/image/video/zdtm_hover.png" />
        </el-tooltip>
        <el-tooltip
          v-else
          class="item"
          effect="dark"
          content="未自动脱敏"
          placement="top"
        >
          <img src="@/assets/image/video/zdtm.png" />
        </el-tooltip>
      </span>
      <span>
        <el-tooltip
          v-if="statusd.manualDesensitizedStatus === 2"
          class="item"
          effect="dark"
          content="已手动脱敏"
          placement="top"
        >
          <img src="@/assets/image/video/sdtm_hover.png" />
        </el-tooltip>
        <el-tooltip
          v-else
          class="item"
          effect="dark"
          content="未手动脱敏"
          placement="top"
        >
          <img src="@/assets/image/video/sdtm.png" />
        </el-tooltip>
      </span>
      <el-tooltip
        v-if="statusd.shareStatus === 1"
        class="item"
        effect="dark"
        content="已共享"
        placement="top"
      >
        <img src="@/assets/image/video/gxsp_hover.png" />
      </el-tooltip>
      <el-tooltip
        v-else
        class="item"
        effect="dark"
        content="未共享"
        placement="top"
      >
        <img src="@/assets/image/video/gxsp.png" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['statusd'],
  data() {
    return {}
  },
  mounted() {
    console.log('this.statusd: ', this.statusd)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.img-line {
  width: 110px;
  height: 24px;
  display: inline-block;
  img {
    float: left;
    width: 23px;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
