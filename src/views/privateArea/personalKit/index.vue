<template>
  <div class="personalKitBox">
    <el-button class="banckBtn" @click="handleBack">返回</el-button>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="开启状态" prop="switchStatus">
        <el-switch v-model="form.switchStatus" />
      </el-form-item>
      <el-form-item label="生效时间" prop="time">
        <div>
          <el-radio
            v-model="form.effectTimeType"
            :label="1"
            @change="handleEffectTime"
          >特定时间

            <el-date-picker
              v-model="form.time"
              style="width: 320px"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
            /></el-radio>
        </div>
        <div>
          <el-radio
            v-model="form.effectTimeType"
            :label="0"
            @change="handleEffectTime"
          >长期有效</el-radio>
        </div>
      </el-form-item>
      <el-form-item
        label="好友备注名"
        prop="iboxFriendRemarks"
        class="formItem"
      >
        <div class="formText">
          （
          <span>注：</span>可通过<span>拖拽</span>修改备注名的显示顺序，单个好友备注名最长不能超过20字
          ）
        </div>
        <div v-for="(item, index) in form.iboxFriendRemarks" :key="index" v-dragging="{ item: item, list: form.iboxFriendRemarks, group: 'item' }">
          <el-form-item v-if="item.friendRemarkType === 1">
            <div class="itemFlex">
              <el-checkbox v-model="item.isTick" label="来源IP老师" />
              <div>
                最长<el-input-number
                  v-model="item.length"
                  size="mini"
                  :controls="false"
                  :min="0"
                />
                字
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="item.friendRemarkType === 2">
            <div class="itemFlex">
              <el-checkbox v-model="item.isTick" label="微信昵称" />
              <div>
                最长<el-input-number
                  v-model="item.length"
                  size="mini"
                  :controls="false"
                  :min="0"
                />
                字
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="item.friendRemarkType === 3">
            <div class="itemFlex">
              <el-checkbox v-model="item.isTick" label="客户手机号" />
              <div class="minW">最长11个字</div>
            </div>
          </el-form-item>
          <el-form-item v-if="item.friendRemarkType === 4">
            <div class="itemFlex">
              <el-checkbox v-model="item.isTick" label="任务名称" />
              <div>
                最长<el-input-number
                  v-model="item.length"
                  size="mini"
                  :controls="false"
                  :min="0"
                />
                字
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="好友个人标签" prop="iboxPersonTags">
        <setTagsList
          v-model="form.iboxPersonTags"
          tag-type="2"
          :get-tag-query="getTagList"
        />
      </el-form-item>
      <el-form-item label="好友企业标签" prop="iboxQwTags">
        <setTagsList
          v-model="form.iboxQwTags"
          :is-add="false"
          placeholder="请选择标签"
        />
      </el-form-item>
      <el-form-item label="好友欢迎语" prop="iboxWelcomes">
        <welcomeMessageSettings
          ref="customTaskWelcomes"
          :is-hint="true"
          :type-tour="false"
          :is-wx-off="false"
          class="welBox"
          :hide-title="true"
          @change="getTaskWelcomes"
        />
      </el-form-item>
    </el-form>
    <div class="btnBox">
      <el-button
        type="primary"
        size="small"
        @click="handleSave"
      >保存</el-button>
      <el-button
        size="small"
        style="margin-left: 20px"
        @click="handleBack"
      >取消</el-button>
    </div>
  </div>
