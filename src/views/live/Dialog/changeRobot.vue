<template>
  <AppDialog
    v-model="visible"
    title="更换用户名"
    width="540px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="changeRobot overflowOuto">
      <div class="changeRobotTips">
        <i class="el-icon-warning-outline" />
        选择更换用户名，将更新本脚本下的该用户的所有发言内容。
      </div>
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="原用户名" prop="originalRobotId">
          <!-- <el-input v-model="form.originalRobotId" /> -->
          <AppSelect
            :value="form.originalRobotId"
            :label="form.originalRobotName"
            :get-api-fn="getOriginalRobot"
            search-key="robotNickName"
            :popover-width="423"
            :props="{
              label: 'robotNickName',
              value: 'robotId'
            }"
            @selected="selectOriginalRobot"
          >
            <div slot-scope="{ row }" class="robotSelectLabel">
              <AppAvatar :avatar="row.robotHeadPic" :name="row.robotNickName" :width="26" :no-name="true" />
              <span class="myLabel" :title="row['robotNickName']">{{ row['robotNickName'] }}</span>
            </div>
          </AppSelect>
        </el-form-item>
        <el-form-item label="新用户名" prop="newRobotId">
          <!-- <el-input v-model="form.newRobotId" /> -->
          <AppSelect
            :value="form.newRobotId"
            :label="form.newRobotName"
            :get-api-fn="getAllRobot"
            search-key="robotNickName"
            :popover-width="423"
            :props="{
              label: 'robotNickName',
              value: 'robotId'
            }"
            @selected="selectRobot"
          >
            <div slot-scope="{ row }" class="robotSelectLabel">
              <AppAvatar :avatar="row.robotHeadPic" :name="row.robotNickName" :width="26" :no-name="true" />
              <span class="myLabel" :title="row['robotNickName']">{{ row['robotNickName'] }}</span>
            </div>
          </AppSelect>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppSelect from '@/components/AppSelect/index'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { getRobotListByScriptId, updateRobot, getRobotsFuzzyExclude } from '@/api/liveRoom/robot'
export default {
  components: {
    AppDialog,
    AppSelect,
    AppAvatar
  },
  data() {
    return {
      loading: false,
      visible: true,
      top: '114px',
      scriptId: '',
      form: {
        originalRobotId: '',
        originalRobotName: '',
        newRobotId: '',
        newRobotName: ''
      },
      rules: {
        originalRobotId: [
          { required: true, message: '请选择原用户名', trigger: 'blur' }
        ],
        newRobotId: [
          { required: true, message: '请选择新用户名', trigger: 'blur' }
        ]
      },
      success: () => {}
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 310) / 2 + 'px'
  },
  methods: {
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.visible = false
          const data = {
            newRobotId: this.form.newRobotId,
            originalRobotId: this.form.originalRobotId,
            scriptId: this.scriptId
          }
          updateRobot(data).then(res => {
            this.success && this.success()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取机器人列表
    getAllRobot(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        scriptId: this.scriptId,
        robotNickName: params.robotNickName
      }
      return getRobotsFuzzyExclude(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    getOriginalRobot(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        scriptId: this.scriptId,
        robotNickName: params.robotNickName
      }
      return getRobotListByScriptId(data).then(res => {
        return {
          items: res.data,
          total: res.data.length
        }
      })
    },
    // 选中机器人触发
    selectRobot(res) {
      this.form.newRobotId = res.robotId
      this.form.newRobotName = res.robotNickName
      this.$refs.form && this.$refs.form.validateField('newRobotId')
    },
    selectOriginalRobot(res) {
      this.form.originalRobotId = res.robotId
      this.form.originalRobotName = res.robotNickName
      this.$refs.form && this.$refs.form.validateField('originalRobotId')
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .tearchInput {
    width: 423px;
  }
}
.changeRobot {
  height: 200px;
  padding: 20px;
  .changeRobotTips {
    padding: 8px 20px;
    background: rgba(254, 236, 236, .4);
    border-radius: 6px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
    line-height: 22px;
    margin-bottom: 20px;
  }
}
.robotSelectLabel {
  display: flex;
  align-items: center;
  .myLabel {
    margin-left: 5px;
    width: 100%;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
}
</style>
