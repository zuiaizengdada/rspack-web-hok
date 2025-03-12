<template>
  <div>
    <!-- 运营设置 -->
    <div class="header_tips">
      详情加群设置
    </div>
    <div class=" m-t-10">
      <span class="tips m-r-10">新进入直播间弹出提醒关注加群</span>
      <el-radio-group v-model="joinGrounp.visible">
        <el-radio :label="true">开启</el-radio>
        <el-radio :label="false">关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="joinGrounp m-t-10">
      <div class="grounpCodeImg">
        <!-- <el-image></el-image> -->
      </div>
      <el-button class="m-l-10 m-r-10">上传群二维码</el-button>
      <span class="tips">开启后，群二维码必须上传，选择关闭也可以上传群二维码，固定显示在详情页</span>
    </div>

    <div class="header_tips m-t-10">
      通知设置
    </div>

    <div class="m-t-10 remind">
      <div class="m-t-10">开课提醒</div>
      <div>
        <div class="m-l-20">
          <span class="tips m-r-10 w-100">短信预约提醒</span>
          <el-radio-group v-model="message.visible" class="m-r-10">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
          <template v-if="message.visible">
            <el-select v-model="message.time" placeholder="请选择" class="m-r-10">
              <el-option label="提前10分钟" :value="1" />
              <el-option label="提前30分钟" :value="2" />
              <el-option label="提前3小时" :value="3" />
              <el-option label="提前1天" :value="4" />
              <el-option label="提前3天" :value="5" />
            </el-select>
            <el-select v-model="message.num" placeholder="请选择">
              <el-option label="提醒1次" :value="1" />
              <el-option label="每10分钟1次" :value="2" />
              <el-option label="每小时1次" :value="3" />
              <el-option label="每天1次" :value="4" />
            </el-select>
          </template>
        </div>

        <div class="m-l-20 m-t-20">
          <span class="tips m-r-10 w-100">服务号预约提醒</span>
          <el-radio-group v-model="serviceNumber.visible" class="m-r-10">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
          <template v-if="serviceNumber.visible">
            <el-select v-model="serviceNumber.time" placeholder="请选择" class="m-r-10">
              <el-option label="提前10分钟" :value="1" />
              <el-option label="提前30分钟" :value="2" />
              <el-option label="提前3小时" :value="3" />
              <el-option label="提前1天" :value="4" />
              <el-option label="提前3天" :value="5" />
            </el-select>
            <el-select v-model="serviceNumber.num" placeholder="请选择">
              <el-option label="提醒1次" :value="1" />
              <el-option label="每10分钟1次" :value="2" />
              <el-option label="每小时1次" :value="3" />
              <el-option label="每天1次" :value="4" />
            </el-select>
          </template>
        </div>
      </div>
    </div>

    <div class="header_tips m-t-20">
      直播间信息设置
    </div>

    <div class="m-t-10">
      <div class="m-t-10">
        <span class="m-r-10">观看人次</span>
        <el-radio-group v-model="watchNumber">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </div>

      <div class="m-t-10">
        <span class="m-r-10">在线人数</span>
        <el-radio-group v-model="onlineUsers">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </div>

      <div class="m-t-10">
        <span class="m-r-10">直播热度</span>
        <el-radio-group v-model="livePopularity">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
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
      // 加群提醒
      joinGrounp: {
        visible: true,
        imgUrl: ''
      },
      // 短信预约提醒设置
      message: {
        visible: true,
        time: 1,
        num: 1
      },
      serviceNumber: {
        visible: true,
        time: 1,
        num: 1
      },
      watchNumber: true, // 观看人次
      onlineUsers: true, // 在线人数
      livePopularity: true // 直播热度
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.joinGrounp {
  display: flex;
  align-items: center;
  .grounpCodeImg {
    width: 200px;
    height: 200px;
    background: rgb(245, 247, 250);
  }
}
.header_tips {
  font-size: 20px;
  font-family: MicrosoftYaHei;
  color: rgba(51, 51, 51, 0.9);
  line-height: 28px;
  position: relative;
  padding-left: 10px;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 5px;
    width: 4px;
    height: 20px;
    background: #0C6FFF;
    border-radius: 3px;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.remind {
  display: flex;
  // align-items: flex-start;
}
.w-100 {
  display: inline-block;
  width: 100px;
}
</style>
