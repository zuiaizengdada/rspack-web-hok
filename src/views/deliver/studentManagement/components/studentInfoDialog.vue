<template>
  <!-- 学员信息弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['保存', '取消']"
    title="用户基本信息"
    width="730px"
    height="622px"
    :loading="loading"
    @success="sure"
  >
    <div
      v-if="config.visible"
      v-loading="loading"
      class="studentInfoDialog overflowOuto"
    >
      <el-form
        ref="ruleForm"
        size="small"
        :inline="true"
        :model="form"
        :rules="rules"
        label-width="77px"
      >
        <MTitle class="m-b-20">基本信息</MTitle>
        <el-form-item label="姓名" prop="realName">
          <el-input
            v-model.trim="form.realName"
            class="w-200"
            clearable
            :disabled="form.isDelivered"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model.trim="form.name" class="w-200" clearable />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="form.sex"
            placeholder="请选择"
            class="w-200"
            clearable
          >
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="ageCode">
          <el-select
            v-model="form.ageCode"
            clearable
            placeholder="请选择"
            class="w-200"
          >
            <el-option label="未知" value="0" />
            <el-option
              v-for="item in ageOption"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <MTitle class="m-b-20">联系方式</MTitle>
        <el-form-item label="微信号" prop="wechatNumber">
          <el-input v-model.trim="form.wechatNumber" class="w-200" clearable />
        </el-form-item>
        <el-form-item label="学员电话" prop="phone">
          <!-- <el-input  v-model.trim="form.phone" class="w-200" clearable /> -->
          <!-- <div class="w-200">{{ form.phone }}</div> -->
          <div class="w-200">
            <tablePhoneItem
              v-model="form.phoneNumber"
              :phone-area-code="form.phoneAreaCode"
              :row-data="form"
              type="user"
            />
          </div>
        </el-form-item>
        <el-form-item label="邮箱" prop="mailbox">
          <div class="w-200">
            <tableEmailItem v-model="form.email" :row-data="{userId:config.userId}" type="user" />
          </div>
        </el-form-item>
        <el-form-item label="备用手机" prop="backupPhone">
          <el-input
            v-model.trim="form.backupPhone"
            maxlength="11"
            class="w-200"
            clearable
            :disabled="form.isDelivered"
            @input="e => delNoNumber(e)"
          />
        </el-form-item>
        <MTitle class="m-b-20">公司情况</MTitle>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model.trim="form.company" class="w-200" clearable />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-select
            v-model="form.position"
            clearable
            placeholder="请选择"
            class="w-200"
          >
            <el-option
              v-for="item in positionOption"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所在行业" prop="industry">
          <el-select
            v-model="form.industry"
            clearable
            placeholder="请选择"
            class="w-200"
          >
            <el-option
              v-for="item in industryOption"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年营业额" prop="turnover">
          <el-select
            v-model="form.turnover"
            clearable
            placeholder="请选择"
            class="w-200"
          >
            <el-option
              v-for="item in turnoverOption"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-form-item label="主营业务" prop="introduce">
            <el-input
              v-model.trim="form.introduce"
              clearable
              class="w-200"
              maxlength="20"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="公司地址" prop="areaNameArr">
            <AppAreaSelect
              v-model="form.areaNameArr"
              :maxlevel="2"
              propsvalue="name"
              class="w-200"
            />
          </el-form-item>
        </el-row>
        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model.trim="form.address"
            clearable
            style="width: 496px"
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
// import { Detail } from '@/api/user/member'
import {
  deliveryEditPfUserAjax,
  deliverySelectPfUserAjax
} from '@/api/deliver/studentManagement'
import AppAreaSelect from '@/components/AppTemplate/AppAreaSelect/index'
import { getDict } from '@/utils/index'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
export default {
  components: {
    AppDialog,
    AppAreaSelect,
    tablePhoneItem,
    tableEmailItem
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          userId: '',
          platformUserId: ''
        }
      }
    }
  },
  data() {
    return {
      loading: true,
      form: {
        realName: '',
        name: '',
        sex: '',
        ageCode: '',
        wechatNumber: '',
        mailbox: '',
        phone: '',
        backupPhone: '',
        company: '',
        position: '',
        industry: '',
        turnover: '',
        introduce: '',
        address: '',
        areaNameArr: [],
        id: '',
        isDelivered: false // 是否交付
      },
      rules: {
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        ageCode: [{ required: true, message: '请选择年龄', trigger: 'change' }],
        company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请选择职位', trigger: 'change' }
        ],
        industry: [
          { required: true, message: '请选择所在行业', trigger: 'change' }
        ],
        turnover: [
          { required: true, message: '请选择年营业额', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入主营业务', trigger: 'blur' }
        ],
        areaNameArr: [
          { required: true, message: '请选择公司地址', trigger: 'change' }
        ]
      },
      industryOption: [], // 行业
      turnoverOption: [], // 营业额
      positionOption: [], // 职位
      ageOption: [] // 年龄
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.init()
      } else {
        this.form = {
          realName: '',
          name: '',
          sex: '',
          ageCode: '',
          wechatNumber: '',
          mailbox: '',
          phone: '',
          backupPhone: '',
          company: '',
          position: '',
          industry: '',
          turnover: '',
          introduce: '',
          address: '',
          areaName: [],
          id: '',
          isDelivered: false
        }
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      }
    }
  },
  mounted() {},
  methods: {
    init() {
      this.loading = true
      Promise.all([
        this.getDetail(),
        getDict('sys_position'),
        getDict('sys_industry'),
        getDict('sys_turnover'),
        getDict('sys_age')
      ])
        .then(res => {
          let areaNameArr = []
          if (res[0].areaName) {
            areaNameArr = res[0].areaName.split('\t')
          }
          this.form = {
            backupPhone: '',
            ...res[0],
            uid: this.config.userId,
            areaNameArr
          }
          this.positionOption = res[1]
          this.industryOption = res[2]
          this.turnoverOption = res[3]
          this.ageOption = res[4]
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getDetail() {
      this.loading = true
      return deliverySelectPfUserAjax({
        platformUserId: this.config.platformUserId
      }).then(res => {
        return res.data
      })
    },
    sure() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (
            this.form.backupPhone?.length > 0 &&
            this.form.backupPhone?.length < 11
          ) {
            console.log(this.form.backupPhone)
            this.loading = false
            return this.$message.error('请输入正确的备用手机号码')
          }
          const data = {
            id: this.form.id,
            platformUserId: this.config.platformUserId,
            cityCode: '',
            realName: this.form.realName,
            name: this.form.name,
            sex: this.form.sex,
            ageCode: this.form.ageCode,
            wechatNumber: this.form.wechatNumber,
            mailbox: this.form.mailbox,
            phone: this.form.phone,
            backupPhone: this.form.backupPhone,
            company: this.form.company,
            position: this.form.position,
            industry: this.form.industry,
            turnover: this.form.turnover,
            introduce: this.form.introduce,
            address: this.form.address,
            areaName: this.form.areaNameArr.join('\t')
          }
          delete data.areaNameArr
          deliveryEditPfUserAjax(data)
            .then(res => {
              this.$emit('success')
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    delNoNumber(e) {
      this.form.backupPhone = e.replace(/\D/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.studentInfoDialog {
  height: 622px;
  padding: 20px;
  box-sizing: border-box;
}
::v-deep {
  .el-form--inline .el-form-item {
    margin-right: 63px;
  }
}
</style>
