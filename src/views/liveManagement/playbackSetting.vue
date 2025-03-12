<template>
  <div class="playbackSetting_page">
    <!-- 回放设置 -->
    <div class="playbackSwitch">
      <el-switch v-model="playbackSetting" />
      <div class="tips m-l-10">开启回放后，直播结束后直播间将播放回放视频</div>
    </div>

    <div v-if="playbackSetting" class="playbackSetting">
      <div class="m-r-20 m-t-10">回放有效期</div>
      <div>
        <el-radio-group v-model="playbackValidity.type">
          <el-radio :label="1" style="width: 100%" class="m-t-10">永久</el-radio>
          <el-radio :label="2" style="width: 100%" class="m-t-10">
            <span>限时，截止至</span>
            <el-date-picker
              v-model="playbackValidity.expirationTime"
              class="m-l-20"
              :disabled="playbackValidity.type !== 2"
              type="datetime"
              placeholder="请设置时间"
              :picker-options="pickerOptions"
            />
          </el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="playbackSetting">
      <div class="m-r-20 m-t-10">倍速/快进</div>
      <div>
        <el-radio-group v-model="playbackSpeed">
          <el-radio :label="1" style="width: 100%" class="m-t-10">
            <span>允许</span>
            <span class="tips m-l-10">用户可以倍速播放与自由拖动进度条</span>
          </el-radio>
          <el-radio :label="2" style="width: 100%" class="m-t-10">
            <span>禁止</span>
            <span class="tips m-l-10">课程未学完时，禁止倍速播放与拖动进度条</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      playbackSetting: true,
      playbackValidity: {
        type: 1,
        expirationTime: ''
      },
      playbackSpeed: 1,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
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
.playbackSetting_page {
  padding: 20px;
  .playbackSwitch {
    display: flex;
    align-items: center;
  }
  .playbackSetting {
    margin-top: 20px;
    display: flex;
    align-items: flex-start;
  }
}
</style>
