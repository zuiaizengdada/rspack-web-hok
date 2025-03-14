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
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model.trim="form.productName"
            :disabled="ifReview"
            style="width: 450px"
            clearable
            placeholder="请输入"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="产品分类" prop="sortLabel">
          <el-radio-group
            v-model="form.sortLabel"
            :disabled="ifReview"
            @change="clearGoodsAttributte"
          >
            <el-radio
              v-for="item in sortLabelOption"
              :key="item.value"
              :label="item.value + ''"
            >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.sortLabel == 3"
          label="商品属性"
          prop="goodsAttribute"
        >
          <el-select
            v-model="form.goodsAttribute"
            :disabled="ifReview"
            size="small"
            style="width: 450px"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in goodsAttributeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="讲师名称" prop="teacherId">
          <el-select
            v-model="form.teacherId"
            :disabled="ifReview"
            size="small"
            style="width: 450px"
            clearable
            placeholder="请选择"
            filterable
            @clear="clearClick"
            @change="changeTeacherId"
          >
            <el-option
              v-for="(item, index) in teachers"
              :key="item.value + index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input
            v-model.trim="form.goodsPrice"
            :disabled="ifReview"
            style="width: 450px"
            clearable
            placeholder="请输入"
            @input="e => delNumber(e, form)"
          />
        </el-form-item>
        <el-form-item label="课研人员" prop="researcherList">
          <el-button
            type="primary"
            :disabled="ifReview"
            @click="addAssistant"
          >添加({{ form.researcherList.length }}/50)</el-button>
          <div>
            <div :class="{ assessBox: form.researcherList.length > 0 }">
              <el-tag
                v-for="(tag, index) in form.researcherList"
                :key="tag.userId"
                closable
                class="remindPersonListView"
                @close="delAssistant(tag, index)"
              >{{ tag.nickName }}</el-tag>
            </div>
          </div>
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
import { productAddAjax, productEditAjax } from '@/api/product/productManage.js'
import { getIds } from '@/utils/index'
import moment from 'moment'
import { getTeacherList } from '@/api/shop.js'
// import { filtersMoneyByZero } from '@/filters/index'

export default {
  components: {
    AppDialog
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
      title: '新增产品',
      ifEdit: false,
      ifReview: false,
      row: {},
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
        teacherId: undefined
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
        teacherId: [
          { required: true, message: '请输入老师名称', trigger: 'blur' }
        ],
        courseIntroduction: [
          { required: true, message: '请输入课程介绍', trigger: 'blur' }
        ],
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
      },
      teachers: []
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getTeachers()
        }
        if (val && !this.ifEdit) {
          this.initAdd()
        } else if (val && this.ifEdit) {
          this.initEdit()
        }
        if (!val) {
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
            teacherId: undefined
          }
          this.$refs.form.resetFields()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    clearClick() {
      this.form.teacherId = undefined
    },
    changeTeacherId(res) {
      this.form.teacherName = res
        ? this.teachers.find(m => m.value === res)?.label
        : undefined
    },
    getTeachers() {
      getTeacherList().then(res => {
        this.teachers = res.data
          .filter(f => f.lecturerState === 0)
          .map(m => ({
            label: m.lecturerName,
            value: m.teacherId
          }))
      })
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
      if (this.ifReview) {
        this.visible = false
        return
      }
      if (
        this.form.giveawayHas === 2 &&
        this.$refs.productfileUpload?.getUploadFile()
      ) {
        return this.$message.error('正在赠品')
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.ifEdit ? this.edit() : this.add()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add() {
      const researcherList = getIds(this.form.researcherList, 'userId')
      const sortLabel = this.form.sortLabel
      const goodsPrice = Number(this.form.goodsPrice) * 100
      const data = {
        courseIntroduction: this.form.courseIntroduction,
        expectedClassHour: this.form.expectedClassHour,
        giveawayHas: this.form.giveawayHas,
        giveawayUrls: this.form.giveawayUrls,
        goodsPrice,
        materialAddress: this.form.materialAddress,
        productName: this.form.productName,
        researchProgress: this.form.researchProgress,
        researcherList,
        shelfAddress: this.form.shelfAddress,
        ...(this.form.researchProgress === 7 && {
          shelfDate: this.form.shelfDate
        }),
        teacherName: this.form.teacherName,
        teacherId: this.form.teacherId,
        sortLabel,
        goodsAttribute:
          Number(this.form.sortLabel) === 3 ? this.form.goodsAttribute : '',
        deliveryMainBody: this.form.deliveryMainBody,
        distributionUser:
          Number(this.form.deliveryMainBody) === 1
            ? this.form.distributionUser
            : '',
        erpDistributionUser: this.form.erpDistributionUser
      }
      this.loading = true
      productAddAjax(data)
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
    edit() {
      const researcherList = getIds(this.form.researcherList, 'userId')
      const sortLabel = this.form.sortLabel
      const goodsPrice = this.form.goodsPrice * 100
      const data = {
        courseIntroduction: this.form.courseIntroduction,
        expectedClassHour: this.form.expectedClassHour,
        giveawayHas: this.form.giveawayHas,
        giveawayUrls: this.form.giveawayUrls,
        goodsPrice,
        materialAddress: this.form.materialAddress,
        productName: this.form.productName,
        researchProgress: this.form.researchProgress,
        researcherList,
        shelfAddress: this.form.shelfAddress,
        ...(this.form.researchProgress === 7 && {
          shelfDate: this.form.shelfDate
        }),
        sortLabel,
        goodsAttribute:
          Number(this.form.sortLabel) === 3 ? this.form.goodsAttribute : '',
        deliveryMainBody: this.form.deliveryMainBody,
        distributionUser:
          Number(this.form.deliveryMainBody) === 1
            ? this.form.distributionUser
            : '',
        erpDistributionUser: this.form.erpDistributionUser,
        teacherName: this.form.teacherName,
        teacherId: this.form.teacherId,
        productId: this.form.id
      }
      this.loading = true
      productEditAjax(data)
        .then(res => {
          if (res.code === 1) {
            this.visible = false
            this.success && this.success()
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
      // this.row.sortLabel = this.row.sortLabel?.split(',') || []
      this.row.giveawayUrls =
        this.row.giveawayHas === 1 ? [] : this.row.giveawayUrls || []
      this.row.shelfDate =
        this.row.shelfDate && this.row.researchProgress === 7
          ? moment(this.row.shelfDate).format('YYYY-MM-DD HH:mm:ss')
          : moment().format('YYYY-MM-DD 00:00:00')
      this.row.goodsPrice = this.row?.goodsPrice / 100
      // this.row.goodsPrice = filtersMoneyByZero(this.row?.goodsPrice)
      const researcherList = []
      const giveawayUrls = []
      this.row.researcherList.map(v => {
        researcherList.push({
          userId: v.sysUserId,
          nickName: v.sysUserName
        })
      })
      this.row.giveawayUrls.map(v => {
        giveawayUrls.push({
          status: 3,
          url: v
        })
      })
      this.row.researcherList = researcherList
      this.$nextTick(() => {
        this.$refs.appUserSelect.value = this.row.distributionUserName
      })

      this.row.sortLabel = this.row.sortLabel?.split(',')
        ? this.row.sortLabel?.split(',')[0]
        : ''
      this.form = { ...this.row }
      this.$nextTick(() => {
        this.$refs.productfileUpload?.setFileList(giveawayUrls)
      })
    },
    initAdd() {
      this.form.shelfDate = moment().format('YYYY-MM-DD 00:00:00')
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
</style>