</template>
<script>
import welcomeMessageSettings from '../components/welcomeMessageSettings'
import {
  getPersonalKit,
  setPersonalKit,
  getHistoryPersonTag
} from '@/api/privateArea/personalKit'
import setTagsList from '@/components/setTagsList'
import moment from 'moment'
export default {
  components: {
    welcomeMessageSettings,
    setTagsList
  },
  data() {
    var checkTime = (rule, value, callback) => {
      if (!this.form.effectTimeType) return callback()
      if (!this.form.time || !this.form.time[0]) {
        return callback('请选择时间')
      }
      if (this.form.time[0] < moment().format('YYYY-MM-DD HH:mm')) {
        return callback('选择时间需要大于当前时间')
      }
      return callback()
    }
    return {
      labels: ['12', '213', '43'],
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      form: {
        time: '',
        switchStatus: 1,
        effectTimeType: 1,
        iboxFriendRemarks: [
          { friendRemarkType: 1, isTick: false, length: undefined },
          { friendRemarkType: 2, isTick: false, length: undefined },
          { friendRemarkType: 3, isTick: false, length: 11 },
          { friendRemarkType: 4, isTick: false, length: undefined }
        ],
        iboxPersonTags: [],
        iboxQwTags: []
      },
      radio: '1',
      rules: {
        time: [{ required: true, validator: checkTime, trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async getTagList(data) {
      const res = await getHistoryPersonTag(data)
      return (res.code === 1 && res.data?.length) ? res.data : []
    },
    handleEffectTime() {
      this.$refs.ruleForm.validateField('time')
    },
    async handleSave() {
      if (this.form.effectTimeType === 1) {
        if (!this.form.time[0] || !this.form.time[1]) {
          return this.$message.warning('请选择特定时间段！')
        }
      }
      const total = this.form.iboxFriendRemarks.reduce((a, b) => {
        return b.isTick ? a + b.length : a
      }, 0)
      if (total > 20) {
        return this.$message.warning('好友备注名总长度不能超过20！')
      }

      const iboxFriendRemarks = this.form.iboxFriendRemarks?.find(
        item => item.isTick && !item?.length
      )
      if (iboxFriendRemarks) {
        const map = {
          1: '来源IP老师',
          2: '微信昵称',
          3: '客户手机号',
          4: '任务名称'
        }
        return this.$message.warning(
          `${map[iboxFriendRemarks.friendRemarkType]} 请设置备注字数！`
        )
      }
      this.form = {
        ...this.form,
        effectTime: this.form?.time?.length ? this.form?.time[0] : '',
        expirTime: this.form?.time?.length ? this.form?.time[1] : ''
      }
      const { code } = await setPersonalKit(this.form)
      if (code === 1) {
        this.$message.success('保存成功!')
      }
    },
    handleBack() {
      this.$router.back()
    },
    async init() {
      const { code, data } = await getPersonalKit()
      if (code === 1 && data) {
        this.form = {
          ...data,
          time: [data.effectTime || '', data.expirTime || ''],
          iboxPersonTags: data?.iboxPersonTags || [],
          iboxQwTags: data?.iboxQwTags || []
        }
        const contentItem =
          data?.iboxWelcomes?.find(item => item?.content) || {}
        this.$refs.customTaskWelcomes.form.content = contentItem?.content ?? ''

        this.$refs.customTaskWelcomes.items =
          data?.iboxWelcomes?.filter(i => i.type) ?? []
      }
    },
    getTaskWelcomes(taskWelcomes) {
      this.form.iboxWelcomes = taskWelcomes
    }
  }
}
</script>
<style lang="scss" scoped>
.personalKitBox {
  width: 100%;
  height: calc(100vh - 160px);
  background: #ffffff;
  padding-top: 36px;
  position: relative;
  overflow: scroll;
  .banckBtn{
    position: absolute;
    right:20px;
    top:20px;
  }
  .tagsBox {
    width: 450px;
    padding: 0 15px;
    padding-bottom: 4px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    margin-top: 10px;
    > span {
      margin-right: 16px;
    }
  }
  > .btnBox {
    margin-left: 19px;
    padding-bottom: 18px;
  }
  .welBox {
    padding: 0;
  }
  .itemFlex {
    display: flex;
    align-items: center;
    .minW {
      width: 116px;
    }
    > div:nth-last-of-type(1) {
      margin-left: 20px;
      color: #999999;
      > span {
        color: rgb(245, 146, 146);
      }
    }
    > label {
      width: 140px;
    }
    .el-input-number {
      width: 60px;
      margin: 0 5px;
    }
  }
  .formItem {
    position: relative;
    .formText {
      left: 280px;
      color: #999999;
      position: absolute;
      > span {
        color: rgb(245, 146, 146);
      }
    }
  }
}
</style>
