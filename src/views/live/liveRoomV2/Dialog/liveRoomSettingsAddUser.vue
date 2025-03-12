<template>
  <!-- 添加抽奖 -->
  <AppDialog
    v-model="visible"
    title="添加人员"
    width="500px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addLottery overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item prop="userInfo">
          <template slot="label">
            <el-select v-model="form.userInfo.label" placeholder="请选择" style="width: 100px" @change="onLabelChange">
              <el-option label="手机号码" value="tel" />
              <el-option label="邮箱" value="Email" />
            </el-select>
          </template>

          <template v-if="form.userInfo.label === 'tel'">
            <el-input v-if="form.userInfo.label === 'tel'" v-model.trim="form.userInfo.value.tel" style="width: 280px" clearable placeholder="请输入" maxlength="11" show-word-limit @input="delNumber">
              <el-select slot="prepend" v-model="form.userInfo.value.newPhoneAreacode" placeholder="请选择" filterable style="width: 100px">
                <el-option-group v-for="group in smsAreaList" :key="group.label" :label="group.label">
                  <el-option v-for="(item, index) in group.options" :key="index" :label="`+${item.areaCode} ${item.areaChineseName}`" :value="item.areaCode">
                    <span style="float: left">{{ item.areaChineseName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">+{{ item.areaCode }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-input>
          </template>
          <el-autocomplete
            v-if="form.userInfo.label === 'Email'"
            v-model.trim="form.userInfo.value.Email"
            :trigger-on-focus="false"
            style="width: 280px"
            :fetch-suggestions="querySearch"
            placeholder="请输入邮箱号"
          />
        </el-form-item>
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model.trim="form.name" style="width: 280px" clearable placeholder="请输入" />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="exportScriptFooter">
      <el-button size="small" type="primary" :loading="loading" @click="sure(1)">保存</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="sure(2)">保存并新增下一个</el-button>
      <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addImprtUser } from '@/api/liveRoom/detail.js'
export default {
  components: {
    AppDialog
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.form.userInfo.label === 'tel') {
        if (!this.form.userInfo.value.tel) {
          return callback(new Error('请输入手机号码'))
        }
        if (!this.form.userInfo.value.newPhoneAreacode) {
          return callback(new Error('请选择区号'))
        }
        return callback()
      } else if (this.form.userInfo.label === 'Email') {
        if (!this.form.userInfo.value.Email) {
          return callback(new Error('请输入邮箱'))
        }
        return callback()
      } else {
        callback(new Error('请选中类型'))
      }
    }
    return {
      loading: false,
      visible: true,
      liveRoomId: '',
      form: {
        name: '',
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '', newPhoneAreacode: '86' }
        }
      },
      rules: {
        userInfo: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      searchLoading: false,
      smsAreaList: [],
      mailSuffixesList: [],
      // smsAreaList: [], // 原始数据
      filterArrList: [], // 筛选数据
      top: '114px'
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          val && this.init()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    querySearch(queryString, cb) {
      const mailSuffixesList = [...this.mailSuffixesList]
      let list = []

      if (!queryString.includes('@')) {
        list = mailSuffixesList.map(suffix => ({
          value: `${queryString}${suffix}`,
          address: `${queryString}${suffix}`
        }))
      } else {
        const [strOne, strTwo] = queryString.split('@')
        const filteredSuffixes = strTwo ? mailSuffixesList.filter(suffix => suffix.includes(strTwo)) : mailSuffixesList

        list = filteredSuffixes.map(suffix => ({
          value: `${strOne}${suffix}`,
          address: `${strOne}${suffix}`
        }))
      }

      cb(list)
    },
    // 限制只能输入数字
    delNumber(e) {
      this.form.userInfo.value.tel = e.replace(/[^0-9]/g, '')
    },
    sure(type) {
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.addUserPhone(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存
    addUserPhone(type) {
      console.log(this.form)
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        userName: this.form.name,
        phone: this.form.userInfo.label === 'tel' ? this.form.userInfo.value.tel : '',
        phoneAreaCode: this.form.userInfo.label === 'tel' ? this.form.userInfo.value.newPhoneAreacode : '',
        email: this.form.userInfo.label === 'Email' ? this.form.userInfo.value.Email : ''
      }
      addImprtUser(data).then(res => {
        if (type === 1) {
          this.visible = false
        }
        this.success && this.success()
        this.form = {
          name: '',
          phone: '',
          userInfo: {
            label: 'tel',
            value: { tel: '', Email: '', newPhoneAreacode: '86' }
          }
        }
        // this.form.phone = ''
        // this.form.name = ''
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.filterArrList = JSON.parse(JSON.stringify(this.smsAreaList))
    },
    onLabelChange() {
      this.$refs.form && this.$refs.form.clearValidate()
    }
    // 保存并新增下一个
  }
}
</script>

<style lang='scss' scoped>
.addLottery {
  max-height: 516px;
  padding: 20px 34px;
}
.exportScriptFooter {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
}
</style>
