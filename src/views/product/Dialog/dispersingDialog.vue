<template>
  <!-- 新增产品 -->
  <AppDialog
    v-model="visible"
    :title="title"
    width="640px"
    :loading="loading"
    height="auto"
    :top="top"
    :btn-footer="!isReview"
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
        <el-form-item
          v-if="(form.dispersingLink && isReview) || !isReview"
          label="宣发周知链接"
        >
          <el-input
            v-if="!isReview"
            v-model.trim="form.dispersingLink"
            style="width: 450px"
            clearable
            placeholder="请填写宣发周知链接"
          />
          <el-link v-else type="primary" :underline="false" @click="openUrl()">
            {{ form.dispersingLink }}
          </el-link>
        </el-form-item>
        <el-form-item
          v-if="(form.dispersingUrlList.length && isReview) || !isReview"
          label="上传文件"
        >
          <fileUpload
            ref="productfileUpload"
            style="width: 450px"
            :limit="10"
            :is-review="isReview"
            accept=".pdf,.docx,.doc,.jpg,.word"
            :before-video-upload="beforeVideoUpload"
            @change="fileChange"
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
} from '@/views/live/columns.js'
import { productDispersing } from '@/api/product/productManage.js'
import fileUpload from '@/views/product/productManage/uploadFile'
// import { filtersMoneyByZero } from '@/filters/index'

export default {
  components: {
    AppDialog,
    fileUpload
  },
  data() {
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
      title: '宣发周知',
      ifEdit: false,
      ifReview: false,
      row: {},
      form: {
        dispersingLink: '',
        id: '',
        dispersingUrlList: []
      },
      rules: {
        giveawayHas: [
          { required: true, validator: validateGiveawayHas, trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
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
      },
      isReview: false
    }
  },
  watch: {},
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    openUrl() {
      window.open(this.form.dispersingLink, '_blank')
    },
    loadData(row) {
      this.row = { ...row }
      console.log('roooooooooooo:', row)
      this.initEdit()
    },
    sure() {
      this.edit()
    },
    edit() {
      if (
        this.form?.dispersingUrlList?.length <= 0 &&
        !this.form.dispersingLink
      ) {
        this.$message.error('宣发链接及文件至少添加一项！')
        return
      }
      const data = {
        dispersingUrlList: this.form.dispersingUrlList,
        dispersingLink: this.form.dispersingLink,
        productId: this.form.id
      }
      this.loading = true
      productDispersing(data)
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
    initEdit() {
      // this.row.sortLabel = this.row.sortLabel?.split(',') || []
      this.row.dispersingUrlList =
        this.row.dispersingUrlList === 1 ? [] : this.row.dispersingUrlList || []
      const giveawayUrls = []
      this.row.dispersingUrlList.map(v => {
        giveawayUrls.push({
          status: 3,
          url: v
        })
      })
      this.form = this.row
      this.$nextTick(() => {
        this.$refs.productfileUpload?.setFileList(giveawayUrls)
      })
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
      this.form.dispersingUrlList = arr
      console.log('sdddfdsfdsfsd: ', this.form.dispersingUrlList)
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
</style>
