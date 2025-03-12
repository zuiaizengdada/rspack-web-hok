<template>
  <div class="contentForm">
    <!-- <div>123</div> -->
    <el-form
      ref="ruleForm"
      size="small"
      :model="form"
      :rules="rules"
      label-width="78px"
      class="demo-ruleForm"
    >
      <el-form-item label="广告标题" prop="adTitle">
        <el-input
          v-model.trim="form.adTitle"
          style="width: 486px"
          :maxlength="detail.type === 5 ? 5 : 20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item prop="url" label-width="0px">
        <!-- 这是上传组件 -->
        <upload
          ref="MUpload"
          :accept="accept"
          :before-upload="beforeUpload"
          :tips="detail.remark"
          :max-length="1"
          oss-teacher-folder="hok_shopAdvertising"
          @change="fileChange"
        />
      </el-form-item>
      <el-form-item label="是否跳转" prop="skip">
        <el-radio-group
          v-model="form.skip"
          @click="form.skipText = ''"
          @input="skipChange"
        >
          <el-radio :label="1">跳转</el-radio>
          <el-radio :label="0">不跳转</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.skip === 1" label="跳转类型" prop="skipType">
        <el-select
          v-model="form.skipType"
          placeholder="请选择"
          class="w-200"
          @change="skipTypeChange"
        >
          <el-option
            v-for="(item, key) in jumpTypeOption"
            :key="item"
            :label="item"
            :value="Number(key)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.skip === 1 && form.skipType !== 6 && form.skipType"
        label="跳转对象"
        prop="jumpArr"
      >
        <jumpObj
          ref="jumpObj"
          :type="form.skipType"
          :jump-arr="jumpArr"
          @change="changeSkipText"
        />
      </el-form-item>
      <el-form-item label="显示时间" prop="time" class="m-b-20" />
      <el-form-item label="开始时间" prop="displayTime" class="myTime m-b-20">
        <el-date-picker
          v-model="form.displayTime"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="fixedTime" class="myTime">
        <el-radio-group v-model="form.longTerm" @change="timeChange">
          <el-radio :label="0" class="myElRadio">
            固定时间
            <el-date-picker
              v-if="form.longTerm === 0"
              v-model="form.fixedTime"
              class="m-l-8"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions1"
            />
          </el-radio>
          <el-radio :label="1" class="myElRadio m-t-12">长期有效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示终端" prop="mobileTerminal">
        <el-checkbox
          v-model="form.mobileTerminal"
          :disabled="ifShowTerminal('mobileTerminal')"
          :true-label="1"
          :false-label="0"
          @change="
            $refs.ruleForm && $refs.ruleForm.validateField('mobileTerminal')
          "
        >移动网页</el-checkbox>
        <el-checkbox
          v-model="form.appTerminal"
          :disabled="ifShowTerminal('appTerminal')"
          :true-label="1"
          :false-label="0"
          @change="
            $refs.ruleForm && $refs.ruleForm.validateField('mobileTerminal')
          "
        >APP</el-checkbox>
        <el-checkbox
          v-model="form.douAppleTerminal"
          :disabled="ifShowTerminal('douAppleTerminal')"
          :true-label="1"
          :false-label="0"
          @change="
            $refs.ruleForm && $refs.ruleForm.validateField('mobileTerminal')
          "
        >抖音小程序</el-checkbox>
        <el-checkbox
          v-model="form.wxAppleTerminal"
          :disabled="ifShowTerminal('wxAppleTerminal')"
          :true-label="1"
          :false-label="0"
          @change="
            $refs.ruleForm && $refs.ruleForm.validateField('mobileTerminal')
          "
        >微信小程序</el-checkbox>
      </el-form-item>
    </el-form>
    <div class="m-t-18">
      <el-button
        class="contentFootBtn"
        :loading="loading || myloading"
        size="small"
        type="primary"
        @click="save"
      >保存</el-button>
      <el-button
        v-if="!ifAdd"
        class="contentFootBtn delBtn"
        :loading="loading || myloading"
        size="small"
        @click="onhandleRemove"
      >移除</el-button>
    </div>
  </div>
</template>

