<template>
  <!-- 编辑班主任弹框 -->
  <AppDialog
    v-model="config.visible"
    title="编辑班期"
    width="694px"
    :loading="loading"
    :btn-footer="config.scheduleStatus !== 3"
    height="auto"
    @success="sure"
  >
    <div v-loading="loading" class="editSchedule overflowOuto">
      <!-- 编辑排期弹框 -->
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="91px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程名称：" prop="goodsNameList">
              <el-tag v-for="(item,index) in form.goodsNameList" :key="index" type="info" class="eltagBox">{{ item }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IP：" prop="filterTearchName">
              <span>{{ form.lecturerNameList | filterTearchName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班期：" prop="scheduleNum">
              <el-input
                v-model="form.scheduleNum"
                :disabled="config.scheduleStatus === 3"
                class="w-200 m-r-10"
                maxlength="20"
                show-word-limit
                @input="delNoNumber"
              />
              <div class="tips m-t-8">只能输入中文，英文，数字</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="容纳人数：" prop="capacity">
              <el-input-number v-model="form.capacity" :disabled="config.scheduleStatus === 3" class="w-200 m-r-10" controls-position="right" :min="1" :max="999998" />人
              <div class="tips m-t-8">只能输入大于0小于999999的整数</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="班主任：" prop="scheduleHeadteacher">
          <div>
            <el-button icon="el-icon-plus" :disabled="config.scheduleStatus === 3" @click="handleClickAddHeadmaster">添加班主任</el-button>
            <span class="tips m-l-8">人员设为提醒后，飞书会在班期完结48小时后每天固定时间提醒录入成本信息</span>
          </div>
          <headmasterChange
            v-if="form.scheduleHeadteacher.length > 0"
            ref="headmasterChange"
            :disabled="config.scheduleStatus === 3"
            :data="form.scheduleHeadteacher"
            class="m-t-16"
            :li-style="{width: '144px', marginRight: '37px'}"
            width="541px"
            :del="config.scheduleStatus !== 3"
            @del="delScheduleHeadteacher"
            @remindChange="remindChange"
          />
        </el-form-item>
        <el-form-item label="交付日期：" prop="deliveryTime">
          <el-date-picker
            v-model="form.deliveryTime"
            style="width: 310px"
            :disabled="config.scheduleStatus === 2 || config.scheduleStatus === 3"
            :picker-options="startPickerOptions"
            :default-time="defaultTime"
            type="datetimerange"
            placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            unlink-panels
            @change="deliveryTimeChange"
          />
        </el-form-item>
        <el-form-item label="交付地点：" prop="districtArr">
          <AppAreaSelect
            v-model="form.districtArr"
            :maxlevel="1"
            :disabled="config.scheduleStatus === 3"
          />
        </el-form-item>
        <el-form-item label="详细地址：" prop="deliveryAddress">
          <el-input v-model="form.deliveryAddress" style="width: 496px" :disabled="config.scheduleStatus === 3" />
        </el-form-item>
        <template v-if="form.deliveryTime && form.deliveryTime.length > 0">
          <el-form-item
            v-for="(item, index) in form.sessionList"
            :key="index"
            :label="index === 0 ? '交付场次：' : ''"
            :rules="{
              validator: (rule, value, callback) => validateSessionList(rule, value, callback, index), required: true, trigger: 'blur'
            }"
            :prop="'sessionList.' + index"
          >
            <div class="btn_box">
              <el-date-picker
                v-model="form.sessionList[index]"
                :disabled="config.scheduleStatus === 2 || config.scheduleStatus === 3"
                class="w-200 m-r-8"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="pickerOptions"
              />
              <div v-if="config.scheduleStatus !== 2" class="btn_view" @click="addSession"><i class="el-icon-plus" /></div>
              <div v-if="form.sessionList.length !== 1 && config.scheduleStatus !== 2" class="btn_view" @click="delSession(item, index)"><i class="el-icon-minus" /></div>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import headmasterChange from '@/views/deliver/scheduleManagement/components/headmasterChange.vue'
import AppAreaSelect from '@/components/AppTemplate/AppAreaSelect/index'
import moment from 'moment'
import { editDeliverySchedule, getDeliveryScheduleDetail } from '@/api/deliver/scheduleManagement'
import { filterDate } from '@/filters/index'
export default {
  components: {
    AppDialog,
    headmasterChange,
    AppAreaSelect
  },
  filters: {
    filterTearchName(val) {
      console.log(val, 'val')
      if (!val || val.length === 0) {
        return ''
      } else {
        return val.join(',')
      }
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          scheduleStatus: '',
          goodsId: '',
          scheduleId: ''
        }
      }
    }
  },
  data() {
    var validateDeliveryTime = (rule, value, callback) => {
      if (this.config.scheduleStatus === 2) {
        return callback()
      }
      console.log(value, moment().valueOf())
      if (!value) {
        return callback('请选择交付时间')
      }
      if (value[0] < moment().format('YYYY-MM-DD HH:mm')) {
        return callback('交付开始时间需要大于当前时间')
      }
      return callback()
    }
    return {
      form: {
        goodsId: '',
        goodsName: '',
        scheduleHeadteacher: [],
        sessionList: [''],
        scheduleNum: '',
        capacity: '',
        deliveryAddress: '',
        deliveryTime: [],
        scheduleId: '',
        districtArr: [],
        goodsNameList: []
      },
      validateSessionList: (rule, value, callback, index) => {
        if (this.config.scheduleStatus === 2) {
          return callback()
        }
        if (!value) {
          return callback('请选择交付场次')
        } else {
          if (index !== 0 && value <= this.form.sessionList[index - 1]) {
            return callback('必须大于上一个交付场次时间')
          }
          if (!this.form.deliveryTime) {
            return callback()
          }
          if (value > this.form.deliveryTime[1]) {
            return callback('日期必须小于交付结束日期')
          }
          if (value < this.form.deliveryTime[0]) {
            return callback('日期必须大于交付开始日期')
          }
          return callback()
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入IP名称', trigger: 'blur' }
        ],
        goodsName: [
          { required: true, message: '请选择课程', trigger: 'blur' }
        ],
        scheduleHeadteacher: [
          { type: 'array', required: true, message: '请至少有一个设置为提醒的班主任', trigger: 'blur' }
        ],
        sessionList: [
          { type: 'array', required: true, message: '请设置交付场次', trigger: 'blur' }
        ],
        scheduleNum: [
          { required: true, message: '请输入班期', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请输入容纳人数', trigger: 'blur' }
        ],
        districtArr: [
          { type: 'array', required: true, message: '请选择交付地点', trigger: 'blur' }
        ],
        deliveryTime: [
          { validator: validateDeliveryTime, required: true, trigger: 'blur' }
        ]
      },
      loading: false,
      defaultTime: [moment().format('HH:mm:ss'), '00:00:00']
    }
  },
  computed: {
    startPickerOptions() {
      // 最小日期(今天)
      const minDate = moment().startOf('day').format('YYYY-MM-DD')
      return {
        disabledDate: (time) => {
          return time.getTime() < moment(minDate).valueOf()
        },
        onPick: ({ maxDate, minDate }) => {
          if (minDate) {
            const curDate = moment(minDate).format('YYYY-MM-DD')
            if (curDate === moment().startOf('day').format('YYYY-MM-DD')) {
              const str = moment().format('HH:mm:ss')
              this.selectableRange = [`${str} - 23:59:59`, '00:00:00 - 23:59:59']
            } else {
              const str = '00:00:00'
              this.selectableRange = [`${str} - 23:59:59`, '00:00:00 - 23:59:59']
            }
            this.startPickerOptions.selectableRange = this.selectableRange
          }
        },
        selectableRange: this.selectableRange
      }
    },
    pickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() > moment(this.form.deliveryTime[1]).valueOf() || time.getTime() < moment(this.form.deliveryTime[0]).subtract(1, 'days').valueOf()
        }
      }
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        console.log('打开')
        this.getDetail()
      } else {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    // 选择课程触发回调事件
    onhandleCourseSelect(val) {
      if (val.length > 0) {
        this.form.goodsId = val[0].goodsId
        this.form.goodsName = val[0].contentName
      }
    },
    // 点击确认按钮
    sure() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.editSchedule()
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
        lecturerNameList: [],
        districtArr: [],
        goodsNameList: []
      }
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
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
        success: (res) => {
          const scheduleHeadteacher = []
          res.user.map(v => {
            const index = this.form.scheduleHeadteacher.findIndex(e => e.userId === v.userId)
            scheduleHeadteacher.push({
              userName: v.nickName,
              userId: v.userId,
              remindFlag: index > -1 ? v.remindFlag = this.form.scheduleHeadteacher[index].remindFlag : v.remindFlag = 2
            })
          })
          this.form.scheduleHeadteacher = scheduleHeadteacher
          this.$refs.ruleForm && this.$refs.ruleForm.validateField('scheduleHeadteacher')
        }
      })
    },
    // 点击删除添加的班主任
    delScheduleHeadteacher(item) {
      if (this.form.scheduleHeadteacher.length === 1) {
        return this.$message.error('请至少保留一个班主任')
      }
      const arr = this.form.scheduleHeadteacher.filter(v => v.remindFlag === 2)
      if (arr.length < 2) {
        return this.$message.error('请至少保留一个被设置为提醒的班主任')
      }
      const index = this.form.scheduleHeadteacher.findIndex(v => v.userId === item.userId)
      this.form.scheduleHeadteacher.splice(index, 1)
      // 更新组件数据
      this.$nextTick(() => {
        this.$refs.headmasterChange.refresh()
      })
    },
    // 添加场次
    addSession() {
      this.form.sessionList.push('')
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
        this.form.sessionList = ['']
      }
    },
    // 班主任提醒通知改变触发
    remindChange(item) {
      if (this.config.scheduleStatus === 3) {
        return
      }
      const index = this.form.scheduleHeadteacher.findIndex(v => v.userId === item.userId)
      const remindFlag = this.form.scheduleHeadteacher[index].remindFlag
      if (remindFlag === 2) {
        const arr = this.form.scheduleHeadteacher.filter(v => v.remindFlag === 2)
        if (arr.length < 2) {
          return this.$message.error('请至少保留一个被设置为提醒的班主任')
        }
        this.form.scheduleHeadteacher[index].remindFlag = 1
      } else {
        this.form.scheduleHeadteacher[index].remindFlag = 2
      }
    },
    // 编辑班期
    editSchedule() {
      this.loading = true
      const {
        goodsId,
        scheduleHeadteacher,
        sessionList,
        scheduleNum,
        capacity,
        deliveryTime,
        districtArr,
        deliveryAddress,
        goodsNameList,
        scheduleId
      } = this.form
      console.log(this.form, 'form')
      const districtName = districtArr.join('\t')
      const scheduleHeadteacherReqList = scheduleHeadteacher.reduce((pre, next) => {
        return pre.concat([{
          userId: next.userId,
          remindFlag: next.remindFlag
        }])
      }, [])
      const data = {
        capacity,
        deliveryAddress,
        deliveryEndTime: deliveryTime ? deliveryTime[1] : '',
        deliveryStartTime: deliveryTime ? deliveryTime[0] : '',
        districtName,
        goodsNameList,
        goodsId,
        goodsIds: goodsId,
        scheduleHeadteacherReqList,
        scheduleNum,
        scheduleId,
        sessionList
      }
      editDeliverySchedule(data).then(res => {
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取班期详情
    getDetail() {
      this.loading = true
      getDeliveryScheduleDetail(this.config.scheduleId).then(res => {
        console.log(res, 'res')
        res.data.scheduleHeadteacherVoList && res.data.scheduleHeadteacherVoList.map(v => {
          v.nickName = v.userName
        })
        this.form = {
          scheduleId: res.data.id,
          goodsId: this.config.goodsId || '',
          goodsName: res.data.goodsName || '',
          scheduleHeadteacher: res.data.scheduleHeadteacherVoList || [],
          sessionList: res.data.sessionList || [],
          scheduleNum: res.data.scheduleNum || '',
          scheduleStatus: res.data.scheduleStatus || '',
          capacity: res.data.capacity || '',
          deliveryAddress: res.data.deliveryAddress || '',
          lecturerNameList: res.data.lecturerNameList,
          deliveryTime: [filterDate(res.data.deliveryStartTime), filterDate(res.data.deliveryEndTime)],
          districtArr: res.data.districtName ? res.data.districtName.split('\t') : [],
          goodsNameList: res?.data?.goodsNameList || []
        }
        console.log(this.form, '获取班期详情')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    delNoNumber(e) {
      this.form.scheduleNum = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    }
  }
}
</script>

<style lang='scss' scoped>
.editSchedule {
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
    border: 1px dashed #DCDCDC;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      border-color: #409EFF;
    }
  }
}
.eltagBox{
  margin-right: 5px;
}
</style>
