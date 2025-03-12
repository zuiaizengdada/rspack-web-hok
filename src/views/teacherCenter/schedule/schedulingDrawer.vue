<template>
  <el-drawer :with-header="false" :visible.sync="config.visible" direction="rtl" size="1198px">
    <div class="myDrawerContent">
      <!-- 顶部 -->
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">{{ config.title }}</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div v-if="config.visible" class="ss-material-box-content overflowOuto">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="70px" class="demo-ruleForm">
          <el-form-item label="选择日期" prop="scheduleDate">
            <el-input v-model="form.scheduleDate" class="w-200" :disabled="true" />
          </el-form-item>
          <el-form-item label="IP" prop="teacherName">
            <el-input v-model="form.teacherName" class="w-200" :disabled="true" />
          </el-form-item>
          <el-form-item label="事项" prop="addSchedulingDate">
            <div v-for="(item, index) in form.detailParams" :key="index" class="detailParams">
              <div>
                <el-time-select
                  v-model="item.notifyTime"
                  :picker-options="{
                    start: '6:00',
                    step: '00:30',
                    end: '23:30',
                    maxTime: item.notifyEndTime
                  }"
                  style="width:120px"
                  class="m-r-8"
                  :disabled="disableTime()"
                  placeholder="开始时间"
                />
                <span>-</span>
                <el-time-select
                  v-model="item.notifyEndTime"
                  :picker-options="{
                    start: '6:00',
                    step: '00:30',
                    end: '23:30',
                    minTime: item.notifyTime,
                  }"
                  style="width:120px"
                  class="m-r-8 m-l-8"
                  :disabled="disableTime()"
                  placeholder="结束时间"
                />
                <el-input
                  v-model="item.content"
                  class=" m-r-16"
                  :disabled="disableTime()"
                  maxlength="20"
                  style="width:200px"
                  show-word-limit
                />
              </div>

              <div class="precautions">
                <div>
                  <div :class="{ assessBox: item.followUsers.length > 0 }">
                    <el-tag
                      v-for="tag in item.followUsers"
                      :key="tag.userId"
                      :closable="!disableTime()"
                      class="assessUsersView"
                      @close="delUsers(tag, index)"
                    >{{ tag.nickName }}</el-tag>
                    <el-button
                      size="mini"
                      class="assessUsersView"
                      :disabled="disableTime()"
                      @click="selectUser(index)"
                    ><i class="el-icon-plus el-icon--left" />添加跟进人</el-button>
                  </div>
                  <div v-if="item.followUsers.length > 0" class="tips m-t-8">已选{{ item.followUsers.length }}人</div>
                </div>
                <div class="remind">
                  <el-checkbox
                    v-model="item.remindFlag"
                    :disabled="
                      item.followUsers.length === 0 ||
                        !item.notifyTime ||
                        !item.content || disableTime()
                    "
                  >需要提醒</el-checkbox>
                </div>
                <div class="delbtn" @click="delPrecautions(index)">
                  <i class="el-icon-delete" />
                </div>
              </div>
            </div>

            <div v-if="form.detailParams.length < 20 && !disableTime()" class="addSchedulingDate" @click="addPrecautions">
              <i class="el-icon-plus" />添加事项
            </div>
          </el-form-item>
          <el-form-item label="背景色" prop="backgroundColor">
            <div class="backgroundBox">
              <div
                v-for="(item, index) in backgroundArr"
                :key="index"
                :style="{ background: item.label }"
                class="backgroundView"
                @click="selectBackground(item.value)"
              >
                <svg-icon v-if="form.backgroundColor === item.value" icon-class="whiteSuccess" class="selecticon" />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部 -->
      <div class="ss-material-box-bottom">
        <el-button size="mini" :loading="loading" type="primary" @click="succese()">确定</el-button>
        <el-button size="mini" :loading="loading" @click="close()">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import moment from 'moment'
