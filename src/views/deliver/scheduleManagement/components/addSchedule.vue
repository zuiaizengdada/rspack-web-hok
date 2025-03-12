<template>
  <!-- 新增班主任弹框 -->
  <AppDialog
    v-model="config.visible"
    title="新增班期"
    width="694px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div id="ss-dialog-content" class="addSchedule overflowOuto">
      <!-- 新增班期弹框 -->
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label-width="91px"
        size="small"
      >
        <el-row>
          <el-col>
            <el-form-item label="课程名称：" prop="goodsName">
              <courseSelect
                ref="CourseSelect"
                :multiple="multiple"
                style="width: 200px"
                :default-id="form.goodsId"
                tearch
                :value="form.goodsName"
                @selected="onhandleCourseSelect"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班期：" prop="scheduleNum">
              <el-input
                v-model="form.scheduleNum"
                class="w-200 m-r-10"
                maxlength="20"
                show-word-limit
                @input="delNoNumber"
              />
              <div class="tips m-t-8">只能输入中文，英文，数字</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="容纳人数：">
              <accommodate ref="accommodateRef" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="班主任：" prop="scheduleHeadteacher">
          <div>
            <el-button
              icon="el-icon-plus"
              @click="handleClickAddHeadmaster"
            >添加班主任</el-button>
            <span
              class="tips m-l-8"
            >人员设为提醒后，飞书会在班期完结48小时后每天固定时间提醒录入成本信息</span>
          </div>
          <headmasterChange
            v-if="form.scheduleHeadteacher.length > 0"
            ref="headmasterChange"
            :data="form.scheduleHeadteacher"
            class="m-t-16"
            :li-style="{ width: '144px', marginRight: '37px' }"
            width="541px"
            del
            @del="delScheduleHeadteacher"
            @remindChange="remindChange"
          />
        </el-form-item>
        <el-form-item label="交付日期：" prop="deliveryTime">
          <el-date-picker
            v-model="form.deliveryTime"
            style="width: 310px"
            :picker-options="startPickerOptions"
            type="daterange"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            unlink-panels
            @change="deliveryTimeChange"
          />
        </el-form-item>
        <el-form-item label="交付地点：" prop="districtArr">
          <AppAreaSelect
            ref="AppAreaSelect"
            v-model="form.districtArr"
            v-loading="getLastDistrictLoading"
            element-loading-spinner="el-icon-loading"
            clearable
            :maxlevel="1"
            propsvalue="name"
          />
        </el-form-item>
        <el-form-item label="详细地址：" prop="deliveryAddress">
          <el-input v-model="form.deliveryAddress" style="width: 496px" />
        </el-form-item>
        <template v-if="form.deliveryTime && form.deliveryTime.length > 0">
          <el-form-item
            v-for="(item, index) in form.sessionList"
            :id="`sessionList${index}`"
            :key="index"
            :label="index === 0 ? '交付场次：' : ''"
            :rules="{
              validator: (rule, value, callback) =>
                validateSessionList(rule, value, callback, index),
              required: true,
              trigger: 'blur'
            }"
            :prop="'sessionList.' + index"
          >
            <div class="btn_box">
              <el-date-picker
                v-model="form.sessionList[index]"
                class="w-200 m-r-8"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="选择日期时间"
                default-time="08:00:00"
                :picker-options="pickerOptions"
              />
              <div class="btn_view" @click="addSession">
                <i class="el-icon-plus" />
              </div>
              <div
                v-if="form.sessionList.length !== 1"
                class="btn_view"
                @click="delSession(item, index)"
              >
                <i class="el-icon-minus" />
              </div>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import headmasterChange from './headmasterChange.vue'
