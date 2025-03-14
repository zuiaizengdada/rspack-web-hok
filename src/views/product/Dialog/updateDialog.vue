<template>
  <!-- 新增产品 -->
  <AppDialog
    v-model="visible"
    :title="title"
    width="640px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addProduct overflowOuto">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
        :validate-on-rule-change="true"
        @submit.native.prevent
      >
        <el-form-item label="是否完结">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <el-switch v-model="form.completeStatusFlag" />
            <el-link
              v-if="row.updateList.length"
              style="display: flex; justify-content: flex-start"
              type="primary"
              :underline="false"
              @click="openUrl"
            >查看更新记录</el-link>
          </div>
        </el-form-item>
        <el-form-item v-if="form.researchProgress !== 4" label="宣发周知链接">
          <el-input
            v-model.trim="form.dispersingLink"
            style="width: 450px"
            clearable
            placeholder="请填写宣发周知链接"
          />
        </el-form-item>
        <el-form-item v-if="form.researchProgress !== 4" label="上传文件">
          <fileUpload
            ref="productfileUpload"
            style="width: 450px"
            :limit="10"
            accept=".pdf,.docx,.doc,.jpg,.word"
            :before-video-upload="beforeVideoUpload"
            @change="fileChange"
          />
        </el-form-item>
        <el-form-item label="本次更新内容">
          <el-input
            v-model.trim="form.updateContent"
            :disabled="ifReview"
            style="width: 450px"
            clearable
            placeholder="请输入本次更新内容"
            type="textarea"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  researchProgressOption,
  sortLabelOption,
  deliveryMainBodyArray,
  goodsAttributeArray
} from '@/views/product/columns.js'
import { productUpdating } from '@/api/product/productManage.js'
import fileUpload from '@/views/product/productManage/uploadFile'
// import moment from 'moment'
// import { filtersMoneyByZero } from '@/filters/index'

