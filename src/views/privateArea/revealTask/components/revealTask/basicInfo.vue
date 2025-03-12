<template>
  <div class="warpBox">
    <div class="contentBox">
      <el-form
        ref="ruleForm"
        label-position="top"
        label-width="80px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="开启状态" prop="enabled">
          <div class="enabledBox">
            <el-switch
              v-model="form.enabled"
              :active-value="2"
              :inactive-value="1"
            />
            <span
              class="textContent"
            >开启后所有非智能销售任务订单类型线索均按此兜底设置分配线索,机构内兜底和外部兜底只能同时开启一个</span>
          </div>
        </el-form-item>
        <el-form-item label="欢迎语场景">
          <div class="text">场景一：一个订单只有同一个商品</div>
          <div class="cardBox">
            <div>
              <el-form-item label="企微欢迎语" class="customTaskWelcomesRest">
                <div class="textBox">
                  <div>欢迎语：</div>
                  <span>一个订单单个商品，按拼接内容发送，内容包含商品名称，学习链接，资料链接，物流和发票等链接。</span>
                </div>
              </el-form-item>
            </div>
            <div>
              <div class="wxTitle">微信预览效果</div>
              <phoneMsg :data-list="defaultDataList" />
            </div>
          </div>
          <div class="text">场景二：一个订单包含不同商品</div>
          <div class="cardBox">
            <div>
              <el-form-item
                label="企微欢迎语"
                prop="taskWelcomes"
                class="customTaskWelcomesRest"
              >
                <welcomeMessageSettings
                  ref="customTaskWelcomes"
                  class="welBox"
                  :is-add="false"
                  :type-tour="false"
                  :hide-title="true"
                  @change="getCustomTaskWelcomes"
                />
              </el-form-item>
            </div>
            <div>
              <div class="wxTitle">微信预览效果</div>
              <phoneMsg :data-list="form.taskWelcomes" />
            </div>
          </div>
          <el-form-item
            label="企微备注"
            prop="iboxFriendRemarks"
            class="formItem"
            :rules="[
              {
                required: true,
                validator: validateRemarks,
                trigger: 'blur'
              }
            ]"
          >
            <div class="formText">
              （
              <span>注：</span>可通过<span>拖拽</span>修改备注名的显示顺序，单个好友备注名最长不能超过20字
              ）
            </div>
            <div
              v-for="(item, index) in form.iboxFriendRemarks"
              :key="index"
              v-dragging="{
                item: item,
                list: form.iboxFriendRemarks,
                group: 'item'
              }"
            >
              <el-form-item v-if="item.friendRemarkType === 1">
                <div class="itemFlex">
                  <el-checkbox
                    v-model="item.isTick"
                    label="来源IP老师"
                    @change="handleCheckValidate"
                  />
                  <div>
                    最长
                    <el-input-number
                      v-model="item.length"
                      size="mini"
                      :controls="false"
                      :min="0"
                      @change="handleCheckValidate"
                    />
                    字
                  </div>
                </div>
              </el-form-item>
              <el-form-item v-if="item.friendRemarkType === 2">
                <div class="itemFlex">
                  <el-checkbox
                    v-model="item.isTick"
                    label="微信昵称"
                    @change="handleCheckValidate"
                  />
                  <div>
                    最长<el-input-number
                      v-model="item.length"
                      size="mini"
                      :controls="false"
                      :min="0"
                      @change="handleCheckValidate"
                    />
                    字
                  </div>
                </div>
              </el-form-item>
              <el-form-item v-if="item.friendRemarkType === 3">
                <div class="itemFlex">
                  <el-checkbox
                    v-model="item.isTick"
                    label="客户手机号"
                    @change="handleCheckValidate"
                  />
                  <div class="minW">最长11个字</div>
                </div>
              </el-form-item>
              <el-form-item v-if="item.friendRemarkType === 4">
                <div class="itemFlex">
                  <el-checkbox
                    v-model="item.isTick"
                    label="任务名称"
                    @change="handleCheckValidate"
                  />
                  <div>
                    最长<el-input-number
                      v-model="item.length"
                      size="mini"
                      :controls="false"
                      :min="0"
                      @change="handleCheckValidate"
                    />
                    字
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="企微标签" prop="tags">
            <setTagsList v-model="form.tags" />
          </el-form-item>
        </el-form-item>
        <el-checkbox
          v-model="form.lecturerTag"
          :true-label="2"
          :false-label="1"
        >默认打上ip老师</el-checkbox>
      </el-form>
    </div>
    <div class="btnBox">
      <el-button type="primary" size="mini" @click="handleOk">下一步</el-button>
    </div>
  </div>
</template>

<script>
const initCustomTaskWelcomesContent =
  '老板，您的眼光真不错，您购买的课程已经放到您的学习中心-已购课程中！您可以根据自己的实际情况，点击下方链接登录查看学习！【学习中心】点击链接：https://hokvv.cn/BDXfqy'
