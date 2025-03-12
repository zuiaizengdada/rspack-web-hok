<!-- 用户编辑资料弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form ref="form" :model="form" label-width="100px" size="small" class="form" :rules="rules" label-position="left">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="form.phone" />
      </el-form-item>

      <el-form-item label="公司" prop="company">
        <el-input v-model.trim="form.company" />
      </el-form-item>

      <el-form-item label="微信号" prop="wechatNumber">
        <el-input v-model.trim="form.wechatNumber" />
      </el-form-item>

      <el-form-item label="邮箱" prop="mailbox">
        <el-input v-model.trim="form.mailbox" />
      </el-form-item>

      <el-form-item label="昵称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>

      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model.trim="form.realName" />
      </el-form-item>

      <el-form-item label="职位" prop="position">
        <el-select v-model="form.position" placeholder="请选择">
          <el-option label="董事长" value="董事长" />
          <el-option label="总经理" value="总经理" />
          <el-option label="高管" value="高管" />
          <el-option label="中层" value="中层" />
          <el-option label="普通员工" value="普通员工" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
          <el-option label="未知" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          class="w-200"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>

      <el-form-item label="地区" prop="city">
        <el-cascader v-model="form.city" class="w-100p" :options="city" :props="{label: 'label', value: 'label'}" />
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model.trim="form.address" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
      <el-button
        v-if="type !== 2"
        type="primary"
        size="small"
        @click="send()"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import city from '@/utils/city.js'
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          phone: '', // 手机号
          company: '', // 公司
          wechatNumber: '', // 微信号
          mailbox: '', // 邮箱
          name: '', // 昵称
          realName: '', // 真实用户
          position: '', // 职位
          sex: 3, // 性别 1为男性，2为女性，3未知
          birthday: '', // 生日
          city: ['', '', ''], // 省市区
          address: '' // 详细地址
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    outGoodsId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!/^[0-9]{11}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      city,
      //   loading: false,
      rules: {
        phone: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ]
      },
      form: {
        phone: '', // 手机号
        company: '', // 公司
        wechatNumber: '', // 微信号
        mailbox: '', // 邮箱
        name: '', // 昵称
        realName: '', // 真实用户
        position: '', // 职位
        sex: 3, // 性别 1为男性，2为女性，3未知
        birthday: '', // 生日
        city: ['', '', ''], // 省市区
        address: '' // 详细地址
      }
    }
  },
  computed: {
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue && this.type === 1) {
          this.form = {
            phone: '', // 手机号
            company: '', // 公司
            wechatNumber: '', // 微信号
            mailbox: '', // 邮箱
            name: '', // 昵称
            realName: '', // 真实用户
            position: '', // 职位
            sex: 3, // 性别 1为男性，2为女性，3未知
            birthday: '', // 生日
            city: ['', '', ''], // 省市区
            address: '' // 详细地址
          }
        } else if (newValue && this.type === 3) {
          this.form = this.data
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    send() {
      this.$refs.form.validate((valid) => {
        if (valid) {
        //   const params = {
        //     ...this.data,
        //     ...this.form
        //   }
        //   this.$emit('success', params)
          const cityCode = this.getCityCode(this.form.city)
          let areaName = ''
          if (this.form.city[0]) {
            areaName = this.form.city.join('/')
          }
          const data = {
            address: this.form.address || '',
            birthday: this.form.birthday || '',
            cityCode: cityCode,
            company: this.form.company || '',
            mailbox: this.form.mailbox || '',
            name: this.form.name || '',
            phone: this.form.phone || '',
            position: this.form.position || '',
            realName: this.form.realName || '',
            sex: this.form.sex || 1,
            wechatNumber: this.form.wechatNumber || '',
            areaName: areaName
          }
          this.$emit('success', data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCityCode(arr) {
      if (arr && arr[0]) {
        const obj = this.city.find(v => v.label === this.form.city[0])
        if (obj.children && obj.children.length > 0) {
          const areaName = obj.children.find(v => v.label === this.form.city[1])
          return areaName.value || ''
        } else {
          return obj.value || ''
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
.image_poster {
  background: #F5F7FA;
  border-radius: 4px;
  border: 1px solid #DCDCDC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