export default {
  components: {
    AppDialog,
    fileUpload
  },
  data() {
    var validateResearchProgress = (rule, value, callback) => {
      if (!this.form.researchProgress) {
        return callback('请选择研发进度')
      } else if (this.form.researchProgress === 7 && !this.form.shelfDate) {
        return callback('请选择上架日期')
      } else {
        return callback()
      }
    }
    var validateGiveawayHas = (rule, value, callback) => {
      if (this.form.giveawayHas === 2 && this.form.giveawayUrls?.length === 0) {
        return callback('请上传文件')
      } else {
        return callback()
      }
    }
    var validateShelfAddress = (rule, value, callback) => {
      if (!this.form.shelfAddress) {
        return callback()
      }
      // var expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
      // var objExp = new RegExp(expression)
      // if (objExp.test(this.form.shelfAddress) === true) {
      //   return callback()
      // } else {
      //   return callback('请输入有效的上架地址, 格式http(s)://xxx')
      // }
      try {
        new URL(this.form.shelfAddress)
        return callback()
      } catch (err) {
        console.log(err)
        return callback('请输入有效的上架地址')
      }
    }
    return {
      appPlaceholder: '请输入关键字选择分配人',
      deliveryMainBodyArray,
      goodsAttributeArray,
      loading: false,
      visible: false,
      title: '新增更新',
      ifEdit: false,
      ifReview: false,
      row: { updateList: [] },
      form: {
        name: '',
        goodsAttribute: '',
        deliveryMainBody: 1,
        resetFields: '',
        researcherList: [],
        sortLabel: [],
        giveawayHas: 1,
        shelfDate: '',
        giveawayUrls: [],
        completeStatusFlag: false
      },
      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        sortLabel: [
          { required: true, message: '请选择分类标签', trigger: 'change' }
        ],
        goodsAttribute: [
          { required: true, message: '请选择商品属性', trigger: 'change' }
        ],
        distributionUser: [
          { required: true, message: '请选择分配人', trigger: 'change' }
        ],
        erpDistributionUser: [
          { required: true, message: '请填写ERP分配人', trigger: 'blur' }
        ],
        deliveryMainBody: [
          { required: true, message: '请选择交付主体', trigger: 'change' }
        ],
        expectedClassHour: [
          { required: true, message: '请输入预计课时', trigger: 'blur' }
        ],
        teacherName: [
          { required: true, message: '请输入老师名称', trigger: 'blur' }
        ],
        courseIntroduction: [
          { required: true, message: '请输入课程介绍', trigger: 'blur' }
        ],
        // materialAddress: [
        //   { required: true, message: '请输入素材图地址', trigger: 'blur' }
        // ],
        giveawayHas: [
          { required: true, validator: validateGiveawayHas, trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        researchProgress: [
          {
            required: true,
            validator: validateResearchProgress,
            trigger: 'change'
          }
        ],
        researcherList: [
          {
            required: true,
            type: 'array',
            message: '请输入研发人员',
            trigger: 'blur'
          }
        ],
        shelfAddress: [{ validator: validateShelfAddress, trigger: 'blur' }]
      },
      top: '114px',
      sortable: null,
      researchProgressOption,
      sortLabelOption,
      success: () => {},
      // 设置选择今天以及今天之前的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val && !this.ifEdit) {
          this.initAdd()
        } else if (val && this.ifEdit) {
          this.initEdit()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    openUrl() {
      this.$router.push({
        path: '/product/productDetail',
        query: { productId: this.row.id, isTo: '1' }
      })
    },
    loadData(row) {
      this.form = {
        name: '',
        goodsAttribute: '',
        deliveryMainBody: 1,
        resetFields: '',
        researcherList: [],
        sortLabel: [],
        giveawayHas: 1,
        shelfDate: '',
        giveawayUrls: [],
        completeStatusFlag: false
      }
      this.row = { ...row }
      console.log('rrrrrrr', row)
      this.initEdit()
    },
    clearGoodsAttributte() {
      if (this.form.sortLabel !== 3) {
        this.form.goodsAttribute = ''
      }
    },
    // 点击员工
    changeUser(res, info) {
      this.form.distributionUser = res
      // this.$refs['form'].resetFields('distributionUser')
      console.log('ssssssss:', res)
      console.log('ssssssss:', info)
    },
    // 限制只能输入数字
    delNumber(e, row) {
      let value = e
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
      if (value > 100000) {
        value = 100000
      }
      row.goodsPrice = value
    },
    sure() {
      if (this.form.researchProgress !== 4) {
        if (!this.form.dispersingLink && !this.form.giveawayUrls?.length) {
          this.$message.error('请输入宣发周知链接或者上传文件')
          return
        }
      }

      if (!this.form.updateContent) {
        this.$message.error('请输入更新内容')
        return
      }
      this.edit()
    },
    edit() {
      const data = {
        completeStatus: this.form.completeStatusFlag ? 0 : 1,
        dispersingLink: this.form.dispersingLink,
        updateContent: this.form.updateContent,
        dispersingUrlList: this.form.giveawayUrls,
        productId: this.form.id
      }
      this.loading = true
      productUpdating(data)
        .then(res => {
          if (res.code === 1) {
            this.visible = false
            this.$emit('successAdd')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    addAssistant() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.researcherList,
        maxlength: 50,
        success: res => {
          this.form.researcherList = res.user
          this.$refs.form && this.$refs.form.validateField('researcherList')
        }
      })
    },
    delAssistant(tag, index) {
      if (this.ifReview) {
        return
      }
      this.form.researcherList.splice(index, 1)
    },
    initEdit() {
      this.form = {
        ...this.row,
        completeStatusFlag: this.form.completeStatus === 0
      }
      this.row.dispersingUrlList =
        this.row.dispersingUrlList === 1 ? [] : this.row.dispersingUrlList || []
      const giveawayUrls = []
      this.row.dispersingUrlList.map(v => {
        giveawayUrls.push({
          status: 3,
          url: v
        })
      })
      this.form.giveawayUrls = giveawayUrls.map(m => m.url)
      this.$nextTick(() => {
        this.$refs.productfileUpload?.setFileList(giveawayUrls)
      })
    },
    initAdd() {
      // this.form.shelfDate = moment().format('YYYY-MM-DD 00:00:00')
    },
    beforeVideoUpload(file) {
      const suffix = this.$getFileType(file.name).suffix
      const ifFileType = ['doc', 'docx', 'pdf', 'word', 'jpg'].includes(suffix)
      if (!ifFileType) {
        this.$message.error({
          message: '请上传支持的文件格式',
          customClass: 'amap-sug-result'
        })
        return false
      }
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error({
          message: '文件最大不超过20M',
          customClass: 'amap-sug-result'
        })
        return false
      }
      return isLt20M && ifFileType
    },
    fileChange(res) {
      const arr = []
      res.map(v => {
        arr.push(v.url)
      })
      this.form.giveawayUrls = arr
      if ([0, 1].includes(arr.length)) {
        this.$refs.form && this.$refs.form.validateField('giveawayHas')
      }
    },
    giveawayHasChange(e) {
      e === 1 && this.$refs.form && this.$refs.form.validateField('giveawayHas')
    }
  }
}
</script>

<style lang="scss" scoped>
.addProduct {
  max-height: 604px;
  padding: 20px 34px;
}
.tips {
  margin-top: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 17px;
}
.myLotteryTable {
  width: 100%;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbcfd3;
  font-size: 12px;
  overflow: hidden;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
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
.hide {
  ::v-deep .fileBtnIcon {
    display: none;
  }
}
::v-deep .el-textarea textarea {
  height: 160px;
}
</style>
