<template>
  <AppDialog
    v-model="config.visible"
    :title="config.title"
    width="694px"
    height="auto"
    @success="send"
  >
    <div v-loading="loading" class="remindDialog">
      <el-row>
        <el-col :span="12">
          <div>
            合同到期前
            <el-input
              v-model="form.expireTime"
              class="m-r-8 m-l-8"
              size="mini"
              style="width: 116px"
              @input="e => delNoNumber(e, 'expireTime')"
            >
              <el-button slot="append" size="mini">天</el-button>
            </el-input>
            提醒
          </div>

          <div class="m-t-32">
            共提醒 {{ parseInt(form.expireTime / form.intervalIme) || '-' }} 次
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            每隔
            <el-input
              v-model="form.intervalIme"
              class="m-r-8 m-l-8"
              style="width: 126px"
              size="mini"
              @input="e => delNoNumber(e, 'intervalIme')"
            >
              <el-button slot="append" size="mini">天</el-button>
            </el-input>
            提醒
          </div>
          <div class="m-t-32 formView">
            <span class="m-r-8 formlabel">通知类型</span>
            <el-checkbox-group v-model="form.remindType">
              <!-- <el-checkbox :label="0">短信通知</el-checkbox> -->
              <el-checkbox :label="1">通知</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>

      <div class="m-t-32 formView">
        <span class="m-r-8 formlabel">通知对象</span>
        <div>
          <div :class="{ assessBox: form.remindPersonList.length > 0 }">
            <el-tag
              v-for="(tag, index) in form.remindPersonList"
              :key="tag.userId"
              class="remindPersonListView"
              closable
              @close="delAssessUsers(tag, index)"
            >{{ tag.nickName }}</el-tag>
            <el-button
              size="mini"
              class="remindPersonListView"
              @click="selectUser"
            ><i class="el-icon-plus el-icon--left" />添加通知对象</el-button>
          </div>
          <div v-if="form.remindPersonList.length > 0" class="tips m-t-8">
            已选{{ form.remindPersonList.length }}人
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getRuleInfo, teacherContarctExpireSave } from '@/api/tearchCenter'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          title: '合同到期提醒'
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        expireTime: '',
        intervalIme: '',
        remindType: [],
        remindPersonList: []
      }
    }
  },
  watch: {
    // 'config.visible'(newValue) {
    //   if (newValue) {
    //     this.init()
    //   }
    // }
    'config.visible': {
      handler: function (newValue) {
        if (newValue) {
          this.getRuleInfo()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    delNoNumber(e, key) {
      this.form[key] = e.replace(/\D/g, '')
    },
    // 点击添加通知人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.remindPersonList,
        maxlength: 10,
        success: res => {
          this.form.remindPersonList = res.user
        }
      })
    },
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.form.remindPersonList.splice(index, 1)
    },
    // 获取合同到期设置详情
    getRuleInfo() {
      this.loading = true
      getRuleInfo()
        .then(res => {
          console.log(res)
          const obj = {
            0: [0],
            1: [1],
            2: [0, 1]
          }
          const remindPersonList = []
          res.data.remindPersonList &&
            res.data.remindPersonList.map(v => {
              remindPersonList.push({
                userId: v.sendUserId,
                nickName: v.sendName,
                feishuOpenId: v.feishuOpenId
              })
            })
          this.form = {
            expireTime: res.data.expireTime,
            intervalIme: res.data.intervalIme,
            remindType: obj[res.data.remindType],
            remindPersonList: remindPersonList
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击确定
    send() {
      if (!this.form.expireTime) {
        return this.$message.error('请输入到期前时间')
      }
      if (!this.form.intervalIme) {
        return this.$message.error('请输入提醒间隔')
      }
      if (this.form.expireTime < this.form.intervalIme) {
        return this.$message.error('合同到期前多少天的值要大于每隔多少天的值')
      }
      const remindPersonList = []
      this.form.remindPersonList.map(v => {
        remindPersonList.push({
          feishuOpenId: v.feishuOpenId,
          sendUserId: v.userId
        })
      })
      let remindType = ''
      if (this.form.remindType.length === 2) {
        remindType = 2
      } else if (this.form.remindType.length === 1) {
        remindType = this.form.remindType[0]
      } else {
        return this.$message.error('请选择通知类型')
      }
      this.loading = true
      const data = {
        expireTime: this.form.expireTime,
        intervalIme: this.form.intervalIme,
        remindNumber: parseInt(this.form.expireTime / this.form.intervalIme),
        remindPersonList: remindPersonList,
        remindType: remindType
      }
      teacherContarctExpireSave(data)
        .then(res => {
          this.config.visible = false
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.remindDialog {
  padding: 20px 34px;
  box-sizing: border-box;
  color: #333;
}
.m-t-32 {
  margin-top: 32px;
}
.formView {
  display: flex;
  // align-items: center;
  .formlabel {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
}
.assessBox {
  width: 503px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .remindPersonListView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
}
</style>