import { teacherScheduleSave } from '@/api/tearchCenter/index'
export default {
  components: {},
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          title: '',
          backgroundColor: '', // 背景颜色
          detailParams: [], // 日程事项
          teacherId: '',
          tearchName: ''
        }
      }
    }
  },
  data() {
    return {
      moment,
      loading: false,
      rules: {
        scheduleDate: []
      },
      backgroundArr: [
        { label: '#7FA6FD', value: '#B9CEFD', des: '蓝色' },
        { label: '#BCA4F5', value: '#DFD6F5', des: '紫色' },
        { label: '#FA8D8A', value: '#FABEBC', des: '橙色' },
        { label: '#FAC6A3', value: '#FAE4D5', des: '红色' },
        { label: '#FEE698', value: '#FEF2CC', des: '黄色' },
        { label: '#C3C7C9', value: '#DCE0E3', des: '灰色' }
      ],
      form: {
        backgroundColor: '',
        detailParams: [
          {
            content: '',
            remindFlag: false,
            followUsers: []
          }
        ],
        scheduleDate: '',
        teacherId: ''
      },
      pickerOptions: {
        selectableRange: `${moment().add(2, 'minutes').format('HH:mm:ss')} - 23:59:59`
      }
    }
  },
  watch: {
    'config.visible': {
      handler: function (newValue) {
        if (newValue) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    TimeDisabledFn(notifyTime) {
      if (!notifyTime) {
        return false
      } else if (this.config.scheduleDate !== moment(new Date()).format('YYYY-MM-DD')) {
        return false
      } else {
        return notifyTime < moment(new Date()).format('HH:mm')
      }
    },
    disableTime() {
      return moment(this.form.scheduleDate).isBefore(moment()) && !(moment(this.form.scheduleDate).isSame(moment(), 'day'))
    },
    init() {
      this.form = {
        backgroundColor: this.config.backgroundColor,
        detailParams: this.config.scheduleItem,
        scheduleDate: this.config.scheduleDate,
        teacherId: this.config.teacherId,
        teacherName: this.config.teacherName
      }
      if (this.config.scheduleDate === moment(new Date()).format('YYYY-MM-DD')) {
        this.pickerOptions.selectableRange = `${moment().add(2, 'minutes').format('HH:mm:ss')} - 23:59:59`
      } else {
        this.pickerOptions.selectableRange = `00:00:00 - 23:59:59`
      }
    },
    // 点击确定
    succese() {
      // this.config.visible = false
      this.form.detailParams.map((v) => {
        v.scheduleUsers = v.followUsers
      })
      this.loading = true
      const data = {
        backgroundColor: this.form.backgroundColor,
        detailParams: this.form.detailParams,
        scheduleDate: this.form.scheduleDate,
        teacherId: this.form.teacherId
      }
      teacherScheduleSave(data)
        .then((res) => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.config.visible = false
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击关闭/取消
    close() {
      this.config.visible = false
    },
    // 点击选择背景色
    selectBackground(value) {
      if (this.form.backgroundColor === value) {
        this.form.backgroundColor = ''
      } else {
        this.form.backgroundColor = value
      }
    },
    // 点击添加跟进人
    selectUser(index) {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.detailParams[index].followUsers,
        maxlength: 3,
        success: (res) => {
          this.form.detailParams[index].followUsers = res.user
        }
      })
    },
    // 点击删除跟进人
    delUsers(tag, index) {
      const i = this.form.detailParams[index].followUsers.findIndex((v) => v.userId === tag.userId)
      this.form.detailParams[index].followUsers.splice(i, 1)
    },
    // 点击添加事项
    addPrecautions() {
      this.form.detailParams.push({
        content: '',
        notifyTime: '',
        notifyEndTime: '',
        remindFlag: false,
        followUsers: []
      })
    },
    // 点击删除事项
    delPrecautions(index) {
      this.form.detailParams.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.myDrawerContent ::v-deep{
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #DCDFE6;
    color: #777;
    cursor: not-allowed;
  }

  .backgroundBox {
    display: flex;
    align-items: center;
    height: 38px;
    .backgroundView {
      margin-right: 27px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .selecticon {
        width: 10px;
        height: 10px;
      }
    }
  }
}
.ss-material-box-header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 52px;
  padding: 15px 20px;
  background: #fff;
  border-radius: 2px 2px 0 0;
  border-bottom: 1px solid #f2f2f2;
  color: #353535;
  font-size: 16px;
  font-weight: 500;
  .ss-material-box-header-title {
    font-weight: bold;
    color: #333333;
    max-width: 300px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
.close {
  color: #b2b2b2;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.ss-material-box-content {
  flex: 1 0 0;
  padding: 20px 50px 20px 20px;
  box-sizing: border-box;
  .addSchedulingDate {
    width: 104px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px dashed #0c6fff;
    cursor: pointer;
    color: #0c6fff;
    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.ss-material-box-bottom {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  height: 60px;
  background-color: #fff;
  border-radius: 2px 2px 0 0;
  border-top: 1px solid #e7e7e7;
}
.assessBox {
  width: 418px;
  box-sizing: border-box;
  padding: 10px 8px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .assessUsersView {
    margin-right: 16px;
    margin-bottom: 10px;
  }
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
}
.precautions {
  align-items: center;
  display: flex;
  .remind {
    flex: 1 0 0;
    padding-left: 21px;
    box-sizing: border-box;
  }
  .delbtn {
    margin-left: 8px;
    cursor: pointer;
  }
}
.detailParams {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
}
.detailParams + .detailParams {
  padding-top: 20px;
  border-top: 1px solid #e7e7e7;
}
</style>
