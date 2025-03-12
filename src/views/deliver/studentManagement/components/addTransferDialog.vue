<template>
  <!-- 新增/编辑转课弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['保存', '取消']"
    title="转课"
    width="1200px"
    height="630px"
    :loading="loading"
    :before-close="done => beforeClose(done)"
    @success="sure"
  >
    <div class="addTransferDialog overflowOuto">
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
        size="small"
      >
        <MTitle class="m-b-20">转课信息</MTitle>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="goodsName">
              <div class="myInput" @click="changeGoodsSpec">
                <span v-if="form.specName"
                  ><el-tag size="mini">{{ form.specName }}</el-tag></span
                >
                <span
                  v-if="form.goodsName"
                  class="m-l-5 text_hidden_ellipsis"
                  >{{ form.goodsName }}</span
                >
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程金额" prop="goodsTotalFee">
              <div>￥{{ form.goodsTotalFee | filtersMoneyByZero }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应付金额">
              <div>￥{{ form.goodsTotalFee | filtersMoneyByZero }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转入金额">
              <div>￥{{ transferAmount | filtersMoneyByZero }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="应补金额">
              <div style="display: inline-block">
                <span style="color: red"
                  >￥{{
                    form.goodsTotalFee - transferAmount > 0
                      ? filterPriceNumber(form.goodsTotalFee - transferAmount)
                      : 0
                  }}</span
                >
                <span style="margin-left: 30px"
                  >(根据实际情况填写优惠或者用户补差价流水，提交后会有人工审核！)</span
                >
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="form.goodsTotalFee - transferAmount > 0">
          <el-row>
            <el-col :span="24">
              <el-form-item label="补款金额" style="width: 100%; float: left">
                <span style="color: green">￥{{ bukuanjine }}</span>
                <span style="margin-left: 30px"
                  >优惠金额：<em class="bukuan-cls"
                    >￥{{ form.discountsFee }} </em
                  >补款流水：<em class="bukuan-cls"
                    >￥{{ returnForOfflineMoneyNumber }}</em
                  ></span
                >
              </el-form-item>
              <p
                v-if="
                  Number(bukuanjine) ===
                  filterPriceNumber(form.goodsTotalFee - transferAmount)
                "
                class="yb-tips"
              >
                补款金额等于应补金额，可进行转课；
              </p>
              <p
                v-else-if="
                  Number(bukuanjine) <
                  filterPriceNumber(form.goodsTotalFee - transferAmount)
                "
                class="yb-tips p-red"
              >
                补款金额小于应补金额，请补充流水或者添加优惠金额；
              </p>
              <p
                v-else-if="
                  Number(bukuanjine) >
                  filterPriceNumber(form.goodsTotalFee - transferAmount)
                "
                class="yb-tips p-red"
              >
                补款金额超出应补金额
              </p>
            </el-col>
          </el-row>
          <!-- <el-row style="margin-bottom: 20px; padding-left: 10px;">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="addYouhui">新增优惠</el-button>
              <el-button type="primary" size="mini" @click="addOffline">新增线下收款</el-button>
            </el-col>
          </el-row> -->
          <div>
            <MTitle class="m-b-20">优惠信息</MTitle>
            <el-row>
              <el-col :span="12">
                <el-form-item label="优惠金额">
                  <span>{{ form.discountsFee }}</span>
                  <el-button
                    style="margin-left: 20px"
                    type="text"
                    @click="toUpdateYouhui"
                    >修改</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="原因">
                  <p>{{ form.discountsReason }}</p>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div>
            <MTitle class="m-b-20">交易信息</MTitle>
            <el-button
              size="mini"
              style="margin-bottom: 20px"
              @click="onClickAddWater"
              ><i class="el-icon-plus" />交易信息</el-button
            >
            <addOfflineLine
              ref="addOfflineLine"
              :user-phone="config.userPhone"
              :email="config.email"
              :phone-area-code="config.phoneAreaCode"
              @plusTheBukuanjineSbt="plusTheBukuanjine"
            />
          </div>
        </div>
        <MTitle class="m-b-20">学员信息</MTitle>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学员姓名" prop="shiftUserName">
              <el-input
                v-model="form.shiftUserName"
                maxlength="20"
                style="width: 300px"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="学员账号"
              :prop="contactType === 1 ? 'shiftUserPhone' : 'shiftEmail'"
            >
              <div class="itemBox">
                <m-select
                  v-model="contactType"
                  :clearable="false"
                  dict-key="CONTACT_TYPE"
                  style="max-width: 100px; margin-right: 5px"
                  size="small"
                />
                <el-input
                  v-if="contactType === 1"
                  v-model="form.shiftUserPhone"
                  size="small"
                  style="width: 300px"
                  placeholder="请输入手机号"
                  :maxlength="phoneMaxlength(form.shiftPhoneAreaCode)"
                  @input="e => delNoNumber(e)"
                >
                  <el-select
                    slot="prepend"
                    v-model="form.shiftPhoneAreaCode"
                    placeholder="请选择"
                    filterable
                    style="width: 100px"
                  >
                    <el-option-group
                      v-for="group in smsAreaList"
                      :key="group.label"
                      :label="group.label"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item.areaCode"
                        :label="`+${item.areaCode} ${item.areaChineseName}`"
                        :value="item.areaCode"
                      >
                        <span style="float: left">{{
                          item.areaChineseName
                        }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >+{{ item.areaCode }}</span
                        >
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-input>
                <el-autocomplete
                  v-else
                  v-model="form.shiftEmail"
                  size="small"
                  :trigger-on-focus="false"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入邮箱号"
                />
              </div>
              <div class="tips">
                与原课程 学员电话/邮箱 不一致时，会转入新学员名下，请谨慎操作。
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <MTitle class="m-b-20">转课信息</MTitle>
        <el-form-item label="转课原因" prop="shiftReason">
          <el-input
            v-model="form.shiftReason"
            style="width: 780px"
            type="textarea"
            :rows="2"
            maxlength="500"
            show-word-limit
            placeholder="请输入转课原因"
          />
        </el-form-item>
        <el-form-item label="原因补充" prop="fileList">
          <div class="upload">
            <el-upload
              v-if="fileList.length < 6"
              ref="upload"
              class="uploadView m-r-16 m-b-16"
              multiple
              :file-list="fileList"
              :limit="6"
              drag
              action="#"
              accept=".jpg,.png"
              :before-upload="beforeUpload"
              :http-request="upload"
              :show-file-list="false"
              :on-exceed="handleExceed"
            >
              <i class="el-icon-plus" />
              <div class="uploadViewText">点击/拖拽上传</div>
            </el-upload>

            <template v-for="(item, index) in fileList">
              <uploadItem
                :key="index"
                class="m-r-16 m-b-16"
                :status="item.status"
                :url="item.url"
                :auth-progress="item.authProgress"
                @del="delFile(item, index)"
                @again="alignUpload(item, index)"
              />
            </template>
          </div>
          <div class="tips">
            注：最多上传6张jpg，png格式图片，单张图片大小不大于2M。
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="新增优惠"
      :visible.sync="dialogFormVisible"
      width="600px"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      @click="closeDialogForm"
    >
      <el-form ref="formForInsert" :model="formForInsert" :rules="ruleForYH">
        <el-form-item
          label="优惠金额"
          :label-width="formLabelWidth"
          prop="price"
        >
          <el-input-number
            v-model="formForInsert.price"
            style="width: 460px"
            placeholder="请输入"
            controls-position="right"
            :min="0"
            :step="1"
            :precision="2"
          />
        </el-form-item>
        <el-form-item
          label="优惠原因"
          :label-width="formLabelWidth"
          prop="region"
        >
          <el-input
            v-model="formForInsert.region"
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogForm">取 消</el-button>
        <el-button type="primary" @click="sureToSubmit('formForInsert')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import uploadItem from './uploadItem.vue'
import addOfflineLine from './addOfflineLine'
import { mapGetters } from 'vuex'
import { getOssConfig } from '@/api/file'
import { handleEmailValid } from '@/utils'
import {
  editDeliveryShift,
  editPackageDeliveryShift,
  addDeliveryShift,
  addPackageDeliveryShift,
  getAvailableShiftFee,
  getPackageAvailableShiftFee
} from '@/api/deliver/studentManagement'
import BigNumber from 'bignumber.js'
import { Promise } from 'jszip/lib/external'
const ossTeacherFolder = 'hok_deliver/img/'
export default {
  components: {
    AppDialog,
    uploadItem,
    addOfflineLine
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 2,
          row: {},
          deliveryInfoId: '',
          visible: false
        }
      }
    },
    orderNo: {
      type: String,
      default: ''
    },
    isPackage: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {
          discountsFee: 0, // 优惠金额
          canShiftFlag: 0, // 是否可以新增转课标志，1否，2是
          deliverShiftListVoList: [], // 转课记录
          deliveryInfoId: 0, // 交付订单编号
          balanceFee: 0, // 	订单余额
          goodsName: '', // 课程名称
          goodsTotalFee: 0, // 	课程金额
          userName: '', // 学员姓名
          userId: '', // 学员id
          userPhone: '', // 学员手机号
          lecturerNameList: [] // 	讲师名称
        }
      }
    }
  },
  computed: {
    ...mapGetters(['smsAreaList', 'mailSuffixesList'])
  },
  data() {
    var checkDiscountsFee = (rule, value, callback) => {
      const flag =
        BigNumber(value).times(100).plus(this.transferAmount).toNumber() <=
        this.form.goodsTotalFee
      if (flag) {
        callback()
      } else {
        callback(new Error('优惠金额+转入金额必须小于等于课程金额'))
      }
    }
    var checkForPrice = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('请填写大于0的优惠金额'))
      } else if (value === '') {
        callback(new Error('请输入优惠金额'))
      } else if (
        this.filterPriceNumber(this.form.goodsTotalFee - this.transferAmount) >
          0 &&
        value >
          this.filterPriceNumber(this.form.goodsTotalFee - this.transferAmount)
      ) {
        callback(new Error('优惠金额不能大于应补金额，请重新填写'))
      } else {
        callback()
      }
    }
    return {
      contactType: 1,
      formLabelWidth: '100px',
      bukuanjine: 0,
      dialogFormVisible: false,
      formForInsert: {
        price: '',
        region: ''
      },
      options: [],
      offLineFlag: false,
      form: {
        shiftId: '', // 编号，编辑的时候有
        goodsName: '',
        goodsId: '',
        shiftFee: '', // 转入金额
        discountsFee: '', // 优惠金额
        shiftUserName: '', // 转入学员姓名
        shiftUserPhone: '', // 转入学员手机
        shiftEmail: '',
        shiftReason: '', // 转课原因
        specId: '', // 规格编号
        specName: '', // 规格名称
        goodsTotalFee: '', // 课程金额
        shiftMaterialList: [] // 原因补充
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        discountsFee: [
          { validator: checkDiscountsFee, required: true, trigger: 'blur' }
        ],
        shiftUserName: [
          { required: true, message: '请输入学员姓名', trigger: 'blur' }
        ],
        shiftUserPhone: [
          {
            required: true,
            message: '请输入学员电话',
            trigger: 'blur'
          }
        ],
        shiftEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        shiftReason: [
          { required: true, message: '请输入转课原因', trigger: 'blur' }
        ]
      },
      ruleForYH: {
        price: [{ required: true, validator: checkForPrice, trigger: 'blur' }],
        region: [{ required: true, message: '请输入优惠原因', trigger: 'blur' }]
      },
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      loading: false,
      // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功 4: 暂停上传
      fileList: [],
      transferAmount: 0, // 转入金额
      availableShiftFee: 0, // 可转金额
      returnForOfflineMoneyNumber: 0,
      discountsFeeMax: 0 // 优惠金额最大值
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.transferAmount = 0
        const row = JSON.parse(JSON.stringify(this.config.row))
        if (row.paymentInfoVoList?.length > 0) {
          this.offLineFlag = true
          this.$nextTick(() => {
            this.$refs.addOfflineLine.fillData(row.paymentInfoVoList)
          })
        }
        if (this.config.type === 2) {
          this.contactType = row.userPhone ? 1 : 2
          this.form = {
            shiftId: row.shiftId, // 编号，编辑的时候有
            goodsName: row.goodsName,
            goodsId: row.goodsId,
            shiftFee: row.shiftFee, // 转入金额
            discountsFee: BigNumber(row.discountsFee).div(100).toNumber() || 0, // 优惠金额
            discountsReason: row.discountsReason,
            shiftUserName: row.userName, // 转入学员姓名
            shiftUserPhone: row.userPhone, // 转入学员手机
            shiftEmail: row.shiftEmail,
            shiftPhoneAreaCode: row.shiftPhoneAreaCode,
            shiftReason: row.shiftReason, // 转课原因
            specId: row.specId, // 规格编号
            specName: row.specName, // 规格名称
            goodsTotalFee: row.goodsTotalFee, // 课程金额
            shiftMaterialList: [] // 原因补充
          }
          if (row.fileUrlList && row.fileUrlList.length > 0) {
            this.fileList = row.fileUrlList.reduce((pre, next) => {
              return pre.concat([
                {
                  file: '', // 文件对象
                  name: '', // 文件名
                  status: 3, // 状态
                  authProgress: 100, // 进度
                  poster: '', // 封面
                  alignUploadShow: false, // 重新上传mask控制
                  abortCheckpoint: null, // 中断点
                  client: null,
                  url: next
                }
              ])
            }, [])
          }
          this.getAvailableShiftFee(this.config.deliveryInfoId)
        }
      } else {
        this.fileList = []
        this.contactType = 1
        this.form = {
          goodsName: '',
          goodsId: '',
          goodsFee: '', // 课程金额
          shiftEmail: '',
          shiftPhoneAreaCode: '',
          shiftFee: '', // 转入金额：
          discountsFee: 0, // 优惠金额
          userName: '', // 学员姓名
          userPhone: '', // 学员电话
          shiftReason: '', // 转课原因
          fileUrlList: [] // 原因补充
        }
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
        this.$refs.upload && this.$refs.upload.clearFiles()
      }
    },
    'form.goodsTotalFee'(value) {
      if (value) {
        console.log(value)
      }
    }
  },
  created() {
    this.getOssConfig()
  },
  mounted() {},
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
        const filteredSuffixes = strTwo
          ? mailSuffixesList.filter(suffix => suffix.includes(strTwo))
          : mailSuffixesList

        list = filteredSuffixes.map(suffix => ({
          value: `${strOne}${suffix}`,
          address: `${strOne}${suffix}`
        }))
      }

      cb(list)
    },
    closeDialogForm() {
      this.dialogFormVisible = false
      this.formForInsert = {
        price: 0,
        region: ''
      }
      this.$refs.formForInsert.clearValidate()
    },
    onClickAddWater() {
      this.$nextTick(() => {
        this.$refs.addOfflineLine.onClickAddWater()
      })
    },
    addOffline() {
      this.offLineFlag = true
    },
    sureToSubmit(formForInsert) {
      this.$refs[formForInsert].validate(valid => {
        if (valid) {
          this.form.discountsFee = this.formForInsert.price
          this.form.discountsReason = this.formForInsert.region
          this.dialogFormVisible = false
          this.plusTheBukuanjine(0, 1)
          this.formForInsert = {
            price: 0,
            region: ''
          }
          this.$refs.formForInsert.clearValidate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    plusTheBukuanjine(number, type) {
      this.bukuanjine = Number(0)
      if (type === 2) {
        this.returnForOfflineMoneyNumber = 0
        this.returnForOfflineMoneyNumber = Number(number)
      }
      this.bukuanjine =
        this.form.discountsFee + this.returnForOfflineMoneyNumber
      this.bukuanjine = this.bukuanjine.toFixed(2)
    },
    addYouhui() {
      this.dialogFormVisible = true
    },
    toUpdateYouhui() {
      this.dialogFormVisible = true
      if (this.form.discountsFee) {
        this.formForInsert.price = this.form.discountsFee
        this.formForInsert.region = this.form.discountsReason
      }
    },
    verifyMaxPhone(code) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const data = smsAreaList.find(item => item.areaCode === code)
      return data
    },
    phoneMaxlength(code) {
      const maxObj = this.verifyMaxPhone(code)
      return maxObj?.length || 15
    },
    delNoNumber(e) {
      this.form.shiftUserPhone = e.replace(/\D/g, '')
    },
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then(res => {
          this.ossConfig = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
          this.loading = false
          // eslint-disable-next-line no-undef
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    // 选择课程触发
    onhandleCourseSelect(val) {
      if (val.length > 0 && val[0].specId) {
        this.form.goodsId = val[0].goodsId
        this.form.goodsName = val[0].goodsName
        this.form.specId = val[0].specId
        this.form.specName = val[0].specName
      } else {
        this.form.goodsId = ''
        this.form.goodsName = ''
        this.form.specId = ''
      }
    },
    // 文件上传之前
    beforeUpload(file) {
      // 限制上传文件大小 500M
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.closeAll()
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 文件上传
    async upload(e) {
      // this.$refs.upload.clearFiles()
      if (!e) {
        return
      }
      this.$refs.upload && this.$refs.upload.clearFiles()
      const selectFile = e.file
      if (!/\.(png|jpg|PNG|JPG)$/.test(selectFile.name)) {
        this.$message.closeAll()
        return this.$message.error('请上传允许的格式的文件png,jpg!')
      }
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${
          this.$getFileType(selectFile.name).suffix
        }`, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.fileList.push(obj)
      this.$emit('change', this.fileList)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100).toFixed(2))
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(
          ossTeacherFolder + obj.name,
          obj.file,
          {
            ...options
          }
        )
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster =
          self.url +
          '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        this.fileList.map(v => {
          v.status === 3 && fileList.push(v)
        })
        this.$emit('change', fileList)
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 点击重新上传
    async alignUpload(item, index) {
      const self = this.fileList[index]
      await this.resumeUpload(self)
    },
    // 上传重试
    async resumeUpload(self) {
      self.status = 1
      // 设置重试次数为五次。
      try {
        const result = await self.client.multipartUpload(
          ossTeacherFolder + self.name,
          self.file,
          {
            checkpoint: self.abortCheckpoint,
            progress: (p, cpt, res) => {
              // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
              // 获取上传进度。
              self.authProgress = Number((p * 100).toFixed(2))
              self.abortCheckpoint = cpt
            }
          }
        )
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster =
          self.url +
          '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        console.log(result)
        this.$emit('change', this.fileList)
      } catch (e) {
        if (e.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', e)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 删除
    delFile(item, index) {
      if (item.abortCheckpoint) {
        item.client &&
          item.client.abortMultipartUpload(
            item.abortCheckpoint.name,
            item.abortCheckpoint.uploadId
          )
      }
      this.fileList.splice(index, 1)
    },
    setFileList(fileList) {
      this.fileList = fileList
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex(v => v.status === 1)
      return index > -1
    },
    // 暂停上传
    pause(self) {
      self.client.cancel()
    },
    handleExceed(files, fileList) {
      this.$message.error(
        `当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，已经选择 ${fileList.length} 个文件`
      )
    },
    verifyPhone(phone, areaCode) {
      const smsAreaList = this.smsAreaList.reduce(
        (accumulator, currentValue) => [
          ...accumulator,
          ...currentValue.options
        ],
        []
      )
      const isRegex = smsAreaList.find(
        item => item.areaCode === areaCode
      )?.regex
      if (!isRegex) return true
      return new RegExp(isRegex).test(phone)
    },
    sure() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (
            this.form.goodsTotalFee - this.transferAmount !== 0 &&
            Number(this.bukuanjine) !==
              this.filterPriceNumber(
                this.form.goodsTotalFee - this.transferAmount
              )
          ) {
            this.$message.error('补款金额不等于应补金额，请重新检查！')
            return
          }
          if (this.$refs.addOfflineLine?.formWater.list?.length > 0) {
            this.$refs.addOfflineLine.$refs['formWater'].validate(valid => {
              if (valid) {
                if (
                  this.hasDuplicateField(
                    this.$refs.addOfflineLine.formWater.list,
                    'serialNum'
                  )
                ) {
                  this.$message.error('流水金额重复，请重新修改')
                  return false
                }
                if (this.config.type === 2) {
                  this.handleEdit()
                } else {
                  this.handleAdd()
                }
              } else {
                this.$message.error('有内容未正确填写，请检查并填写！')
                return false
              }
            })
          } else {
            if (this.contactType === 1) {
              if (!this.form.shiftPhoneAreaCode) {
                return this.$message.error('请选择手机区号！')
              }
              const verifyPhone = this.verifyPhone(
                this.form.shiftUserPhone,
                this.form.shiftPhoneAreaCode
              )
              if (!verifyPhone) {
                return this.$message.error('请输入完整的手机号!')
              }
            } else {
              if (!handleEmailValid(this.form.shiftEmail)) {
                return this.$message.warning('请填写正确的邮箱号')
              }
            }
            if (this.config.type === 2) {
              this.handleEdit()
            } else {
              this.handleAdd()
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    hasDuplicateField(array, field) {
      const map = {}
      for (let i = 0; i < array.length; i++) {
        const value = array[i][field]
        if (map[value]) {
          return true
        }
        map[value] = true
      }
      return false
    },
    beforeClose(done) {
      if (this.getUploadFile()) {
        return this.$confirm(
          '当前还有文件正在上传, 是否确认关闭弹框?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          done()
        })
      } else {
        done()
      }
    },

    async alertConfirm(msg) {
      return new Promise((resolve, reject) => {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            resolve()
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    // 新增
    async handleAdd() {
      this.loading = true
      const shiftMaterialList = this.fileList.reduce((pre, next) => {
        next.status === 3 && pre.push(next.url)
        return pre
      }, [])
      const addPaymentInfoList = []
      this.$refs.addOfflineLine?.formWater.list?.map(v => {
        const voucherList = []
        v.imageUrl.map(v => {
          voucherList.push(v.url)
        })
        addPaymentInfoList.push({
          channelId: v.channel, // 收款渠道ID
          chosenChannelId: v.unit ? v.unit : '',
          payTime:
            v.channel === this.optionsChannelValue
              ? null
              : new Date(v.time).getTime(), // 支付时间
          payerTotal: v.price, // 流水金额
          email: v.accountType === 2 ? v.email : '',
          accountType: v.accountType,
          phoneAreaCode: v.accountType === 1 ? v.phoneAreaCode : '',
          transactionId: v.serialNum, // 交易流水号
          paymentUserPhone: v.accountType === 1 ? v.paymentUserPhone : '',
          voucherList
        })
      })
      const params = {
        addPaymentInfoList,
        deliveryInfoId: this.config.deliveryInfoId,
        discountsFee:
          this.form.goodsTotalFee - this.transferAmount === 0
            ? 0
            : (this.form.discountsFee * 100).toFixed(2),
        discountsReason:
          this.form.goodsTotalFee - this.transferAmount === 0
            ? ''
            : this.form.discountsReason,
        goodsId: this.form.goodsId,
        shiftMaterialList,
        shiftEmail: this.contactType === 2 ? this.form.shiftEmail : '',
        shiftPhoneAreaCode:
          this.contactType === 1 ? this.form.shiftPhoneAreaCode : '',
        shiftReason: this.form.shiftReason,
        shiftUserName: this.form.shiftUserName,
        shiftUserPhone: this.contactType === 1 ? this.form.shiftUserPhone : '',
        orderNo: this.orderNo,
        specId: this.form.specId
      }

      // const { code, msg } = await detectionShiftCheck(params)

      // code ===60002  需要用户二次确认
      // if (code === 60002) await this.alertConfirm(msg)

      const api = this.isPackage ? addPackageDeliveryShift : addDeliveryShift
      api(params)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 修改
    async handleEdit() {
      this.loading = true
      const shiftMaterialList = this.fileList.reduce((pre, next) => {
        next.status === 3 && pre.push(next.url)
        return pre
      }, [])
      const addPaymentInfoList = []
      console.log(4444444, this.$refs.addOfflineLine?.formWater.list)
      this.$refs.addOfflineLine?.formWater.list?.map(v => {
        const voucherList = []
        v.imageUrl.map(v => {
          voucherList.push(v.url)
        })
        addPaymentInfoList.push({
          channelId: v.channel, // 收款渠道ID
          payTime:
            v.channel === this.optionsChannelValue
              ? null
              : new Date(v.time).getTime(), // 支付时间
          payerTotal: v.price, // 流水金额
          transactionId: v.serialNum, // 交易流水号
          paymentUserPhone: v.accountType === 1 ? v.paymentUserPhone : '',
          email: v.accountType === 2 ? v.email : '',
          accountType: v.accountType,
          phoneAreaCode: v.accountType === 1 ? v.phoneAreaCode : '',
          voucherList
        })
      })
      console.log('this.form', this.form)
      console.log(1111111,addPaymentInfoList)
      const params = {
        addPaymentInfoList,
        shiftId: this.form.shiftId,
        deliveryInfoId: this.config.deliveryInfoId,
        discountsFee:
          this.form.goodsTotalFee - this.transferAmount === 0
            ? 0
            : (this.form.discountsFee * 100).toFixed(2),
        discountsReason:
          this.form.goodsTotalFee - this.transferAmount === 0
            ? ''
            : this.form.discountsReason,
        goodsId: this.form.goodsId,
        shiftEmail: this.contactType === 2 ? this.form.shiftEmail : '',
        shiftPhoneAreaCode:
          this.contactType === 1 ? this.form.shiftPhoneAreaCode : '',
        shiftReason: this.form.shiftReason,
        shiftUserName: this.form.shiftUserName,
        shiftUserPhone: this.contactType === 1 ? this.form.shiftUserPhone : '',
        shiftMaterialList,
        specId: this.form.specId
      }

      // const { code, msg } = await detectionShiftCheck(params)

      // code ===60002  需要用户二次确认
      // if (code === 60002) await this.alertConfirm(msg)

      const api = this.isPackage ? editPackageDeliveryShift : editDeliveryShift
      api(params)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击课程名称显示选择规格弹框
    changeGoodsSpec() {
      this.$SelectGoods({
        visible: true,
        initSearch: {
          tagType: 6
        },
        tabList: [
          { id: '51', name: '线下课', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        tearchSearch: true,
        currentId: '51',
        success: res => {
          console.log(res, 'res')
          if (res.length > 0) {
            const obj = res[0]
            if (obj.goodsType) {
              this.form.goodsId = res[0].goodsId
              this.form.goodsName = res[0].contentName
              this.form.specId = ''
              this.form.specName = ''
              this.form.goodsTotalFee = res[0].salePrice
              this.form.discountsFee = 0
            } else {
              this.form.goodsId = res[0].goodsId
              this.form.goodsName = res[0].goodsName
              this.form.specId = res[0].specId
              this.form.specName = res[0].specName
              this.form.discountsFee = 0
              this.form.goodsTotalFee = res[0].salePrice
            }
            // this.form.discountsFee = 0

            this.getAvailableShiftFee(this.config.deliveryInfoId)
          }
        }
      })
    },
    filterPriceNumber(num) {
      return Number(num) / 100
    },
    // 获取可转金额
    getAvailableShiftFee(deliveryInfoId) {
      this.loading = true
      const api = this.isPackage
        ? getPackageAvailableShiftFee
        : getAvailableShiftFee
      api(deliveryInfoId)
        .then(res => {
          this.availableShiftFee = res.data
          this.loading = false
          this.transferAmount = this.getTransferAmount()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 计算转入金额
    getTransferAmount() {
      if (!this.form.goodsTotalFee) {
        return 0
      } else if (this.config.type === 1) {
        // 新增
        // 1.原课程可转金额小于等于转入课程金额时，默认转入金额为原课程可转金额
        // 2、原课程可转金额大于转入课程金额时，默认转入金额为转入课程金额
        return this.availableShiftFee <= this.form.goodsTotalFee
          ? this.availableShiftFee
          : this.form.goodsTotalFee
      } else if (this.config.type === 2) {
        const a = new BigNumber(this.availableShiftFee).plus(
          this.config.row.shiftFee
        )
        // 修改
        // 1.(原课程可转金额 + 当前条记录的转入金额)小于等于转入课程金额时，默认转入金额为(原课程可转金额 + 当前条记录的转入金额)
        // 2、(原课程可转金额 + 当前条记录的转入金额)大于转入课程金额时，默认转入金额为转入课程金额
        return a <= this.form.goodsTotalFee ? a : this.form.goodsTotalFee
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addTransferDialog {
  height: 610px;
  padding: 20px;
  box-sizing: border-box;
  .alertTips {
    background: #fff2e6;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #ff7d00;
    line-height: 22px;
    margin-bottom: 27px;
  }
  .formView {
    display: flex;
    margin-bottom: 20px;
    .formViewLabel {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      margin-right: 8px;
    }
    .formViewValue {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 20px;
    }
  }
}
.formLabel {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  font-weight: 500;
}
.tips {
  margin-top: 8px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
}

::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 160px;
      height: 90px;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    font-weight: normal;
  }
}
.itemBox {
  display: flex;
  align-items: center;
}
.upload {
  width: 540px;
  display: flex;
  flex-wrap: wrap;
  .uploadView {
    width: 160px;
    height: 90px;
    background: #fbfcfe;
    border-radius: 4px;
    // border: 1px solid #E1E6ED;
    .uploadViewText {
      margin-top: 12px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 20px;
    }
  }
  .tips {
    margin-top: 5px;
    margin-left: 8px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
.el-icon-plus {
  font-weight: 700;
  font-size: 14px;
  color: #333333;
}

.myInput {
  width: 300px;
  font-size: 13px;
  display: inline-block;
  cursor: pointer !important;
  background-color: #fff !important;
  border: 1px solid #d8dce6;
  border-radius: 4px;
  height: 32px;
  padding: 0 10px;
  color: #606266;
  display: flex;
}
.m-l-5 {
  margin-left: 5px;
}
.bukuan-cls {
  font-style: normal;
  color: #0c6fff;
  margin-left: 3px;
  margin-right: 10px;
}
.yb-tips {
  padding-left: 16px;
  margin-top: -10px;
  margin-bottom: 15px;
  color: green;
  font-size: 12px;
  float: left;
}
.p-red {
  color: red;
}
</style>
