<template>
  <AppDialog
    v-model="config.visible"
    title="新增赠品"
    width="490px"
    :loading="loading"
    height="auto"
  >
    <div class="addDialog overflowOuto">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item label="赠送类型" prop="giveawayType">
          <el-radio-group v-model="form.giveawayType" @change="typeChange">
            <el-radio :label="1">虚拟商品</el-radio>
            <el-radio :label="2">实物商品</el-radio>
            <el-radio :label="3">优惠券</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 虚拟商品 -->
        <template v-if="form.giveawayType === 1">
          <el-form-item label="选择商品" prop="giveawayId">
            <el-button
              v-if="!form.giveawayId"
              type="primary"
              @click="selectGoods"
            >去选择</el-button>
            <el-tag
              v-else
              :disable-transitions="true"
              closable
              class="tagLabel"
              @close="delGoods"
              @click="selectGoods"
            >{{ form.goodsName }}</el-tag>
          </el-form-item>
        </template>

        <!-- 实物商品 -->
        <template v-if="form.giveawayType === 2">
          <el-form-item label="奖品名称" prop="giveawayName">
            <el-input
              ref="userInput"
              v-model.trim="form.giveawayName"
              clearable
              show-word-limit
              placeholder="请输入"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="奖品图片" prop="giveawayUrl">
            <upload
              ref="MUpload"
              width="100"
              height="100"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :max-length="1"
              oss-teacher-folder="hok_liveRoom"
              :get-oss-c-onfig-api="getLiveOssCConfig"
              @onClick="onClick"
              @change="fileChange"
            />
          </el-form-item>
          <el-form-item label="奖品价格" prop="giveawayPrice">
            <el-input
              v-model.trim="form.giveawayPrice"
              clearable
              show-word-limit
              placeholder="请输入"
              @input="delNumber('giveawayPrice')"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </template>

        <!-- 优惠券 -->
        <template v-if="form.giveawayType === 3">
          <el-form-item label="选择优惠券" prop="couponNo">
            <el-button
              v-if="!form.couponNo"
              type="primary"
              @click="selectCoupon"
            >去选择</el-button>
            <el-tag
              v-else
              :disable-transitions="true"
              closable
              class="tagLabel"
              @close="delCoupon"
              @click="selectCoupon"
            >{{ form.couponName }}</el-tag>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div slot="footer" class="addDialogFooter">
      <!-- <el-button class="btn_primary" :loading="loading" size="small" @click="sure(true)">保存并新增下一个</el-button> -->
      <el-button
        type="primary"
        :loading="loading"
        size="small"
        @click="sure(false)"
      >确定</el-button>
      <el-button
        size="small"
        :loading="loading"
        @click="onhandleCancel"
      >取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import Dialog from '@/views/live/Dialog/index.js'