import { callList } from '@/api/privateArea/toolbox'
import phoneMsg from '../../../CRM/components/phoneMsg'
import setTagsList from '@/components/setTagsList'
import welcomeMessageSettings from '../../../components/welcomeMessageSettings'
import { getSaleTaskList } from '@/api/privateArea/CRM'
export default {
  components: {
    welcomeMessageSettings,
    setTagsList,
    phoneMsg
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        tags: []
      })
    }
  },
  data() {
    var validateRemarks = (rule, value, callback) => {
      const item = this.form.iboxFriendRemarks.find(i => i.isTick && i.length)
      if (!item) {
        return callback('请至少勾选并填写一项企微备注')
      }
      return callback()
    }
    return {
      TagOptions: [],
      wxTagId: '',
      callList: [],
      rules: {
        isType: [{ required: true, message: '请选择开启状态', trigger: 'blur' }],
        singleGoodsIdCallId: [
          { required: true, message: '请选择外呼', trigger: 'blur' }
        ],
        multiGoodsIdCallId: [
          { required: true, message: '请选择外呼', trigger: 'blur' }
        ],
        defaultTaskWelcomes: [
          { required: true, message: '请设置欢迎语', trigger: 'blur' }
        ],
        tags: [{ required: true, message: '请设置企微标签', trigger: 'blur' }]
      },
      validateRemarks
    }
  },
  computed: {
    defaultDataList() {
      const data = [
        {
          content: initCustomTaskWelcomesContent
        },
        ...(this.form.defaultTaskWelcomes || [])
      ]
      return data
    }
  },
  watch: {
    'form.taskWelcomes': {
      handler: function () {
        this.$nextTick(() => {
          this.$refs.customTaskWelcomes.form.content =
            this.form?.taskWelcomes[0]?.content || ''
        })
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    labelSelect(res) {
      this.wxTagId = ''
      this.form.wxTagId = res
      this.$refs.ruleForm.clearValidate('wxTagId')
    },
    getList() {
      const params = {
        pageIndex: 1,
        pageSize: 999999999,
        tagName: '',
        sync: true
      }
      getSaleTaskList(params).then(res => {
        this.TagOptions = res.data.items
      })
    },
    // 获取外呼
    async getCallList() {
      const { data } = await callList()
      this.callList = data
    },
    async init() {
      this.getCallList()
      this.getList()
    },
    handleDefaultTaskCallId(value) {
      if (value) this.$refs.ruleForm.clearValidate('singleGoodsIdCallId')
    },
    handleCustomTaskCallId(value) {
      if (value) this.$refs.ruleForm.clearValidate('multiGoodsIdCallId')
    },
    async handleOk() {
      await this.$refs.customTaskWelcomes.validate()
      await this.$refs.ruleForm.validate()
      this.$emit('update:form', this.form)
      this.$emit('handleStop', 2)
    },
    getTaskWelcomes(taskWelcomes) {
      this.form.taskWelcomes = taskWelcomes
    },
    getDefaultTaskWelcomes(taskWelcomes) {
      this.form.taskWelcomes = taskWelcomes
    },
    getCustomTaskWelcomes(taskWelcomes) {
      this.$set(this.form, 'taskWelcomes', [...taskWelcomes])
    },
    handleClose() {
      this.form = { wxTagId: {}, taskWelcomes: [] }
      this.$emit('update:visible', false)
    },
    handleCheckValidate() {
      this.$refs.ruleForm.validateField('iboxFriendRemarks')
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  width: 100%;
  height: calc(100vh - 105px);
  // overflow: scroll;
  display: flex;
  flex-direction: column;
  .wxBox {
    width: 244px;
    height: 424px;
    background: url('../../../../../assets/image/bgshell.png') no-repeat 100%
      100%;
    background-size: 100% 100%;
  }
  .text {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    // margin-top: -10px;
  }
  .wxTitle {
    text-align: center;
  }
  > .contentBox {
    flex: 1;
    padding: 0 20px;
    padding-bottom: 40px;
    overflow: scroll;
    .enabledBox {
      display: flex;
      align-items: center;
      .textContent {
        margin-left: 10px;
      }
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
  }
  > .btnBox {
    display: flex;
    padding: 17px 0;
    padding-right: 20px;
    border-top: 1px solid #e7e7e7;
    justify-content: flex-end;
  }
  .formItem {
    position: relative;
    margin-bottom: 20px;
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
  .welBox::v-deep {
    padding: 0;
    > .reply-right-btn {
      margin: 0 0 10px 0 !important;
    }
    .el-switch__label .is-active {
      color: #333333 !important;
    }
  }
  .textBox {
    line-height: 1.2;
    display: flex;
    margin-bottom: 10px;
    > div {
      color: #777777;
      width: 80px;
    }
  }
  .customTaskWelcomesRest {
    margin-top: 20px;
  }
}
</style>
