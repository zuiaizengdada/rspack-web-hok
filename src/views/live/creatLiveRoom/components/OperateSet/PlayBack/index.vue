<template>
  <div class="coupon-add-container">
    <div class="header  relative">
      <el-radio v-model="form.playbackSwitch" :label="false" @input="handleInputPlayBack">关闭</el-radio>
      <el-radio v-model="form.playbackSwitch" :label="true" @input="handleInputPlayBack">开启</el-radio>
      <!-- <span v-show="isDisabled" class="tips absolute" style="top:0;left:130px; color:red">真人直播需要在直播结束后开启回放</span> -->
    </div>
    <div v-show="form.playbackSwitch" class="content" style="margin-top:20px;">
      <el-form :model="form" size="mini" label-width="100px" label-position="right">
        <el-form-item label="开放对象" prop="authorizedPersonnel">
          <el-radio-group v-model="form.authorizedPersonnel" @input="handleInputAuthorized">
            <el-radio label="2">所有人员</el-radio>
            <el-radio label="1">所有进过直播间的人员</el-radio>
            <el-radio label="3">指定人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="回放有效期" prop="validityType">
          <div class="flex items-center">
            <el-radio v-model="form.validityType" label="1" @input="handleInputValidityType">一年</el-radio>
            <div class="flex items-center">
              <el-radio v-model="form.validityType" label="2" @input="handleInputValidityType">限时</el-radio>
              <p>
                <el-date-picker
                  v-model="form.expirationDateStr"
                  type="date"
                  placeholder="选择日期时间"
                  @change="handleChangeExpirationDate"
                />
                <span class="tips">到期后，学员无法观看回放内容，但仍可以进直播间查看聊天内容。</span>
              </p>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <designated-personnel v-show="form.authorizedPersonnel==='3'" style="width:960px" @change="handleChangeTable" />
    </div>
  </div>
</template>
<script>
import moment from 'moment'

import DesignatedPersonnel from './DesignatedPersonnel.vue'
export default {
  components: {
    DesignatedPersonnel
  },
  data() {
    return {
      form: {
        playbackSwitch: false,
        authorizedPersonnel: '2', // 开放对象 1-观看过直播间的所有人员 2-所有获得邀课链接的人员 3-指定白名单人员
        validityType: '1', // 回放类型 1-一年 2-自定义时间
        expirationDateStr: '', // 自定义日期 yyyy-MM-dd HH:mm:ss
        studentPhoneList: [],
        liveRoomId: ''
      },

      isDisabled: false
    }
  },

  inject: ['global'],

  methods: {
    handleInputAuthorized(val) {
      if (Number(val) === 3) {
        this.form.liveRoomId = this.global.liveRoomId
      } else {
        this.form.liveRoomId = ''
      }
      this.$emit('change', this.form)
    },
    handleInputPlayBack() {
      this.$emit('change', this.form)
    },
    handleInputValidityType() {
      this.$emit('change', this.form)
    },
    handleChangeExpirationDate(val) {
      this.form.expirationDateStr = moment(val).format('YYYY-MM-DD HH:mm:ss')
      this.$emit('change', this.form)
    },
    updatePlaybackStatus(bool) {
      this.isDisabled = Boolean(bool)
    },
    handleChangeTable() {}
  }
}
</script>
  <style lang="scss" scoped>
  .content{
      background: rgba(231, 240, 255, 0.4);
      padding:12px;
  }
  .tips{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    margin-left: 16px;
    vertical-align: middle;
  }
  </style>