import upload from '@/components/AppUploadView/upload.vue'
import { getFileType } from '@/utils/index'
import { giftAdd, getLiveOssCConfig } from '@/api/liveRoom/index'
export default {
  components: {
    AppDialog,
    upload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    }
  },
  data() {
    var checkGiveawayPrice = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入奖品价格'))
      } else if (value === 0 || value === '0' || value < 1) {
        return callback(new Error('奖品价格不能小于1元'))
      } else {
        return callback()
      }
    }
    return {
      getLiveOssCConfig,
      form: {
        giveawayName: '',
        giveawayPrice: '',
        giveawayType: 1,
        giveawayUrl: '',
        giveawayId: '',
        goodsId: '',
        goodsName: '',
        couponName: '',
        couponNo: ''
      },
      rules: {
        giveawayType: [
          { required: true, message: '请选择赠送类型', trigger: 'change' }
        ],
        giveawayId: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        couponNo: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        giveawayName: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' }
        ],
        giveawayUrl: [
          { required: true, message: '请上传奖品图片', trigger: 'change' }
        ],
        giveawayPrice: [
          { required: true, trigger: 'blur', validator: checkGiveawayPrice }
        ]
      },
      loading: false
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    delNumber(key) {
      // 限制输入两位小数
      let value = this.form[key]
      value = value
        .replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
        .replace(/^\./g, '') // 验证第一个字符是数字而不是点
        .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
        .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
        .replace(/\./g, '') // 2、将字符串的点直接清掉
        .replace('$#$', '.') // 3、将复杂字符再转换回点
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (value.indexOf('.') < 0 && value !== '') {
        value = parseFloat(value)
      } else if (value.indexOf('.') > 1 && value[0] === '0') {
        value = parseFloat(value)
      }
      if (value > 10000) {
        value = 10000
      }
      // this.$set向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新
      // 调用方法：this.$set( target, key, value )
      // target：要更改的数据源(可以是对象或者数组)
      // key：要更改的具体数据
      // value ：重新赋的值
      this.$set(this.form, key, value.toString())
    },
    typeChange() {
      if (this.form.giveawayType === 2 && this.form.giveawayUrl) {
        this.$nextTick(() => {
          this.$refs.MUpload &&
            this.$refs.MUpload.setFileList([
              {
                status: 3,
                url: this.form.giveawayUrl
              }
            ])
        })
      } else {
        this.$nextTick(() => {
          this.$refs.MUpload && this.$refs.MUpload.setFileList([])
        })
      }
      this.$refs.form && this.$refs.form.clearValidate()
    },
    init() {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = {
        giveawayName: '',
        giveawayPrice: '',
        giveawayType: 1,
        giveawayUrl: '',
        goodsId: '',
        giveawayId: '',
        goodsName: '',
        couponName: '',
        couponNo: ''
      }
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
    },
    sure(type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          this.onhandleAdd(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeUpload(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      // const isLt20M = file.size / 1024 / 1024 < 20
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      }
      return isIMAGE
    },
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.form.giveawayUrl = res[0].url
      }
    },
    onClick(res) {
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
      this.form.giveawayUrl = ''
    },
    onhandleCancel() {
      this.config.visible = false
    },
    onhandleAdd(type) {
      this.loading = true
      let goodsId
      if (this.form.giveawayType === 1) {
        goodsId = this.form.giveawayId
      } else if (this.form.giveawayType === 3) {
        goodsId = this.form.couponNo
      }
      const data = {
        giveawayName: this.form.giveawayName,
        giveawayPrice: this.form.giveawayPrice * 100,
        giveawayType: this.form.giveawayType,
        giveawayUrl: this.form.giveawayUrl,
        goodsId
      }
      giftAdd(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.loading = false
          this.$emit('success', type)
          type && this.init()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击选择商品
    selectGoods() {
      this.$SelectGoods({
        visible: true,
        multiple: false,
        initSearch: {
          tagType: 5
        },
        tabList: [{ id: '3', name: '普通专栏', api: '' }],
        currentId: '3',
        disabledFn: row => {
          return row.salePrice === 0
        },
        success: res => {
          if (res.length > 0) {
            this.form.goodsName = res[0].contentName
            this.form.giveawayId = res[0].goodsId
          }
        }
      })
    },
    // 点击选择优惠券
    selectCoupon() {
      Dialog.open({
        type: 'AddCoupon',
        visible: true,
        addCouponType: 2,
        successFn: res => {
          this.form.couponName = res[0].couponName
          this.form.couponNo = res[0].couponNo
          Dialog.close()
        }
      })
    },
    // 删除已选的优惠劵
    delCoupon() {
      this.form.couponName = ''
      this.form.couponNo = ''
    },
    delGoods() {
      this.form.giveawayId = ''
      this.form.goodsName = ''
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 100px;
      height: 100px;
    }
  }
}
.addDialog {
  padding: 18px 20px;
}
.addDialogFooter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
}
.userAvatar {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-left: 8px;
}
.tagLabel {
  cursor: pointer;
  max-width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