import CourseSelect from '../../components/courseSelect.vue'
import AppAreaSelect from '@/components/AppTemplate/AppAreaSelect/index'
import accommodate from './accommodate.vue'
import moment from 'moment'
import {
  addDeliverySchedule,
  getLastDistrict

} from '@/api/deliver/scheduleManagement'
export default {
  components: {
    AppDialog,
    headmasterChange,
    CourseSelect,
    AppAreaSelect,
    accommodate
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
    var validateDeliveryTime = (rule, value, callback) => {
      if (!value) {
        return callback('请选择交付时间')
      }
      if (value && value.length === 0) {
        return callback('请选择交付时间')
      }
      return callback()
    }
    return {
      multiple: true,
      form: {
        goodsId: '',
        goodsName: '',
        scheduleHeadteacher: [],
        sessionList: [''],
        goodsIds: '',
        goodsIdList: [],
        scheduleNum: '',
        capacity: '',
        deliveryAddress: '',
        deliveryTime: [],
        districtArr: []
      },
      validateSessionList: (rule, value, callback, index) => {
        if (!value) {
          return callback('请选择交付场次')
        } else {
          if (index !== 0 && value <= this.form.sessionList[index - 1]) {
            return callback('必须大于上一个交付场次时间')
          }
          if (!this.form.deliveryTime) {
            return callback()
          }
          if (value > this.form.deliveryTime[1] + ' 23:59:59') {
            return callback('日期必须小于交付结束日期')
          }
          return callback()
        }
      },
      rules: {
        name: [{ required: true, message: '请输入IP名称', trigger: 'blur' }],
        goodsName: [{ required: true, message: '请选择课程', trigger: 'blur' }],
        scheduleHeadteacher: [
          {
            type: 'array',
            required: true,
            message: '请至少有一个设置为提醒的班主任',
            trigger: 'blur'
          }
        ],
        sessionList: [
          {
            type: 'array',
            required: true,
            message: '请设置交付场次',
            trigger: 'blur'
          }
        ],
        scheduleNum: [
          { required: true, message: '请输入班期', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请输入容纳人数', trigger: 'blur' }
        ],
        districtArr: [
          {
            type: 'array',
            required: true,
            message: '请选择交付地点',
            trigger: 'blur'
          }
        ],
        deliveryTime: [
          { validator: validateDeliveryTime, required: true, trigger: 'blur' }
        ]
      },
      loading: false,
      getLastDistrictLoading: false
      // defaultTime: [moment().format('HH:mm:ss'), '00:00:00']
    }
  },
  computed: {
    startPickerOptions() {
      // 最小日期(今天)
      const minDate = moment().startOf('day').format('YYYY-MM-DD')
      return {
        disabledDate: time => {
          return time.getTime() < moment(minDate).valueOf()
        }
      }
    },
    pickerOptions() {
      return {
        disabledDate: time => {
          return (
            time.getTime() > moment(this.form.deliveryTime[1]).valueOf() ||
            time.getTime() < moment(this.form.deliveryTime[0]).valueOf()
          )
        }
      }
    }
  },
  watch: {
    'config.visible'(val) {
      this.$refs.ruleForm && this.init()
    }
  },
  mounted() {},
  methods: {
    // 选择课程触发回调事件
    onhandleCourseSelect(val, keyList) {
      // if (val.length > 0) {
      //   this.form.goodsId = val[0].goodsId
      //   this.form.goodsName = val[0].contentName
      //   this.form.goodsId && this.getLastDistrict(this.form.goodsId)
      // }
      if (this.multiple) {
        // 判断返回是否是空
        if (!keyList?.length) {
          this.form.goodsId = []
          this.form.goodsIds = ''
          this.form.goodsName = []
          return
        }
        // 默认值
        let newgoodsId = this.form.goodsId
        let newgoodsName = this.form.goodsName
        // 返回的key 跟默认key 匹配 更新newgoodsId，newgoodsName默认值
        if (this?.form?.goodsId?.length && keyList?.length) {
          const goods =
            this.form.goodsId?.map((item, index) => ({
              goodsId: item,
              goodsName: this.form.goodsName[index]
            })) || []
          const newGoods = goods.filter(item => {
            return keyList.includes(item.goodsId)
          })
          newgoodsId = newGoods.map(item => item.goodsId)
          newgoodsName = newGoods.map(item => item.goodsName)
        }
        const newGoodsIds = [
          ...new Set([...newgoodsId, ...val?.map(item => item.goodsId)])
        ]
        const newGoodsNames = [
          ...new Set([...newgoodsName, ...val?.map(item => item.contentName)])
        ]
        // 重新赋值
        this.form.goodsId = newGoodsIds || []
        this.form.goodsIds = this.form?.goodsId?.join(',')
        this.form.goodsName = newGoodsNames || []
        this.form.goodsIds && this.getLastDistrict(val[0]?.goodsId || '')
        return
      }
      // 单选
      this.form.goodsId = val[0]?.goodsId || ''
      this.form.goodsName = val[0]?.contentName || ''
      this.form.goodsId && this.getLastDistrict(this.form.goodsId)
    },
    // 点击确认按钮
    sure() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addSchedule()
        } else {
          return false
        }
      })
    },
    // 初始化表单
    init() {
      this.form = {
        name: '',
        goodsId: '',
        goodsName: '',
        scheduleHeadteacher: [],
        sessionList: [''],
        scheduleNum: '',
        capacity: '',
        deliveryAddress: '',
        deliveryTime: [],
        districtArr: []
      }
      this.$refs.accommodateRef.setData()
      this.$refs.ruleForm.resetFields()
    },
    // 点击添加班主任按钮
    handleClickAddHeadmaster() {
      const checkUser = []
      if (this.form.scheduleHeadteacher.length > 0) {
        this.form.scheduleHeadteacher.map(v => {
          checkUser.push({
            ...v,
            nickName: v.userName
          })
        })
      }
      this.$AddressBook({
        visible: true,
        multiple: true,
        minlength: 1,
        type: [1],
        checkUser,
        success: res => {
          const scheduleHeadteacher = []
          res.user.map(v => {
            const index = this.form.scheduleHeadteacher.findIndex(
              e => e.userId === v.userId
            )
            scheduleHeadteacher.push({
              userName: v.nickName,
              userId: v.userId,
              remindFlag:
                index > -1
                  ? (v.remindFlag =
                      this.form.scheduleHeadteacher[index].remindFlag)
                  : (v.remindFlag = 2)
            })
          })
          this.form.scheduleHeadteacher = scheduleHeadteacher
          this.$refs.ruleForm &&
            this.$refs.ruleForm.validateField('scheduleHeadteacher')
        }
      })
    },
    // 点击删除添加的班主任
    delScheduleHeadteacher(item) {
      if (this.form.scheduleHeadteacher.length === 1) {
        return this.$message.error('请至少保留一个班主任')
      }

      const index = this.form.scheduleHeadteacher.findIndex(
        v => v.userId === item.userId
      )
      this.form.scheduleHeadteacher.splice(index, 1)
      // 更新组件数据
      this.$nextTick(() => {
        this.$refs.headmasterChange.refresh()
      })
    },
    // 添加场次
    addSession() {
      this.form.sessionList.push('')
      this.$nextTick(() => {
        document.getElementById('ss-dialog-content').scrollTop =
          document.getElementById(
            `sessionList${this.form.sessionList.length - 1}`
          ).offsetTop
      })
    },
    delSession(item, index) {
      this.form.sessionList.splice(index, 1)
    },
    // 交付时间改变触发：当清空的时候要同步清空交付场次
    deliveryTimeChange(val) {
      if (!val) {
        this.form.sessionList = []
        this.form.deliveryTime = []
      } else {
        if (val && val[0]) {
          this.form.sessionList = [
            moment(val[0]).add(8, 'hours').format('YYYY-MM-DD HH:mm')
          ]
        } else {
          this.form.sessionList = ['']
        }
      }
    },
    // 班主任提醒通知改变触发
    remindChange(item) {
      const index = this.form.scheduleHeadteacher.findIndex(
        v => v.userId === item.userId
      )
      const remindFlag = this.form.scheduleHeadteacher[index].remindFlag
      if (remindFlag === 2) {
        const arr = this.form.scheduleHeadteacher.filter(
          v => v.remindFlag === 2
        )
        if (arr.length < 2) {
          return this.$message.error('请至少保留一个被设置为提醒的班主任')
        }
        this.form.scheduleHeadteacher[index].remindFlag = 1
      } else {
        this.form.scheduleHeadteacher[index].remindFlag = 2
      }
    },
    // 新增班期
    addSchedule() {
      const {
        goodsId,
        scheduleHeadteacher,
        sessionList,
        scheduleNum,
        deliveryTime,
        districtArr,
        deliveryAddress,
        goodsIds
      } = this.form
      const dataForm = JSON.parse(JSON.stringify(this.$refs.accommodateRef.getForm()))
      const { capacityMatchType, capacity, scheduleCapacityAddReq } = dataForm
      if (capacityMatchType === '1') {
        if (!capacity) return this.$message.warning('请输入容纳人数限制！')
      }
      if (capacityMatchType === '2') {
        const bol = scheduleCapacityAddReq.every(
          item => typeof item.startPrice === 'number'
        )
        if (!bol) return this.$message.warning('请输入容纳人数限制！')
        const bolOne = scheduleCapacityAddReq.every(
          item => typeof item.capacity === 'number'
        )
        if (!bolOne) return this.$message.warning('请输入容纳人数限制！')
      }

      if (capacityMatchType === '2') {
        if (dataForm.scheduleCapacityAddReq.length) {
          dataForm.scheduleCapacityAddReq.forEach(item => {
            item.startPrice = item.startPrice * 100
            item.endPrice = item.endPrice * 100
          })
        }
      }
      this.loading = true
      const districtName = districtArr.join('\t')
      const scheduleHeadteacherReqList = scheduleHeadteacher.reduce(
        (pre, next) => {
          return pre.concat([
            {
              userId: next.userId,
              remindFlag: next.remindFlag
            }
          ])
        },
        []
      )
      const deliveryEndTime = deliveryTime
        ? moment(deliveryTime[1]).format('YYYY-MM-DD 23:59:59')
        : ''
      const deliveryStartTime = deliveryTime
        ? moment(deliveryTime[0]).format('YYYY-MM-DD 00:00:00')
        : ''
      const data = {
        capacity,
        deliveryAddress,
        deliveryEndTime,
        deliveryStartTime,
        districtName,
        goodsId: this.multiple ? '' : goodsId,
        goodsIds,
        scheduleHeadteacherReqList,
        scheduleNum,
        sessionList,
        ...dataForm
      }
      addDeliverySchedule(data)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取商品班期上一次的地点
    getLastDistrict(goodsId) {
      this.$nextTick(() => {
        this.$refs.AppAreaSelect.refresh()
        this.getLastDistrictLoading = true
        getLastDistrict(goodsId)
          .then(res => {
            console.log(res)
            if (res.data) {
              const arr = res.data.split('\t')
              arr.length === 2
                ? (this.form.districtArr = arr)
                : (this.form.districtArr = [])
            } else {
              this.form.districtArr = []
            }
            this.getLastDistrictLoading = false
          })
          .catch(() => {
            this.getLastDistrictLoading = false
          })
      })
    },
    delNoNumber(e) {
      this.form.scheduleNum = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.addSchedule {
  max-height: 619px;
  padding: 20px;
  box-sizing: border-box;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
.btn_box {
  display: flex;
  align-items: center;
  .btn_view {
    display: inline-block;
    width: 32px;
    font-size: 14px;
    height: 32px;
    border-radius: 4px;
    border: 1px dashed #dcdcdc;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      border-color: #409eff;
    }
  }
}
</style>
