<template>
  <div class="BasicInfo">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="overflowOuto ruleForm"
    >
      <el-form-item label="任务名称：" prop="taskName">
        <el-input
          v-model="ruleForm.taskName"
          maxlength="50"
          placeholder="请输入任务名称"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="标签：" prop="tags">
        <LabelInput
          v-model.trim="labelInput"
          maxlength="10"
          :disabled="ruleForm.tags.length >= 5"
          @input="delNoNumber"
          @select="labelSelect"
        />
        <div class="textContent m-b-16" style="margin-top: 12px">
          单个标签不能超过10个字且最多新增5个标签！此处标签，当客户添加了员工企微，同步给客户企微打上对应标签
        </div>
        <div v-if="ruleForm.tags.length > 0" class="tags">
          <el-tag
            v-for="(item, index) in ruleForm.tags"
            :key="index"
            class="m-r-16"
            size="small"
            closable
            @close="delLabel(item, index)"
          >{{ item.tagName }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="数据来源：" prop="dataType">
        <el-radio-group
          v-model="ruleForm.dataType"
          :disabled="!!taskcopyId"
          @change="onhandleDataTypeChange"
        >
          <el-radio :label="1">订单</el-radio>
          <el-radio :label="4">信息流表单</el-radio>
          <el-radio :label="2">线下表格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.dataType === 1"
        label="订单课程："
        prop="courseType"
      >
        <el-radio-group v-model="ruleForm.courseType" :disabled="!!taskcopyId">
          <el-radio :label="1">直播课</el-radio>
          <el-radio :label="0">录播课</el-radio>
        </el-radio-group>
        <span style="margin-left: 5px">保存后不允许编辑</span>
      </el-form-item>
      <el-form-item label="优先级：" prop="priority">
        <m-select
          v-model="ruleForm.priority"
          style="max-width: 200px"
          dict-key="PRIORITY_STATUS"
        />
        <span> 同时满足任务的线索，优先进入优先级高的任务</span>
      </el-form-item>
      <el-form-item label="任务时间：" prop="time" class="myTime">
        <el-radio-group v-model="ruleForm.ad">
          <el-radio
            v-if="[1, 4].includes(ruleForm.dataType)"
            :label="1"
            class="myElRadio"
            style="margin-bottom: 16px; width: 570px; height: 60px"
          >
            特定时间
            <el-date-picker
              v-model="ruleForm.time"
              class="m-l-8"
              style="width: 400px"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              type="datetimerange"
              :picker-options="pickerOptions"
            />
            <div class="myElRadiotextContent m-t-10">
              选择的时间为分配时间内的订单数据
            </div>
          </el-radio>
          <el-radio v-if="[2].includes(ruleForm.dataType)" :label="2">
            立即执行
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务目的：" prop="taskObjective">
        <el-select v-model="ruleForm.taskObjective" placeholder="请选择">
          <el-option
            v-for="item in taskObjectiveOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="企微备注："
        prop="iboxFriendRemarks"
        class="formItem"
        :class="{ 'is-required': ruleForm.taskObjective === 1 }"
      >
        <div class="formText">
          （
          <span>注：</span>可通过<span>拖拽</span>修改备注名的显示顺序，单个好友备注名最长不能超过20字
          ）
        </div>
        <draggable
          :list="iboxFriendRemarks"
          tag="div"
          draggable=".draggle"
          v-bind="{
            animation: 500,
            handle: '.draggle'
          }"
          :move="handleMove"
        >
          <div
            v-for="(item, index) in iboxFriendRemarks"
            :key="index"
            class="draggle"
          >
            <el-form-item v-if="item.friendRemarkType !== 3">
              <div class="itemFlex">
                <el-checkbox
                  v-model="item.isTick"
                  :label="friendRemarkLabel[item.friendRemarkType]"
                />
                <div>
                  最长
                  <el-input-number
                    v-model="item.length"
                    size="mini"
                    :controls="false"
                    :max="20"
                    :min="0"
                  />
                  字
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="item.friendRemarkType === 3">
              <div class="itemFlex">
                <el-checkbox v-model="item.isTick" label="客户手机号" />
                <div class="minW">最长11个字</div>
              </div>
            </el-form-item>
          </div>
        </draggable>
      </el-form-item>
      <el-form-item label="欢迎语：" prop="taskWelcomes">
        <el-radio-group
          v-model="ruleForm.ruleType"
          :disabled="[2, 4].includes(ruleForm.dataType)"
          @change="handleRuleForm"
        >
          <el-radio :label="1">默认规则</el-radio>
          <el-radio :label="2">自定义规则</el-radio>
        </el-radio-group>
        <div v-show="ruleForm.ruleType === 1" class="cardBox">
          <div>
            <div class="wxTitle">
              <div class="titleText">场景类型</div>
            </div>
            <div class="textOne">场景一：</div>
            <div class="textTwo">
              一个订单单个商品，按拼接内容发送，内容包含商品名称，学习链接，资料链接，物流和发票等链接。
            </div>
            <div class="textOne">场景二：</div>
            <div class="textTwo">一个订单多个商品</div>
            <welcomeMessageSettings
              ref="welcomeDefaultMessageSettings"
              class="welBox"
              :hide-title="true"
              :is-add="false"
              @handleFocus="btnActive = 1"
              @change="getTaskWelcomes"
            />
          </div>
          <div>
            <div class="wxTitle">
              <div class="titleText">微信预览效果</div>
              <div class="btnBox">
                <div
                  v-for="(item, index) in btnList"
                  :key="index"
                  :class="{ activeBtn: index === btnActive }"
                  @click="btnActive = index"
                >
                  {{ item }}
                </div>
              </div>
            </div>
            <phoneMsg :data-list="defaultDataList" />
          </div>
        </div>
        <div
          v-show="ruleForm.ruleType === 2"
          class="cardBox"
        >
          <welcomeMessageSettings
            ref="welcomeMessageSettings"
            :type-tour="false"
            class="welBox"
            :hide-title="true"
            @change="getTaskWelcomesTwo"
          />
          <div>
            <div class="wxTitle">
              <div class="titleText">微信预览效果</div>
            </div>
            <phoneMsg :data-list="customizeDataList" />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="drawer__footer">
      <el-button
        type="primary"
        size="small"
        @click="handleNextStep"
      >下一步</el-button>
    </div>
  </div>
