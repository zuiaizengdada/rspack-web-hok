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
            >开启后,所有非智能销售任务均按照兜底任务中外呼通知学员和发短信</span>
          </div>
        </el-form-item>
        <el-form-item label="欢迎语场景">
          <div class="text">场景一：一个订单只有同一个商品</div>
          <div class="cardBox">
            <div>
              <el-form-item label="AI外呼" prop="defaultTaskCallId">
                <m-select
                  v-model="form.defaultTaskCallId"
                  :dict-list="callList"
                  :param="{ value: 'id', label: 'name' }"
                  @change="handleDefaultTaskCallId"
                />
              </el-form-item>
              <el-form-item label="企微欢迎语" class="customTaskWelcomesRest">
                <div class="textBox">
                  <div>欢迎语：</div>
                  <span>一个订单单个商品，按拼接内容发送，内容包含商品名称，学习链接，资料链接，物流和发票等链接。</span>
                </div>
                <!-- <div class="textBox">
                        <div>链接：</div>
                        <span>当前商品的学习详情页</span>
                      </div> -->
                <welcomeMessageSettings
                  ref="defaultTaskWelcomes"
                  class="welBox"
                  :hide-title="true"
                  :is-add="false"
                  :type-tour="false"
                  :hide-content="true"
                  @change="getDefaultTaskWelcomes"
                />
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
              <el-form-item label="AI外呼" prop="customTaskCallId">
                <m-select
                  v-model="form.customTaskCallId"
                  :dict-list="callList"
                  :param="{ value: 'id', label: 'name' }"
                  @change="handleCustomTaskCallId"
                />
              </el-form-item>
              <el-form-item
                label="企微欢迎语"
                prop="customTaskWelcomes"
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
              <phoneMsg :data-list="form.customTaskWelcomes" />
            </div>
          </div>
          <el-form-item label="企微标签" prop="wxTagId">
            <!-- <m-select
                    v-model="form.wxTagId"
                    :dict-list="TagOptions"
                    :param="{ value: 'id', label: 'tagName' }"
                  /> -->
            <LabelInput
              v-model.trim="wxTagId"
              maxlength="10"
              @select="labelSelect"
            />
            <div v-if="form.wxTagId">
              <el-tag class="m-r-16" size="small">{{
                form.wxTagId.tagName
              }}</el-tag>
            </div>
          </el-form-item>
        </el-form-item>
        <el-checkbox v-model="form.lecturerTag">默认打上ip老师</el-checkbox>
      </el-form>
    </div>
    <div class="btnBox">
      <el-button size="mini" @click="handleClose">取消</el-button>
      <el-button type="primary" size="mini" @click="handleOk">确定</el-button>
    </div>
  </div>
</template>

<script>
const initCustomTaskWelcomesContent =
  '老板，您的眼光真不错，您购买的课程已经放到您的学习中心-已购课程中！您可以根据自己的实际情况，点击下方链接登录查看学习！【学习中心】点击链接：https://hokvv.cn/BDXfqy'
import { callList } from '@/api/privateArea/toolbox'
import phoneMsg from '../../CRM/components/phoneMsg'
import LabelInput from '../../CRM/components/AddTask/labelinput.vue'
import welcomeMessageSettings from '../../components/welcomeMessageSettings'
import {
  getDefaultTaskDetail,
  saveTaskDetail,
  getSaleTaskList
} from '@/api/privateArea/CRM'
export default {
  components: {
    welcomeMessageSettings,
    LabelInput,
    phoneMsg
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    TagOptions: [],
    wxTagId: '',
    callList: [],
    form: {
      wxTagId: '',
      customTaskWelcomes: []
    },
    rules: {
      isType: [{ required: true, message: '请选择开启状态', trigger: 'blur' }],
      defaultTaskCallId: [
        { required: true, message: '请选择外呼', trigger: 'blur' }
      ],
      customTaskCallId: [
        { required: true, message: '请选择外呼', trigger: 'blur' }
      ],
      defaultTaskWelcomes: [
        { required: true, message: '请设置欢迎语', trigger: 'blur' }
      ],
      wxTagId: [{ required: true, message: '请设置企微标签', trigger: 'blur' }]
    }
  }),
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
      const { data } = await callList({ callCompanyId: 5 })
      this.callList = data
    },
    // 详情
    async getDefaultTaskDetail() {
      this.form = {
        wxTagId: '',
        customTaskWelcomes: []
      }
      const { code, data } = await getDefaultTaskDetail()
      if (code === 1 && !data) {
        // 不存在数据，初始化数据
        this.$refs.customTaskWelcomes.form.content =
          initCustomTaskWelcomesContent
        this.form = {
          customTaskWelcomes: [
            {
              content: initCustomTaskWelcomesContent
            }
          ],
          lecturerTag: false
        }
        return
      }
      if (code === 1 && data) {
        // 存在数据
        // 初始化数据
        this.form = {
          ...data,
          wxTagId: data?.saleTagNameInfo || '',
          lecturerTag: !data?.lecturerTag || data?.lecturerTag === 2
        }
        const { defaultTaskWelcomes, customTaskWelcomes } = data
        if (defaultTaskWelcomes?.length) {
          const contentItem =
            defaultTaskWelcomes.find(item => item?.content) || {}
          this.$refs.defaultTaskWelcomes.form.content =
            contentItem?.content ?? initCustomTaskWelcomesContent

          this.$refs.defaultTaskWelcomes.items =
            defaultTaskWelcomes?.filter(i => i.type) ?? []
        }
        if (customTaskWelcomes?.length) {
          const contentItem =
            customTaskWelcomes.find(item => item?.content) || {}
          this.$refs.customTaskWelcomes.form.content =
            contentItem?.content ?? ''

          this.$refs.customTaskWelcomes.items =
            customTaskWelcomes?.filter(i => i.type) ?? []
        }
      }
    },
    async init() {
      this.getCallList()
      this.getList()
      this.getDefaultTaskDetail()
    },
    handleDefaultTaskCallId(value) {
      if (value) this.$refs.ruleForm.clearValidate('defaultTaskCallId')
    },
    handleCustomTaskCallId(value) {
      if (value) this.$refs.ruleForm.clearValidate('customTaskCallId')
    },
    async handleOk() {
      await this.$refs.ruleForm.validate()
      await this.$refs.customTaskWelcomes.validate()
      // 删除多余字段
      delete this.form.saleTagNameInfo
      if (this.form?.defaultTaskWelcomes?.length) {
        this.form.defaultTaskWelcomes.forEach(item => delete item.id)
      }
      if (this.form?.customTaskWelcomes?.length) {
        this.form.customTaskWelcomes.forEach(item => delete item.id)
      }

      // 上传字段
      const data = {
        ...this.form,
        lecturerTag: this.form.lecturerTag ? 2 : 1,
        wxTagId: this.form.wxTagId.tagId || this.form.wxTagId.id,
        defaultTaskWelcomes: []
      }
      const { code } = await saveTaskDetail(data)
      if (code === 1) {
        this.$message.success('保存成功!')
        this.handleClose()
      }
    },
    getTaskWelcomes(taskWelcomes) {
      this.form.taskWelcomes = taskWelcomes
    },
    getDefaultTaskWelcomes(taskWelcomes) {
      this.form.defaultTaskWelcomes = taskWelcomes
    },
    getCustomTaskWelcomes(taskWelcomes) {
      this.form.customTaskWelcomes = [...taskWelcomes]
    },
    handleClose() {
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .wxBox {
    width: 244px;
    height: 424px;
    background: url('../../../../assets/image/bgshell.png') no-repeat 100% 100%;
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
