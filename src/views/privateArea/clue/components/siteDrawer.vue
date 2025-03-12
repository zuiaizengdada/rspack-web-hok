<template>
  <AppDialog
    :height="'450px'"
    :width="'568px'"
    :value="visible"
    :title="'填写收货地址'"
    @success="submit()"
    @close="handleClose"
  >
    <div class="content">
      <el-alert
        title="注意 填好后不允许修改， 请认真填写！"
        type="warning"
        show-icon
        :closable="false"
        class="alertBox"
      />
      <div class="address-paste">
        <el-input
          v-model="textarea"
          type="textarea"
          :rows="5"
          placeholder="请输入或粘贴收货地址信息，格式如：张三 13800138000 广东省深圳市南山区 xx 路 xx 号"
        />
        <div class="paste-b">
          <el-button type="primary" plain class="paste-btn" size="mini" @click="parseAddress">识别</el-button>
          <el-button plain class="paste-btn" size="mini" @click="handleCancel">清空</el-button>
        </div>
      </div>
      <el-form
        ref="ruleForm"
        :rules="rules"
        :inline="true"
        :model="form"
        label-width="90px"
      >
        <el-form-item label="收件人" prop="receiverName">
          <el-input
            v-model="form.receiverName"
            type="text"
            placeholder="请输入收件人姓名"
            maxlength="25"
            style="width: 400px"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="手机号" prop="receiverPhone">
          <el-input
            v-model="form.receiverPhone"
            type="text"
            placeholder="请输入手机号"
            maxlength="11"
            style="width: 400px"
            show-word-limit
            @input="e => delNoNumber(e, 'phone')"
          /></el-form-item>
        <el-form-item v-if="!filterAddressesFlag" label="所在地址" prop="site">
          <AppAreaSelect
            v-model="form.site"
            :maxlevel="2"
            :props="{
              expandTrigger: 'click',
              checkStrictly: true
            }"
          />
        </el-form-item>
        <el-form-item v-else label="所在地址" prop="site">
          <AppAreaSelect1
            v-model="form.site"
            :maxlevel="2"
            :props="{
              expandTrigger: 'click',
              checkStrictly: true
            }"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="receiverAddress">
          <el-input
            v-model="form.receiverAddress"
            type="textarea"
            placeholder="请输入内容"
            style="width: 400px"
            maxlength="120"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AddressParse from 'address-parse'
import AppDialog from '@/components/AppDialog'
// import AppAreaSite from '@/components/AppTemplate/AppAreaSite/index'
import AppAreaSelect from '@/components/AppTemplate/AppAreaSelect/index'
import AppAreaSelect1 from '@/components/AppTemplate/AppAreaSelect/index1'
import { getOrderReceiver } from '@/api/privateArea/clue'
import { getByShopId } from '@/api/shop/thirdShop.js'

export default {
  name: 'AccountConfiguration',
  components: {
    AppDialog,
    // AppAreaSite,
    AppAreaSelect,
    AppAreaSelect1
  },
  props: {
    orderNo: {
      type: [String, Number],
      default: ''
    },
    thirdShopId: {
      type: [String, Number],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {
        return {
          receiverName: '',
          receiverPhone: '',
          site: [],
          receiverAddress: ''
        }
      }
    }
  },
  data() {
    return {
      textarea: '',
      rules: {
        receiverName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        receiverPhone: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ],
        site: [{ required: true, message: '请先择地址', trigger: 'change' }],
        receiverAddress: [
          { required: true, message: '请输入详细地址', trigger: 'change' },
          { min: 2, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
        ]
      },
      filterAddressesFlag: false
    }
  },
  created() {
    this.getShop()
  },
  methods: {
    async getShop() {
      const res = await getByShopId({ shopId: this.thirdShopId })
      this.filterAddressesFlag = res.data.filterAddressesFlag
    },
    async parseAddress() {
      if (!this.textarea) {
        return
      }
      this.form.site = []
      this.form.addressName = []
      this.form.receiverName = ''
      this.form.receiverPhone = ''
      this.form.receiverAddress = ''
      // const address = this.textarea
      const rawText = this.textarea.trim()
      let text = rawText
      // 提取电话号码
      const phoneMatch = text.match(/1[3-9]\d{9}/)
      if (phoneMatch) {
        this.form.receiverPhone = phoneMatch[0]
        text = text.replace(this.form.receiverPhone, '').replace(/,/g, '').trim()
      }
      // 提取姓名（假设姓名是独立部分）
      const parts = text.split(/[,，]/).map(part => part.trim())
      for (let i = 0; i < parts.length; i++) {
        if (/^[\u4e00-\u9fa5]{2,4}$/.test(parts[i])) {
          this.name = parts[i]
          text = text.replace(this.name, '').replace(/,/g, '').trim()
          break
        }
      }
      // 解析地址
      const addressResult = AddressParse.parse(text)[0]
      console.log('AddressParse', addressResult)
      if (addressResult.phone && !this.form.receiverPhone) {
        this.form.receiverPhone = addressResult.phone
      }
      this.form.site = [addressResult.province, addressResult.city, addressResult.area]
      this.form.receiverName = addressResult.name
      this.form.receiverAddress = addressResult.details
      this.form.addressName = [addressResult.province, addressResult.city, addressResult.area]
    },
    handleCancel() {
      this.textarea = ''
      this.form.site = []
      this.form.addressName = []
      this.form.receiverName = ''
      this.form.receiverPhone = ''
      this.form.receiverAddress = ''
    },
    async submit() {
      if (this.form?.receiverPhone && !/^(1[3-9]\d{9}|[^1].*)$/.test(this.form?.receiverPhone)) {
        return this.$message.warning('手机号输入不正确！')
      }
      await this.$refs?.ruleForm?.validate()
      const addressCode = this.form.site
        ?.map(item => item.value)
        .join(',')
      const addressName = this.form.site.join(',')
      const { code } = await getOrderReceiver({
        ...this.form,
        addressCode,
        addressName,
        orderNo: this.orderNo
      })
      if (code === 1) {
        this.$message.success('信息保存成功')
        this.handleClose()
        this.$emit('handleOk')
      }
    },
    delNoNumber(e) {
      this.form.receiverPhone = e.replace(/[^0-9]/g, '')
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.content::v-deep {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  .alertBox {
    margin: 20px;
    margin-top: 0;
  }
  .el-cascader {
    width: 400px;
  }
  .form-list {
    margin-top: 24px;
  }
}
.top-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  .top-name {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin-top: 10px;
  }
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}
.address-paste{
  width: 100%;
  position: relative;
  margin-bottom: 15px;
}
.paste-b{
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.paste-btn{
  background: #fff;
  &:last-of-type{
    background: #F9F9F9;
  }
}
</style>
