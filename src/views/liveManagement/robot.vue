<template>
  <div>
    <!-- 讨论设置 -->
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="首次回复">
        <el-switch v-model="form.first" />
        <span class="tips m-l-10">首次进入直播间自动回复</span>
      </el-form-item>

      <el-form-item v-if="form.first">
        <div class="firstView">
          <div class="firstViewImage">头像</div>
          <div class="firstViewRight">
            <div class="firstViewRightName tips">设置昵称</div>
            <div class="firstViewRightContent tips">请设置内容</div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="机器人设置">
        <el-switch v-model="form.robotSetting" />
        <span class="tips m-l-10">开启评论会按话术进行滚动播放</span>
      </el-form-item>
      <el-form-item v-if="form.robotSetting" label="话术">
        <el-radio-group v-model="form.word">
          <el-radio :label="1">随机</el-radio>
          <el-radio :label="2">按顺序</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.robotSetting" label="机器人">
        <el-radio-group v-model="form.robot">
          <el-radio :label="1">随机</el-radio>
          <el-radio :label="2">按顺序</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div v-if="form.robotSetting">
      <el-button type="primary">新增机器人</el-button>
      <el-table class="m-t-20" border :data="robotData" />
    </div>
    <div v-if="form.robotSetting" class="m-t-20">
      <el-button type="primary">新增话术</el-button>
      <el-table class="m-t-20" border :data="wordsData" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: {
        first: false,
        robotSetting: false,
        robot: 1,
        word: 1
      },
      robotData: [],
      wordsData: []
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.firstView {
  display: flex;
  align-items: center;
  .firstViewImage {
    width: 60px;
    height: 60px;
    background: #eee;
    margin-right: 10px;
    border-radius: 50%;
    text-align: center;
    line-height: 60px;
  }
  .firstViewRight {
    display: flex;
    flex-direction: column;
  }
}
</style>
