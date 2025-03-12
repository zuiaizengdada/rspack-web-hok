<template>
  <div class="offline-clas water-list">
    <!--<el-button size="mini" style="margin-bottom: 20px;" @click="onClickAddWater"><i class="el-icon-plus" />交易信息</el-button> -->
    <el-form
      ref="formWater"
      :model="formWater"
      :rules="formWaterRule"
      label-width="110px"
      class="form-box"
    >
      <div
        v-for="(item, index) in formWater.list"
        :key="item.num"
        class="water-child"
      >
        <div class="water-child-header">
          <div class="water-child-header-l">收款流水{{ item.num }}</div>
          <div
            class="water-child-header-r"
            @click="onClickDelWater(item.id, item)"
          >
            删除
          </div>
        </div>
        <div class="water-child-box">
          <el-row class="m-t20">
            <el-col :span="12">
              <div class="flex-box">
                <el-form-item
                  v-if="!moneyBagLocked || item.channel === optionsChannelValue"
                  label="收款渠道"
                  :prop="'list.' + index + '.channel'"
                  :rules="[
                    {
                      required: true,
                      message: '请选择收款渠道',
                      trigger: 'change'
                    }
                  ]"
                >
                  <!-- <span class="water-child-box-title">收款渠道</span> -->
                  <el-select
                    v-model="item.channel"
                    placeholder="请选择"
                    class="m-r8"
                    :class="item.optionsUnit.length ? 'w-150' : 'w-150'"
                    @change="getOptionsUnitChange($event, index)"
                  >
                    <el-option
                      v-for="e in optionsChannel"
                      :key="e.id"
                      :label="e.label"
                      :value="e.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-else
                  label="收款渠道"
                  :prop="'list.' + index + '.channel'"
                  :rules="[
                    {
                      required: true,
                      message: '请选择收款渠道',
                      trigger: 'change'
                    }
                  ]"
                >
                  <!-- <span class="water-child-box-title">收款渠道</span> -->
                  <el-select
                    v-model="item.channel"
                    placeholder="请选择"
                    class="m-r8"
                    :class="item.optionsUnit.length ? 'w-150' : 'w-150'"
                    @change="getOptionsUnitChange($event, index)"
                  >
                    <el-option
                      v-for="e in optionsArrayNoMoneyBag"
                      :key="e.id"
                      :label="e.label"
                      :value="e.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="
                    item.optionsUnit.length &&
                    item.channel != optionsChannelValue
                  "
                  :prop="'list.' + index + '.unit'"
                  :rules="[
                    {
                      required: true,
                      message: '请选择收款单位',
                      trigger: 'change'
                    }
                  ]"
                >
                  <el-select
                    v-model="item.unit"
                    placeholder="请选择"
                    class="w-260"
                    @change="getAccountChange($event, index, item.optionsUnit)"
                  >
                    <el-option
                      v-for="e in item.optionsUnit"
                      :key="e.id"
                      :label="e.label"
                      :value="e.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col
              v-if="item.channel && item.channel != optionsChannelValue"
              :span="12"
            >
              <el-form-item label="收款账号:">{{
                item.optionsUnit.length ? item.account : '--'
              }}</el-form-item>
            </el-col>
            <el-col
              v-if="item.channel && item.channel === optionsChannelValue"
              :span="12"
            >
              <el-form-item
                label="付款账号："
                :prop="
                  item.accountType === 1
                    ? `list.${index}.paymentUserPhone`
                    : `list.${index}.email`
                "
                :rules="[
                  {
                    required: true,
                    message: '请输入付款账号，并查询余额',
                    trigger: 'blur'
                  }
                ]"
              >
                <!-- <el-input
                  v-model="item.paymentUserPhone"
                  placeholder="请输入付款账号，并查询余额"
                  maxlength="11"
                  @blur="changePaymentUserPhone(index)"
                /> -->
                <div class="itemBox">
                  <m-select
                    v-model="item.accountType"
                    :clearable="false"
                    dict-key="CONTACT_TYPE"
                    style="max-width: 100px; margin-right: 5px"
                    size="small"
                  />
                  <el-input
                    v-if="item.accountType === 1"
                    v-model="item.paymentUserPhone"
                    style="width: 300px"
                    placeholder="请输入付款账号，并查询余额"
                    size="small"
                    :maxlength="phoneMaxlength(item.phoneAreaCode)"
                    @input="e => delNoNumber(e, item)"
                    @blur="changePaymentUserPhone(index)"
                  >
                    <el-select
                      slot="prepend"
                      v-model="item.phoneAreaCode"
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
                          v-for="n in group.options"
                          :key="n.areaCode"
                          :label="`+${n.areaCode} ${n.areaChineseName}`"
                          :value="n.areaCode"
                        >
                          <span style="float: left">{{
                            n.areaChineseName
                          }}</span>
                          <span
                            style="
                              float: right;
                              color: #8492a6;
                              font-size: 13px;
                            "
                            >+{{ n.areaCode }}</span
                          >
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </el-input>
                  <el-autocomplete
                    v-else
                    v-model="item.email"
                    size="small"
                    style="width: 250px"
                    :trigger-on-focus="false"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入付款账号，并查询余额"
                    @blur="changePaymentUserPhone(index)"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="m-t20">
            <el-col
              v-if="item.channel && item.channel === optionsChannelValue"
              :span="12"
            >
              <el-form-item label="用户钱包余额：">
                <el-button
                  v-if="!moneyShowFlag"
                  type="text"
                  @click="toSearchMoney(index)"
                  >点击查询</el-button
                >
                <p v-else>{{ moneyNumberShow }}</p>
              </el-form-item>
            </el-col>
            <el-col
              v-if="item.channel && item.channel === optionsChannelValue"
              :span="12"
            >
              <el-form-item
                label="扣款金额："
                :prop="'list.' + index + '.price'"
                :rules="[
                  { required: true, trigger: 'blur', validator: validatePass }
                ]"
              >
                <el-input-number
                  v-model="item.price"
                  :disabled="!moneyShowFlag || !moneyThetue"
                  controls-position="right"
                  :min="0"
                  :max="999999"
                  :precision="2"
                  class="w-296"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="item.channel && item.channel === optionsChannelValue">
            <el-row class="m-t20">
              <el-col :span="16">
                <el-form-item
                  label="交易凭证"
                  :prop="'list.' + index + '.imageUrl'"
                  :rules="[
                    {
                      required: true,
                      message: '请上传交易配图',
                      trigger: 'change'
                    }
                  ]"
                >
                  <div class="upload-img">
                    <div v-for="(items, i) in item.imageUrl" :key="i">
                      <uploadItem
                        :key="i"
                        class="m-r-16 m-b-16 avatar-uploader-icon-box"
                        :status="items.status"
                        :url="items.url"
                        :auth-progress="items.authProgress"
                        @del="delFile(item, i, index)"
                        @again="alignUpload(item, i, index)"
                      />
                    </div>
                    <el-upload
                      v-if="item.imageUrl.length < 6"
                      ref="upload"
                      class="avatar-uploader-icon-box"
                      action="#"
                      :limit="6"
                      :file-list="item.imageUrl"
                      :multiple="true"
                      :show-file-list="false"
                      accept=".jpg,.jpeg,.png,bmp,JPG,JPEG,PNG,BMP"
                      :on-exceed="exceedImgList"
                      :before-upload="beforeUpload"
                      :http-request="
                        option => {
                          return upload(option, index)
                        }
                      "
                    >
                      <i class="el-icon-plus" />
                      <div class="uploadViewText">点击上传</div>
                    </el-upload>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row class="m-t20">
              <el-col :span="12">
                <el-form-item
                  label="交易流水号"
                  :prop="'list.' + index + '.serialNum'"
                  :rules="[
                    {
                      required: true,
                      message: '请输入交易流水号',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    v-model="item.serialNum"
                    placeholder="请输入"
                    maxlength="50"
                    onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
                    class="w-296"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="支付时间"
                  :prop="'list.' + index + '.time'"
                  :rules="[
                    { required: true, message: '请选择时间', trigger: 'change' }
                  ]"
                >
                  <el-date-picker
                    v-model="item.time"
                    type="datetime"
                    style="width: 296px"
                    :picker-options="pickerOptions"
                    placeholder="选择日期时间"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="m-t20">
              <el-col :span="12">
                <el-form-item
                  label="流水金额"
                  :prop="'list.' + index + '.price'"
                  :rules="[
                    { required: true, trigger: 'blur', validator: validatePass }
                  ]"
                >
                  <el-input-number
                    v-model="item.price"
                    controls-position="right"
                    :min="0"
                    :max="999999"
                    :precision="2"
                    class="w-296"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="m-t20">
              <el-col :span="12">
                <el-form-item
                  label="交易凭证"
                  :prop="'list.' + index + '.imageUrl'"
                  :rules="[
                    {
                      required: true,
                      message: '请上传交易配图',
                      trigger: 'change'
                    }
                  ]"
                >
                  <div class="upload-img">
                    <div v-for="(items, i) in item.imageUrl" :key="i">
                      <uploadItem
                        :key="i"
                        class="m-r-16 m-b-16 avatar-uploader-icon-box"
                        :status="items.status"
                        :url="items.url"
                        :auth-progress="items.authProgress"
                        @del="delFile(item, i, index)"
                        @again="alignUpload(item, i, index)"
                      />
                    </div>
                    <el-upload
                      v-if="item.imageUrl.length < 6"
                      ref="upload"
                      class="avatar-uploader-icon-box"
                      action="#"
                      :limit="6"
                      :file-list="item.imageUrl"
                      :multiple="true"
                      :show-file-list="false"
                      accept=".jpg,.jpeg,.png,bmp,JPG,JPEG,PNG,BMP"
                      :on-exceed="exceedImgList"
                      :before-upload="beforeUpload"
                      :http-request="
                        option => {
                          return upload(option, index)
                        }
                      "
                    >
                      <i class="el-icon-plus" />
                      <div class="uploadViewText">点击上传</div>
                    </el-upload>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import { getQueryMoneyByPhone } from '@/api/business/addOrder'
