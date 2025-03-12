<template>
  <HokDrawer v-model="visible" :loading="loading" :title="title">
    <div class="scriptSetting overflowOuto">
      <el-form ref="form" :model="form" label-width="80px">
        <el-divider content-position="left">账号初始化</el-divider>
        <el-form-item label="机器人个数">
          <el-input-number v-model="form.peopleNumber" :min="1" :max="999999999" label="机器人个数" />
        </el-form-item>
        <el-form-item label="生成机器人">
          <el-button @click="createUserId">生成机器人userId</el-button>
          <span>{{ form.userIds.length }} / {{ form.peopleNumber }}</span>
        </el-form-item>
        <el-form-item label="机器人加群">
          <el-button @click="userJoinGroup">加群</el-button>
        </el-form-item>
        <el-divider content-position="left">发消息</el-divider>
        <!-- <el-form-item label="机器人发言">
          <el-radio-group v-model="form.speakType">
            <el-radio :label="1">当前登录账号发言</el-radio>
            <el-radio :label="2">随机多个机器人发</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="消息类型" prop="msgType">
          <msgSelect v-model="form.msgContent" :type.sync="form.msgType" @onChange="onhandleTypeChange" />
        </el-form-item>
        <el-form-item label="发送条数" prop="sendNum">
          <el-input-number v-model="form.sendNum" :min="1" :max="999999999" label="发送条数" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" />
  </HokDrawer>
</template>
<script>
import HokDrawer from '@/views/live/Drawer/drawer'
import msgSelect from '@/views/live/script/scriptConfiguration/component/msgSelect.vue'
import router from '@/router'
export default {
  components: {
    HokDrawer,
    msgSelect
  },
  data() {
    var checkType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择话述类型'))
      } else if (this.form.msgContent === '') {
        const ErrorText = {
          1: '请输入内容',
          3: '请输入话述',
          2: '请输入内容',
          5: '请选择表情包',
          4: '请上传图片'
        }
        callback(new Error(ErrorText[value]))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      title: '脚本设置',
      visible: false,
      form: {
        peopleNumber: 1,
        userIds: [],
        speakType: 1,
        msgType: 3, // 消息类型
        msgContent: '', // 消息内容
        sendNum: 1
      },
      roomId: '',
      numTime: 0, // 执行次数
      rules: {
        msgType: [{ required: true, validator: checkType, trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    close() {
      this.visible = false
    },
    onhandleTypeChange() {
      this.$refs.form && this.$refs.form.clearValidate()
    },
    createUserId() {
      this.form.userIds = []
      for (let i = 0; i < this.form.peopleNumber; i++) {
        this.form.userIds.push({
          tim: null,
          ifLogin: false,
          ifJoinGrounp: false,
          userId: 'testUser' + i
        })
      }
    },
    userJoinGroup() {
      this.form.userIds.forEach((v) => {
        const { href } = router.resolve({
          path: `/liveRoom/${this.roomId}?userId=${v.userId}`
        })
        window.open(href, '_blank')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.scriptSetting {
  padding: 10px;
}
</style>