</template>

<script>
import LabelInput from './labelinput.vue'
import { taskObjectiveOption } from '../../columns'
import Dialog from '@/components/Dialog/index'
import phoneMsg from '../phoneMsg'
import moment from 'moment'
import draggable from 'vuedraggable'
import welcomeMessageSettings from '../../../components/welcomeMessageSettings1'
const initCustomTaskWelcomesContent =
  '老板，您的眼光真不错，您购买的课程已经放到您的学习中心-已购课程中！您可以根据自己的实际情况，点击下方链接登录查看学习！【学习中心】点击链接：https://hokvv.cn/BDXfqy'
export default {
  name: 'BasicInfo',
  components: {
    LabelInput,
    welcomeMessageSettings,
    phoneMsg,
    draggable
  },
  props: {
    taskcopyId: {
      type: String,
      default: ''
    }
  },
  data() {
    var checkTime = (rule, value, callback) => {
      if (this.ruleForm.ad === 2) {
        return callback()
      } else {
        if (!this.ruleForm.time || !this.ruleForm.time[0]) {
          return callback('请选择时间')
        }
        if (this.ruleForm.time[0] < moment().format('YYYY-MM-DD HH:mm')) {
          return callback('选择时间需要大于当前时间')
        }
        return callback()
      }
    }
    var validateRemarks = (rule, value, callback) => {
      const item = this.iboxFriendRemarks.find(i => i.isTick && i.length)
      if (!item) {
        return callback('请至少勾选并填写一项企微备注')
      }
      return callback()
    }

    return {
      btnList: ['场景一', '场景二'],
      btnActive: 0,
      taskWelcomesRadio: 1,
      ruleForm: {
        taskName: '',
        dataType: 1,
        transformationPeriod: 8,
        tags: [],
        time: ['', ''],
        ruleType: 1,
        taskObjective: 1, // 任务目的
        taskWelcomes: [{ content: initCustomTaskWelcomesContent }],
        ad: 1,
        content: '',
        taskWelcomesTwo: '',
        courseType: 0
      },
      iboxFriendRemarks: [
        { friendRemarkType: 1, isTick: false, length: undefined },
        { friendRemarkType: 2, isTick: false, length: undefined },
        { friendRemarkType: 3, isTick: false, length: 11 },
        { friendRemarkType: 4, isTick: false, length: undefined }
      ],
      validateRemarks,
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        dataType: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        transformationPeriod: [
          { required: true, message: '请设置转化周期', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        tags: [
          {
            required: true,
            message: '请选择标签',
            trigger: 'change',
            type: 'array'
          }
        ],
        time: [{ required: true, validator: checkTime, trigger: 'change' }],
        taskObjective: [
          { required: true, message: '请选择任务目的', trigger: 'change' }
        ],
        courseType: [
          { required: true, message: '请选择订单课程', trigger: 'change' }
        ]
        // taskWelcomes: [
        //   { required: true, message: '请输入欢迎语或者添加附件', type: 'array' }
        // ]
      },
      labelInput: '',
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      friendRemarkLabel: {
        1: '来源IP老师',
        2: '微信昵称',
        4: '任务名称'
      }
    }
  },
  computed: {
    taskObjectiveOption() {
      if (this.ruleForm.dataType !== 2) {
        return taskObjectiveOption
      } else {
        return [...taskObjectiveOption, { label: '只分配线索', value: 2 }]
      }
    },
    defaultDataList() {
      if (this.btnActive === 0) {
        const taskWelcomes = this.ruleForm.taskWelcomes || []
        const newTaskWelcomes = taskWelcomes.filter(item => !item.content)
        const data = [
          {
            content: initCustomTaskWelcomesContent
          },
          ...(newTaskWelcomes || [])
        ]
        return data
      }
      return this.ruleForm.taskWelcomes || []
    },
    customizeDataList() {
      return this.ruleForm.taskWelcomesTwo || []
    }
  },
  watch: {
    'ruleForm.courseType': {
      handler(val) {
        this.$emit('courseTypeChange', val)
      },
      immediate: true
    }
  },
  created() {
    // 新增
    this.initSetData()
  },
  methods: {
    handleRuleForm() {
      this.$refs.welcomeDefaultMessageSettings.clearValidate('content')
      this.$refs.welcomeMessageSettings.clearValidate('content')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleMove() {
      return true
    },
    async initSetData() {
      await this.$nextTick()
      this.$refs.welcomeDefaultMessageSettings.form.content =
        this.ruleForm.taskWelcomes[0].content
    },
    setData(form) {
      this.$nextTick(() => {
        this.ruleForm = form
        this.iboxFriendRemarks = form.friendRemarks ?? [
          { friendRemarkType: 1, isTick: false, length: undefined },
          { friendRemarkType: 2, isTick: false, length: undefined },
          { friendRemarkType: 3, isTick: false, length: 11 },
          { friendRemarkType: 4, isTick: false, length: undefined }
        ]
        this.iboxFriendRemarks.forEach(i => {
          i.id = undefined
          i.taskId = form.id
        })
        console.log(this.iboxFriendRemarks, 'this.ruleForm.iboxFriendRemarks')

        if (this.ruleForm.ruleType === 1) {
          this.ruleForm.taskWelcomes = form.taskWelcomes
        } else {
          this.ruleForm.taskWelcomesTwo = form.taskWelcomes
        }
        const contentList = form?.taskWelcomes?.filter(i => i.content) ?? []
        let refName = 'welcomeMessageSettings'
        if (form.ruleType === 1) {
          refName = 'welcomeDefaultMessageSettings'
        }
        if (contentList.length) {
          this.$refs[refName].form.content =
            contentList[0]?.content ?? initCustomTaskWelcomesContent
        }
        this.$refs[refName].items =
          form?.taskWelcomes?.filter(i => i.type) ?? []
      })
    },
    delNoNumber() {},
    labelSelect(res) {
      this.labelInput = ''
      const index = this.ruleForm.tags.findIndex(v => v.id === res.id)
      if (index === -1) {
        this.ruleForm.tags.push(res)
        this.$refs.ruleForm.clearValidate('tags')
      }
      // index === -1 && this.$emit('addTags', res)
      // this.$refs.ruleForm && this.$refs.ruleForm.validateField('tags')
    },
    // 点击新增客服按钮
    addWeChatService() {
      Dialog.open({
        type: 'WeChatService',
        success: res => {
          console.log(res)
        }
      })
    },
    // 数据类型改变触发
    onhandleDataTypeChange(val) {
      if ([2, 4].includes(val)) {
        this.ruleForm.ruleType = 2
        this.ruleForm.ad = 2
      }
      this.ruleForm.taskObjective = 1
      this.ruleForm.dataType = val
      this.ruleForm.time = ['', '']
    },
    // 点击下一步
    handleNextStep() {
      this.$refs.ruleForm.validate(valid => {
        let refName = 'welcomeMessageSettings'
        if (this.ruleForm.ruleType === 1) {
          refName = 'welcomeDefaultMessageSettings'
        }
        this.$refs[refName].validate(valid1 => {
          if (valid && valid1) {
            if (!this.ruleForm.ad) {
              this.$message.error('请选择任务时间类型')
              return
            }
            if (this.ruleForm.taskObjective === 1) {
              const len = this.iboxFriendRemarks?.filter(
                item => item.isTick
              ).length
              if (!len) {
                return this.$message.error(`企微备注至少勾选一项！`)
              }
            }
            const iboxFriendRemarks = this.iboxFriendRemarks?.find(
              item => item.isTick && !item?.length
            )
            if (iboxFriendRemarks) {
              const map = {
                1: '来源IP老师',
                2: '微信昵称',
                3: '客户手机号',
                4: '任务名称'
              }
              return this.$message.error(
                `${map[iboxFriendRemarks.friendRemarkType]} 请设置备注字数！`
              )
            }
            const total = this.iboxFriendRemarks.reduce((a, b) => {
              return b.isTick ? a + b.length : a
            }, 0)
            if (total > 20) {
              return this.$message.warning('好友备注名总长度不能超过20！')
            }
            this.$emit('nextStep', {
              ...this.ruleForm,
              iboxFriendRemarks: this.iboxFriendRemarks
            })
          }
        })
      })
    },
    delLabel(item, index) {
      this.ruleForm.tags.splice(index, 1)
    },
    getTaskWelcomes(taskWelcomes) {
      this.ruleForm.taskWelcomes = taskWelcomes
    },
    getTaskWelcomesTwo(taskWelcomes) {
      this.ruleForm.taskWelcomesTwo = taskWelcomes
    },
    onhandleAdd() {
      const checkUser = this.ruleForm.sysUsers.reduce((pre, next) => {
        pre.push({
          userId: next.userId,
          userName: next.nickName,
          nickName: next.nickName
        })
        return pre
      }, [])
      this.$AddressBook({
        visible: true,
        multiple: true,
        minlength: 1,
        type: [1],
        checkUser: checkUser,
        success: res => {
          this.ruleForm.sysUsers = res.user
          this.$refs.ruleForm && this.$refs.ruleForm.validateField('sysUsers')
        }
      })
    },
    handleCheckValidate() {
      this.$refs.ruleForm.validateField('iboxFriendRemarks')
    }
  }
}
</script>
<style lang="scss" scoped>
.BasicInfo ::v-deep {
  .reply-right {
    padding: 0px;
  }
  .wxTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .titleText {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    padding-left: 9px;
    line-height: 1.5;
    border-left: 3px solid #0c6fff;
    // margin-bottom: 10px;
  }
  .textOne {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .textTwo {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .btnBox {
    display: flex;
    background: #f0f0f0;
    padding: 2px;
    border-radius: 4px;
    line-height: 1;
    > div:nth-of-type(1) {
      margin-right: 4px;
    }
    > div {
      font-size: 14px;
      font-weight: 400;
      padding: 3px;
      border-radius: 4px;
      line-height: 1.3;
      cursor: pointer;
    }
  }
  .activeBtn {
    background: #fff;
    color: #0c6fff;
  }
  .wxBox {
    width: 244px;
    height: 424px;
    background: url('../../../../../assets/image/bgshell.png') no-repeat 100%
      100%;
    background-size: 100% 100%;
  }
  height: 100%;
  display: flex;
  flex-direction: column;
  .ruleForm {
    flex: 1 0 0;
    padding: 0 20px;
  }
  .drawer__footer {
    border-top: 1px solid #e7e7e7;
    padding: 12px 21px;
    text-align: left;
  }
}
.formItem {
  position: relative;
  .formText {
    left: 280px;
    color: #999999;
    position: absolute;
    > span {
      color: rgb(245, 146, 146);
    }
  }
}
.itemFlex {
  display: flex;
  align-items: center;
  .minW {
    width: 116px;
  }
  > div:nth-last-of-type(1) {
    margin-left: 20px;
    color: #999999;
    > span {
      color: rgb(245, 146, 146);
    }
  }
  > label {
    width: 140px;
  }
  .el-input-number {
    width: 60px;
    margin: 0 5px;
  }
}
.textContent {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  margin-top: -10px;
}
.tags {
  margin-top: 16px;
  width: 528px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  padding: 18px 16px;
}
::v-deep {
  .myTime {
    label {
      height: 32px;
      line-height: 32px;
      color: #777777;
    }
  }
}
.myElRadio {
  line-height: 32px;
  // height: 32px;
  // width: 100%;
}
.cardBox {
  background: #fafafa;
  border-radius: 8px;
  display: flex;
  padding: 12px;
  > div:nth-of-type(1) {
    flex: 1;
    margin-right: 22px;
  }
}
.myElRadiotextContent {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  margin-left: 17px;
}
.weChatUserBox {
  margin-top: 16px;
  width: 527px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px dashed #979797;
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  .weChatUser {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #e6f4ff;
    border-radius: 4px;
    padding: 0 8px;
    color: #999999;
    margin-right: 16px;
    margin-bottom: 8px;
    margin-top: 8px;
    .userName {
      width: 66px;
      color: #333;
    }
  }
}
.labelDel {
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
</style>