import { getOssConfig } from '@/api/file'
import uploadItem from './uploadItem.vue'
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import { findCollectionList } from '@/api/order/index'
export default {
  components: {
    uploadItem
  },
  props: {
    userPhone: {
      type: String,
      default: ''
    },
    phoneAreaCode: {
      type: [String, Number],
      default: ''
    },
    email: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const str = rule.fullField + ''
      const strArr = str.split('.')
      const index = strArr[1]
      if (this.formWater.list[index].channel === this.optionsChannelValue) {
        if (value <= 0) {
          callback(new Error('扣款金额不能为0'))
        } else if (value > this.moneyNumberShow) {
          callback(new Error('用户钱包余额不足'))
        } else {
          callback()
        }
      } else {
        if (value <= 0) {
          callback(new Error('流水金额不能为0'))
        } else {
          callback()
        }
      }
    }
    return {
      validatePass,
      pickerOptions: {
        // 设置禁用状态，参数为当前日期
        disabledDate(time) {
          // return time.getTime() < Date.now(); //当天不可选
          return time.getTime() > Date.now() // - 86400000 //  - 86400000是否包括当天
        },
        // 控制时分秒不可选
        selectableRange: '00:00:00 - 23:59:59' // + new Date().getHours() + ':' + (new Date().getMinutes() + 1) + ':59'
      },
      loading: false,
      myRemark: '',
      moneyBagLocked: false,
      optionsChannel: [], // 收款渠道
      optionsArrayNoMoneyBag: [],
      moneyShowFlag: false,
      moneyNumberShow: '',
      fileList: [],
      userFillSentPhone: '',
      formWater: {
        list: [
          /* { // 默认
          id: this.getUuiD(25),
          num: 1,
          channel: '', // 渠道
          unit: '', // 单位
          account: '', // 账户
          serialNum: '', // 流水号
          time: '', // 支付时间
          price: '', // 金额
          optionsUnit: [], // 单位可选
          channelLabel: '', // 渠道名称
          imageUrl: [] // 交易凭证
        }*/
        ]
      },
      formWaterRule: {},
      optionsChannelValue: ''
    }
  },
  watch: {
    'formWater.list': {
      handler(val) {
        let allMoney = 0
        val.map(v => {
          if (v.price !== '' && v.price !== null && v.price !== undefined) {
            allMoney += Number(v.price)
          }
        })
        this.$emit('plusTheBukuanjineSbt', allMoney.toFixed(2), 2)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['smsAreaList', 'mailSuffixesList'])
  },
  mounted() {
    this.getFindCollectionList()
    this.getOssConfig()
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
    verifyPhone(code) {
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
      const maxObj = this.verifyPhone(code)
      return maxObj?.length || 15
    },
    fillData(arr) {
      this.$nextTick(() => {
        const that = this
        setTimeout(function () {
          const listWater = []
          that.moneyBagLocked = false
          if (arr !== undefined && arr.length) {
            arr.map((v, i) => {
              if (v.channel === '钱包支付') {
                that.moneyBagLocked = true
                that.userFillSentPhone = v.paymentUserPhone
              }
              const imageUrl = []
              if (v.voucherList !== undefined && v.voucherList !== null) {
                if (v.voucherList?.length > 0) {
                  // 交易凭证
                  v.voucherList.map(v => {
                    imageUrl.push({
                      file: '', // 文件对象
                      name: '', // 文件名
                      status: 3, // 状态
                      authProgress: 0, // 进度
                      ossTeacherFolder: '',
                      poster: '', // 封面
                      alignUploadShow: '', // 重新上传mask控制
                      abortCheckpoint: '', // 中断点
                      // eslint-disable-next-line no-undef
                      client: '',
                      url: v // 地址
                    })
                  })
                }
              }
              that.optionsChannel.map(e => {
                if (e.label === v.channel) {
                  const optionsUnit = []
                  let account = ''
                  let unit = ''
                  e.companyVo.map(q => {
                    optionsUnit.push({
                      label: q.company,
                      value: q.id,
                      id: q.id,
                      account: q.account
                    })
                    if (q.company === v.company) {
                      account = q.account
                      unit = q.id
                    }
                  })

                  listWater.push({
                    id: that.getUuiD(25),
                    num: i + 1,
                    channel: e.id, // 渠道
                    unit, // 单位
                    account, // 账户
                    accountType: v.accountType,
                    email: v.email,
                    phoneAreaCode: v.phoneAreaCode,
                    serialNum: v.transactionId, // 流水号
                    time: v.payTime
                      ? parseTime(
                          new Date(v.payTime).getTime(),
                          '{y}-{m}-{d} {h}:{i}:{s}'
                        )
                      : '--', // 支付时间
                    price: v.payerTotal, // 金额
                    optionsUnit, // 单位可选
                    channelLabel: e.label, // 渠道名称
                    paymentUserPhone: v.paymentUserPhone,
                    imageUrl // 交易凭证
                  })
                }
              })
            })
          }
          that.formWater.list = listWater
          that.formWater.list.some((item, i) => {
            if (item.channel === that.optionsChannelValue) {
              that.toSearchMoney(i)
            }
          })
          console.log('this.formWater.list::::', that.formWater.list)
        }, 500)
      })
    },
    delNoNumber(e, item) {
      item.paymentUserPhone = e.replace(/\D/g, '')
    },
    getOptionsUnitChange(e, index) {
      this.$refs.formWater.clearValidate()
      const unit = []
      if (e === this.optionsChannelValue) {
        this.moneyBagLocked = true
        this.moneyNumberShow = 0
        this.moneyShowFlag = false
      } else {
        this.moneyBagLocked = false
        this.formWater.list?.some(item => {
          if (item.channel === this.optionsChannelValue) {
            this.moneyBagLocked = true
          }
        })
      }
      this.optionsChannel.map((v, i) => {
        if (v.id === e) {
          console.log(v, '所选')
          this.formWater.list[index].channelLabel = v.label
          this.formWater.list[index].optionsUnit = []
          this.formWater.list[index].unit = ''
          this.formWater.list[index].account = ''
          this.formWater.list[index].price = 0
          this.formWater.list[index].serialNum = ''
          this.formWater.list[index].time = ''
          this.formWater.list[index].imageUrl = []
          // this.formWater.list[index].paymentUserPhone = ''
          console.log(
            'this.formWater.list[index].channelLabel',
            this.formWater.list[index].channelLabel
          )
          v.companyVo.map(e => {
            unit.push({
              label: e.company,
              value: e.id,
              id: e.id,
              account: e.account
            })
          })
          console.log('认监委iojfdsl:', this.userFillSentPhone, this.userPhone)
          if (v.id === this.optionsChannelValue) {
            this.moneyBagLocked = true
            this.$set(
              this.formWater.list[index],
              'paymentUserPhone',
              this.userPhone ? this.userPhone : this.userFillSentPhone
            )
            console.log(4444444, this.email)
            this.$set(this.formWater.list[index], 'email', this.email || '')
            this.$set(
              this.formWater.list[index],
              'phoneAreaCode',
              this.phoneAreaCode || ''
            )
          } else {
            this.moneyBagLocked = false
            this.formWater.list.some(item => {
              if (item.channel === this.optionsChannelValue) {
                this.moneyBagLocked = true
              }
            })
          }
        }
        this.formWater.list[index].optionsUnit = unit
        this.$refs.formWater.clearValidate()
      })
    },
    getFindCollectionList() {
      const param = {}
      findCollectionList(param)
        .then(res => {
          const channel = []
          if (res.data.length) {
            console.log('rrreeeddddaatattatat:', res.data)
            res.data.map(v => {
              if (
                v.channel === '抖音' ||
                v.channel === '商学通' ||
                v.channel === '获课一下' ||
                v.channel === '小鹅通' ||
                v.channel === '微信小商店' ||
                v.channel === '有赞' ||
                v.channel === '快手' ||
                v.channel === '博商' ||
                v.channel === '抖店测试' ||
                v.channel === 'pos机扫码' ||
                v.channel === 'pos机刷卡' ||
                v.channel === '博商-建设银行'
              ) {
                return
              } else {
                channel.push({
                  label: v.channel,
                  value: v.id,
                  id: v.id,
                  companyVo: v.companyVo
                })
              }
            })
            this.optionsChannel = channel
            this.optionsArrayNoMoneyBag = []
            this.optionsChannel.some(item => {
              if (item.label !== '钱包支付') {
                this.optionsArrayNoMoneyBag.push(item)
              } else if (item.label === '钱包支付') {
                this.optionsChannelValue = item.value
              }
            })
          }
        })
        .catch(() => {})
    },
    onClickDelWater(id, item) {
      const list = this.formWater.list
      list.map((v, i) => {
        if (v.id === id) {
          list.splice(i, 1)
        }
      })
      this.formWater.list.map((v, i) => {
        v.num = i + 1
      })
      if (item.channel === this.optionsChannelValue) {
        this.moneyBagLocked = false
      }
      this.formWater.list = list
    },
    // 点击重新上传
    async alignUpload(item, index, key) {
      const self = this.formWater.list[key].imageUrl[index]
      await this.resumeUpload(self)
    },
    // 点击删除
    delFile(item, index, key) {
      console.log(item, index, key)
      if (item.abortCheckpoint) {
        item.client &&
          item.client.abortMultipartUpload(
            item.abortCheckpoint.name,
            item.abortCheckpoint.uploadId
          )
      }
      this.formWater.list[key].imageUrl.splice(index, 1)
    },
    getUuiD(randomLength) {
      return (
        Number(
          Math.random().toString().substr(2, randomLength) + Date.now()
        ).toString(36) +
        Math.floor(Math.random() * 10) +
        1
      )
    },
    exceedImgList() {
      this.$notify.error({
        title: '操作失败',
        message: '上传图片数量最大限制：6个'
      })
    },
    beforeUpload(file) {
      console.log(file, 'file')
      const fileType = getFileType(file.name)
      console.log(fileType)
      if (fileType.fileType === 'img') {
        const isLt5M = file.size / 1024 / 1024 < 5
        !isLt5M && this.$message.error('上传图片大小不能超过 5MB!')
        console.log(isLt5M)
        return isLt5M
      } else {
        this.$message.error(`不支持${fileType.suffix}格式的文件上传`)
        return false
      }
      // 限制上传文件大小 500M
      // const isLt20M = file.size / 1024 / 1024 < 20
      // if (!isLt20M) {
      //   this.$message.error('上传文件大小不能超过 20MB!')
      // }
    },
    toSearchMoney(index) {
      this.moneyNumberShow = ''
      if (this.formWater.list[index].accountType === 1) {
        if (!this.formWater.list[index].paymentUserPhone) {
          return this.$message.warning('请填写手机号')
        }
        if (!this.formWater.list[index].phoneAreaCode) {
          return this.$message.warning('请选择区号')
        }
      }
      if (
        this.formWater.list[index].accountType === 2 &&
        !this.formWater.list[index].email
      ) {
        return this.$message.warning('请填写邮箱')
      }
      const params = {
        phone: this.formWater.list[index].paymentUserPhone,
        type: this.formWater.list[index].accountType,
        phoneAreaCode: this.formWater.list[index].phoneAreaCode,
        email: this.formWater.list[index].email
      }
      console.log(555555, this.formWater.list)
      getQueryMoneyByPhone(params).then(res => {
        console.log('交付到时看类范德萨：', res)
        if (res.code === 1 && res.data) {
          this.moneyShowFlag = !this.moneyShowFlag
          this.moneyNumberShow = (Number(res.data.balance) / 100).toFixed(2)
          this.moneyThetue = true
          if (this.formWater.list[index].price !== 0) {
            const str = 'list.' + index + '.price'
            this.$refs.formWater.validateField(str)
          }
        } else {
          this.moneyShowFlag = !this.moneyShowFlag
          this.moneyThetue = false
          this.moneyNumberShow = '输入账号钱包无余额'
          this.formWater.list[index].price = 0
        }
      })
    },
    onClickAddWater() {
      this.formWater.list.push({
        id: this.getUuiD(25),
        num: '',
        accountType: 1,
        phoneAreaCode: '',
        email: '',
        paymentUserPhone: '',
        channel: '', // 渠道
        unit: '', // 单位
        account: '', // 账户
        serialNum: '', // 流水号
        time: '', // 支付时间
        price: '', // 金额
        optionsUnit: [], // 单位可选
        channelLabel: '', // 渠道名称
        imageUrl: [] // 交易凭证
      })
      this.formWater.list.map((v, i) => {
        v.num = i + 1
      })
    },
    getAccountChange(e, index, optionsUnit) {
      optionsUnit.map(v => {
        if (v.id === e) {
          this.formWater.list[index].account = v.account
          console.log(v, e)
        }
      })
      this.formWater.list[index].channel=e;
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
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    changePaymentUserPhone(index) {
      this.moneyShowFlag = false
      this.formWater.list[index].price = 0
    },
    async upload(e, i) {
      this.$refs.upload[0].clearFiles()
      console.log(e)
      console.log(i, '在这')
      console.log('上传文件', e)
      console.log(
        '上传文this.$refs.upload.clearFiles()件',
        this.$refs.upload[0].clearFiles()
      )
      // this.$refs.upload.clearFiles()
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${
          this.$getFileType(selectFile.name).suffix
        }`, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_order/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      const fileListWater = this.formWater.list[i]
      console.log(fileListWater, 'fileListWater')
      fileListWater.imageUrl.push(obj)
      this.formWater.list[i] = fileListWater
      // this.fileList.push(obj)
      // const index = this.fileList.length - 1
      // const self = this.fileList[index]
      const index = fileListWater.imageUrl.length - 1
      const self = fileListWater.imageUrl[index]
      console.log('这是self', self)
      try {
        console.log('进来这里了：')
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
          self.ossTeacherFolder + obj.name,
          obj.file,
          {
            ...options
          }
        )
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster =
          self.url +
          '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        fileListWater.imageUrl.map(v => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.water-list {
  .itemBox {
    display: flex;
    align-items: center;
  }
  .water-child {
    padding: 20px 12px 16px 12px;
    background: #f7fbff;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
    min-width: 1000px;
    .water-child-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .water-child-header-l {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
      }
      .water-child-header-r {
        width: 68px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #f53f3f;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #f53f3f;
        cursor: pointer;
      }
    }
  }
  .water-child-box {
    .water-child-box-title {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      padding-right: 8px;
      text-align: right;
      white-space: nowrap;
      display: inline-block;
      width: 78px;
    }
    .water-child-box-title-max {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
    }
  }
}
.upload-img {
  display: flex;
  .avatar-uploader-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 90px;
    border-radius: 4px;
    background-color: #f3f3f3;
    margin-right: 10px;
  }
}
.w-150 {
  width: 150px;
}

.w-260 {
  width: 260px;
}
.flex-box {
  display: flex;
}
.flex-item {
  align-items: center;
}
.form-box {
  ::v-deep .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