<script>
import { getCatalogueList } from '@/api/shop'
import { jumpType } from '../columns'
import upload from './upload.vue'
import jumpObj from './jumpObj.vue'
import {
  adInfoCreate,
  adInfoUpdate,
  adInfoDetail,
  adInfoRemove
} from '@/api/shop/advertising.js'
import { getFileType } from '@/utils/index'
import { filterNull } from '@/utils/index'
import moment from 'moment'
const defaultForm = {
  adTitle: '', // 广告标题
  fileType: '', // 文件类型 1图片 2视频
  url: '', // 资源地址
  thumbnail: '', // 视频资源则有首帧图片
  skip: 1, // 是否跳转 0否 1是
  skipType: '', // 跳转类型 1.课程详情 2.课程分类 3.网页 4.微信小程序 5.抖音小程序 6.推广页
  skipText: '', // 跳转内容
  goodsType: '', // 课程分类
  displayTime: '', // 开始时间
  longTerm: 0, // 是否长期 0否 1是
  fixedTime: '', // 固定时间
  mobileTerminal: 0, // 移动
  appTerminal: 0, // app
  douAppleTerminal: 0, // 抖音小程序
  wxAppleTerminal: 0 // 微信小程序
}
export default {
  components: {
    upload,
    jumpObj
  },
  props: {
    ifAdd: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          type: '',
          maxNum: '',
          fileFormat: [],
          fileSize: '',
          remark: ''
        }
      }
    },
    saveBeforeFn: {
      type: Function,
      default: () => {
        return true
      }
    },
    terminalAdNumber: {
      type: Object,
      default: () => {
        return {
          mobileTerminal: 0,
          appTerminal: 0,
          douAppleTerminal: 0,
          wxAppleTerminal: 0
        }
      }
    },
    current: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    var checkStartTime = (rule, value, callback) => {
      if (!this.form.displayTime) {
        callback('请选择开始时间')
      } else {
        callback()
      }
    }
    var checkEndTime = (rule, value, callback) => {
      if (this.form.longTerm === 0 && !this.form.fixedTime) {
        callback('请选择结束时间')
      } else if (
        this.form.longTerm === 0 &&
        this.form.displayTime &&
        this.form.fixedTime < this.form.displayTime
      ) {
        callback('固定时间需要大于开始时间')
      } else {
        callback()
      }
    }
    var checkTime = (rule, value, callback) => {
      callback()
    }
    var checkJumpObj = (rule, value, callback) => {
      if (this.form.skipType === 1 && !this.form.skipText) {
        callback('请选择课程')
      } else if (this.form.skipType === 2 && !this.form.skipText) {
        callback('请选择课程分类')
      } else if (this.form.skipType === 3 && !this.form.skipText) {
        callback('请输入网页地址')
      } else if (this.form.skipType === 7 && !this.form.skipText) {
        callback('请选择专题页')
      } else if (this.form.skipType === 9 && !this.form.skipText) {
        callback('请输入视频号id')
      } else {
        callback()
      }
    }
    var checkFile = (rule, value, callback) => {
      if (!this.form.url) {
        callback('请上传文件')
      } else {
        callback()
      }
    }
    var checkMobile_terminal = (rule, value, callback) => {
      if (
        !this.form.mobileTerminal &&
        !this.form.appTerminal &&
        !this.form.douAppleTerminal &&
        !this.form.wxAppleTerminal
      ) {
        callback('至少选择一个显示终端')
      } else {
        callback()
      }
    }
    return {
      myloading: false,
      jumpTypeOption: jumpType,
      form: { ...defaultForm },
      // 跳转对象数据
      jumpArr: [
        { value: '', detail: {} }, // 课程详情
        { value: '', option: [], optionValue: '' }, // 课程分类
        { value: '', option: ['https://', 'http://'], optionValue: 'https://' }, // 网页
        { value: '' }, // 微信小程序
        { value: '' }, // 抖音小程序
        { value: '' }, // 推广页面
        { value: '' },
        { value: '' } // 视频号主页
      ],
      rules: {
        adTitle: [
          { required: true, message: '请输入广告标题', trigger: 'blur' }
        ],
        skip: [{ required: true, message: '请选择是否跳转', trigger: 'blur' }],
        skipType: [
          { required: true, message: '请选择跳转类型', trigger: 'blur' }
        ],
        jumpArr: [{ validator: checkJumpObj, required: true, trigger: 'blur' }],
        time: [{ required: true, trigger: 'blur', validator: checkTime }],
        displayTime: [{ validator: checkStartTime, trigger: 'blur' }],
        fixedTime: [{ validator: checkEndTime, trigger: 'blur' }],
        mobileTerminal: [
          { validator: checkMobile_terminal, required: true, trigger: 'blur' }
        ],
        url: [{ validator: checkFile, trigger: 'blur' }]
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.form.displayTime) {
            return (
              time.getTime() <
              new Date(
                moment(this.form.displayTime).format('YYYY-MM-DD 00:00:00')
              ).getTime()
            )
          } else {
            return false
          }
        }
      },
      pickerOptions: {
        disabledDate: time => {
          if (this.form.fixedTime) {
            return (
              time.getTime() >
              new Date(
                moment(this.form.fixedTime).format('YYYY-MM-DD')
              ).getTime()
            )
          } else {
            return false
          }
        }
      },
      // 初始数据
      defaultForm: { ...defaultForm }
    }
  },
  computed: {
    accept() {
      const arr = []
      this.detail.fileFormat.map(v => {
        v === 1 && arr.push('.jpg,.png,.jpeg')
        v === 2 && arr.push('.mp4')
      })
      console.log(arr.join(','))
      return arr.join(',')
    }
  },
  mounted() {
    this.getCatalogueList()
  },
  methods: {
    beforeUpload(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLtX = file.size / 1024 < this.detail.fileSize
      if (!isLtX) {
        this.$message.error(`上传文件大小不能超过 ${this.detail.fileSize}KB!`)
      }
      return isLtX
    },
    // 点击保存
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.myloading = true
          const data = {
            ...this.form,
            fileType: getFileType(this.form.url).fileType === 'img' ? 1 : 2,
            pid: Number(this.$route.params.id)
          }
          // return console.log(data)
          this.saveBeforeFn(data)
            .then(() => {
              this.ifAdd ? this.onhandleAdd(data) : this.onhandleEdit(data)
            })
            .catch(() => {
              this.myloading = false
            })
        } else {
          return false
        }
      })
    },
    // 点击移除
    onhandleRemove() {
      this.$delModal({
        width: '505px',
        tips: `
          <div style="font-size: 16px;color: #333333;line-height: 24px;">移除提醒</div>
          <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">确定要移除当前广告内容吗</div>
        `,
        success: () => {
          this.myloading = true
          const params = {
            id: this.form.id
          }
          adInfoRemove(params)
            .then(res => {
              this.myloading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.init(true)
              this.$emit('remove')
            })
            .catch(() => {
              this.myloading = false
            })
        }
      })
    },
    ifChange() {
      return JSON.stringify(this.defaultForm) !== JSON.stringify(this.form)
    },
    // 初始化
    async init(ifAdd, id = '') {
      this.jumpArr.map(v => {
        v.value = ''
        v.detail = {}
      })
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      if (ifAdd) {
        this.$refs.MUpload && this.$refs.MUpload.setFileList([])
        this.defaultForm = JSON.parse(JSON.stringify(defaultForm))
        this.form = JSON.parse(JSON.stringify(defaultForm))
      } else {
        await this.getAdDetail(id)
      }
      this.$refs.jumpObj && this.$refs.jumpObj.remoteMethod()
    },
    // 获取广告详情
    getAdDetail(id) {
      this.myloading = true
      const params = {
        id
      }
      return adInfoDetail(params)
        .then(res => {
          res.data.fixedTime = res.data.fixedTime
            ? moment(res.data.fixedTime).format('YYYY-MM-DD HH:mm')
            : ''
          res.data.displayTime = res.data.displayTime
            ? moment(res.data.displayTime).format('YYYY-MM-DD HH:mm')
            : ''
          this.form = {
            ...JSON.parse(JSON.stringify(defaultForm)),
            ...filterNull(res.data)
          }
          this.defaultForm = JSON.parse(JSON.stringify(this.form))
          if (this.form.skip === 1 && this.form.skipType) {
            if (this.form.skipType === 3) {
              const arr = this.form.skipText.match(/(http|https)(:\/\/)(.*)/)
              if (arr) {
                this.jumpArr[2].value = arr[3]
                this.jumpArr[2].optionValue = arr[1] + arr[2]
              }
            } else if (this.form.skipType === 1) {
              this.jumpArr[0].value = this.form.skipText
              this.jumpArr[0].detail.goodsType = this.form.goodsType
            } else if (this.form.skipType === 7) {
              this.jumpArr[3].value = this.form.skipText
            } else if (this.form.skipType === 9) {
              this.jumpArr[7].value = this.form.skipText
            } else {
              this.jumpArr[this.form.skipType - 1].value = this.form.skipText
            }
          }
          const obj = {
            status: 3,
            url: this.form.url
          }
          this.$nextTick(() => {
            if (
              this.form.skipType &&
              this.form.skipType === 1 &&
              this.jumpArr[0].value &&
              this.jumpArr[0].detail.goodsType
            ) {
              this.$refs.jumpObj &&
                this.$refs.jumpObj.getGoodsDetail(this.jumpArr[0].value)
            }
          })
          this.$refs.MUpload && this.$refs.MUpload.setFileList([obj])
          this.myloading = false
        })
        .catch(() => {
          this.myloading = false
        })
    },
    // 跳转对象改变触发
    changeSkipText(obj) {
      const { skipText, goodsType } = obj
      this.form.skipText = skipText
      goodsType && (this.form.goodsType = goodsType)
    },
    // 上传文件对象改变
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.form.url = res[0].url
      }
    },
    // 显示时间改变触发
    timeChange(res) {
      console.log(res)
      this.form.fixedTime = ''
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('fixedTime')
    },
    // 新增
    onhandleAdd(data) {
      this.myloading = true
      adInfoCreate(data)
        .then(res => {
          this.myloading = false
          this.init(false, res.data)
          this.$emit('save', res.data)
          this.$notify.success({ title: '提示', message: '操作成功' })
        })
        .catch(() => {
          this.$emit('refreshList')
          this.myloading = false
        })
    },
    // 编辑
    onhandleEdit(data) {
      this.myloading = true
      adInfoUpdate(data)
        .then(res => {
          this.myloading = false
          this.init(false, this.form.id)
          this.$emit('save')
          this.$notify.success({ title: '提示', message: '操作成功' })
        })
        .catch(() => {
          this.$emit('refreshList')
          this.myloading = false
        })
    },
    // 获取商品分类
    getCatalogueList() {
      return getCatalogueList().then(res => {
        this.jumpArr[1].option = res.data
      })
    },
    // 跳转类型改变触发
    skipTypeChange(res) {
      console.log(res, 'res')
      if (res) {
        this.form.skipText = this.jumpArr[res - 1].value
      } else if (res === 7) {
        this.form.skipText = this.jumpArr[3].value
      } else {
        this.form.skipText = ''
      }
    },
    // 判断能否显示终端
    ifShowTerminal(key) {
      if (this.form.skipType === 9 && key !== 'wxAppleTerminal') {
        this.form.douAppleTerminal = 0
        this.form.appTerminal = 0
        this.form.mobileTerminal = 0
        return true
      }
      // 暂时只有H5有专题页
      if (this.form.skipType === 7 && key !== 'mobileTerminal') {
        return true
      }
      if (this.defaultForm[key] === 1) {
        return false
      } else {
        return (
          this.detail.maxNum <= this.terminalAdNumber[key] &&
          this.form[key] !== 1
        )
      }
    },
    // 调整类型改变触发
    skipChange(e) {
      if (e === 0) {
        this.form.skipText = ''
        this.form.skipType = ''
      } else {
        this.form.skipText = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contentForm {
  padding: 19px;
}
.formTimeHidden {
  height: 180px;
}
.formTime {
  position: absolute;
  top: 20px;
  left: -66px;
}
.tips {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
}
.myElRadio {
  line-height: 32px;
  height: 32px;
  width: 100%;
}
.m-t-18 {
  margin-top: 32px;
}
::v-deep {
  .tearchInput {
    width: 100%;
  }
  label {
    font-weight: normal;
    color: #333;
    font-size: 14px;
    line-height: 22px;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
  .myTime {
    label {
      color: #777777;
    }
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 32px;
  }
}
.checkboxGroup {
  height: 32px;
  display: flex;
  align-items: center;
}
.contentFootBtn {
  width: 96px;
}
.delBtn {
  color: #f53f3f;
}
.m-t-12 {
  margin-top: 12px;
}
</style>
