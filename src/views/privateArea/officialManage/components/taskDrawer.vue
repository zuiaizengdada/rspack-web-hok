<template>
  <el-drawer
    :title="title"
    :visible.sync="visible"
    direction="rtl"
    :size="948"
    class="view-container"
  >
    <div class="drawer-container">
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="任务名称：" prop="name">
          <el-input
            v-model="form.name"
            maxlength="100"
            show-word-limit
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="公众号消息：" prop="templateId">
          <div class="drawer-tips">
            <el-button
              type="primary"
              size="mini"
              @click="handleSelect"
            >选择模板</el-button>
            <span class="tips">微信已对消息模版更新，不允许first和remark自定义内容，此2项不需填写</span>
          </div>
          <template v-if="templateCurrent.content">
            <div class="drawer-text">
              <div class="drawer-row">
                <span>模版标题：</span>
                <span class="value">{{ templateCurrent.title }}</span>
              </div>
              <div class="drawer-row">
                <span>模版内容：</span>
                <span class="value">{{ templateCurrent.content }}</span>
              </div>
            </div>
            <div class="drawer-content">
              <div class="drawer-left">
                <AppTitle title="填写内容" />
                <div
                  v-for="item in items"
                  :key="item.label"
                  class="drawer-left-row"
                >
                  <div class="row-title">{{ item.label }}</div>
                  <messageType
                    v-model="item.value"
                    :label="item.label"
                  />
                </div>
              </div>
              <div class="drawer-right">
                <AppTitle title="预览效果" />
                <div class="drawer-right-content">
                  <div class="drawer-right-content__value">
                    <div>{{ templateCurrent.title }}</div>
                    <div v-for="item in items" :key="item.text">
                      {{ item.text }} {{ item.value }}
                    </div>
                  </div>
                  <div class="drawer-right-btn">查看详情</div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="跳转方式：" prop="isSkip">
          <el-select
            v-model="form.isSkip"
            placeholder="请选择"
            @change="hanldeChange"
          >
            <el-option label="不跳转" :value="0" />
            <el-option label="链接地址" :value="1" />
          </el-select>
          <el-input
            v-if="form.isSkip === 1"
            v-model="form.skipUrl"
            style="width:245px;margin-left:15px"
            placeholder="请输入链接"
          />
        </el-form-item>
        <el-form-item label="接收对象：" prop="taskObject">
          <el-radio v-model="form.taskObject" :label="1">
            <span class="from-title">全量粉丝(粉丝量：{{ fansTotal }})</span>
            <span class="tips"> 只在8:00到晚上23点之间发送，每个账号单天最多发10万条</span>
          </el-radio>
        </el-form-item>
        <el-form-item label="计划开始时间：" prop="isStart">
          <div>
            <el-radio v-model="form.isStart" :label="0">固定时间</el-radio>
            <el-date-picker
              v-show="form.isStart === 0"
              v-model="form.planStartTime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              size="mini"
              :picker-options="pickerOptions"
              type="datetime"
              placeholder="选择日期时间"
            />
          </div>
          <div>
            <el-radio v-model="form.isStart" :label="1">立即开始</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="发送频次：" prop="frequency">
          <el-select
            v-model="form.frequency"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button
          type="primary"
          size="mini"
          @click="handleSave"
        >确定</el-button>
        <el-button
          size="mini"
          @click="handleClose"
        >取消</el-button>
      </div>
    </div>
    <selectTemplateDialog ref="selectTemplateDialog" @select="getTemplate" />
  </el-drawer>
</template>

<script>
import AppTitle from './AppTitle'
import selectTemplateDialog from './selectTemplateDialog'
import messageType from './messageType'
import { getTotal, groupCreate, groupDetail, groupUpdate } from '@/api/privateArea/toolbox'
import moment from 'moment'
export default {
  components: {
    AppTitle,
    selectTemplateDialog,
    messageType
  },
  data() {
    return {
      options: [
        { label: '5秒1条', value: 1 },
        { label: '10秒1条', value: 2 },
        { label: '15秒1条', value: 3 },
        { label: '20秒1条', value: 4 },
        { label: '30秒1条', value: 5 },
        { label: '1分钟1条', value: 6 },
        { label: '5分钟1条', value: 7 }
      ],
      pickerOptions: {
        disabledDate: (time) => {
          return moment().isAfter(moment(time), 'day')
        }
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          }
        ],
        templateId: [
          {
            required: true,
            message: '请选择模板'
          }
        ],
        taskObject: [
          {
            required: true,
            message: '请选择接收对象',
            trigger: 'change'
          }
        ],
        isStart: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        frequency: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ]
      },
      visible: false,
      items: [],
      form: {
        name: '',
        isSkip: 0,
        taskObject: 1,
        planStartTime: '',
        frequency: '',
        isStart: 0,
        templateId: '',
        id: '',
        skipUrl: ''
      },
      templateCurrent: {
        example: '',
        content: '',
        templateId: '',
        title: ''
      },
      fansTotal: 0,
      type: 'add',
      title: '新增任务'
    }
  },
  methods: {
    open(data) {
      this.init()
      this.visible = true
      this.type = data.type
      if (this.type === 'edit') {
        this.title = '编辑任务'
        this.getGroupDetail(data)
      }
    },
    hanldeChange() {
      if (this.form.isSkip !== 1) {
        this.form.skipUrl = ''
      }
    },
    async getGroupDetail({ id }) {
      const { data } = await groupDetail({ id })

      this.form = data
      if (data.isStart === null) {
        this.form.isStart = 0
      }
      const len = data?.content?.length ?? 0
      const content = data?.content?.slice(1, len - 1).replace(/\s*/g, '') ?? ''
      const contentList = content?.split(',')?.map(i => {
        const arr = i?.split(':') ?? []
        const reg = new RegExp('"', 'g')
        const value = arr[1]?.replace(reg, '') ?? ''
        return {
          label: arr[0] ?? '',
          value
        }
      })
      const params = {
        content: data.example,
        id: data.templateId,
        title: data.title
      }
      this.getTemplate(params)
      this.items.forEach(i => {
        contentList.forEach(j => {
          if (i.label === j.label || j.label.indexOf(i.label) !== -1) {
            i.value = j.value
          }
        })
      })
    },
    handleSelect() {
      this.$refs.selectTemplateDialog.open()
    },
    async init() {
      const id = this.$route.query.id
      this.form = {
        name: '',
        isSkip: 0,
        taskObject: 1,
        planStartTime: '',
        frequency: '',
        isStart: 0,
        templateId: '',
        id: '',
        skipUrl: ''
      }
      this.templateCurrent = {
        example: '',
        content: '',
        templateId: '',
        title: ''
      }
      this.type = 'add'
      const { data } = await getTotal({ id })
      this.fansTotal = data
    },
    handleClose() {
      this.visible = false
    },
    validateData() {
      const params = JSON.parse(JSON.stringify(this.form))
      const filterItems = this.items.filter(i => i.value)
      if (filterItems.length !== this.items.length) {
        this.$message.error('模板内容不能为空')
        return
      }
      if (params.isStart === 0 && !params.planStartTime) {
        this.$message.error('计划开始时间不能为空')
        return
      }
      const isAfterNow = new Date(params.planStartTime).getTime() < Date.now()
      if (params.isStart === 0 && params.planStartTime && isAfterNow) {
        this.$message.error('计划开始时间不能小于等于此刻时间')
        return
      }
      if (params.isStart === 1) {
        params.planStartTime = undefined
      }
      if (params.isStart === 0) {
        params.isStart = undefined
      }
      params.content = {}
      this.items.forEach(i => {
        params.content[i.label] = i.value
      })
      if (this.type === 'add') {
        params.id = this.$route.query.id
      } else {
        params.id = this.form.id
      }
      return params
    },
    async add() {
      const params = this.validateData()
      if (!params) return
      const { code } = await groupCreate(params)
      if (code === 1) {
        this.$message.success('新增成功')
        this.visible = false
        this.$emit('success')
      }
    },
    async edit() {
      const params = this.validateData()
      if (!params) return
      const { code } = await groupUpdate(params)
      if (code === 1) {
        this.$message.success('修改成功')
        this.visible = false
        this.$emit('success')
      }
    },
    handleSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
          }
        }
      })
    },
    getTemplate(current = {}) {
      this.templateCurrent = current
      this.form.templateId = current.id
      this.items =
      current.content
        ?.split('\n')
        .filter(i => !['{{first.DATA}}', '{{remark.DATA}}'].includes(i))
        .map(i => {
          const strList = i.split('：')
          const len = strList[1].length
          const label = strList[1]?.slice(2, len - 2) ?? ''
          return {
            label,
            value: '',
            text: strList[0] + '：'
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.view-container ::v-deep{
    .el-drawer__header{
        padding-bottom: 20px;
        margin-bottom: 0px;
    }
    .drawer-container{
        padding: 20px 40px 0 20px;
        border-top:1px solid #E7E7E7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        .drawer-tips{
            height: 32px;
            display: flex;
            .tips{
                color: #999999;
                font-size: 14px;
                margin-left:8px
            }
        }
        .drawer-text{
            height: 84px;
            background: #F5F9FF;
            border-radius: 6px;
            font-size: 14px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 12px 0;
            .drawer-row{
                display: flex;
                align-items: center;
                color: #777777;
                height: 24px;
                .value{
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #333333;
                }
            }
        }
        .drawer-content{
            border: 1px solid #F5F5F5;
            height: 282px;
            border-radius: 6px;
            display: flex;
            .drawer-left{
                width: 434px;
                padding: 16px;
                .drawer-left-row{
                    display: flex;
                    margin-bottom: 12px;
                    .row-title{
                        flex: 1;
                        margin-right: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .drawer-right{
                background: #F5F5F5;
                padding: 16px;
                display: flex;
                flex: 1;
                flex-direction: column;
                .drawer-right-content{
                    width: 300px;
                    display: flex;
                    flex-direction: column;
                    padding: 16px;
                    border-radius: 8px;
                    background: #FFFFFF;
                    font-size: 14px;
                    color: #333333;
                    .drawer-right-content__value{
                        height: 140px;
                        line-height: 20px;
                        div{
                          word-break: break-all;
                        }
                    }
                    .drawer-right-btn{
                        padding-top: 10px;
                        border-top: 1px solid #E1E6ED;
                    }
                }
            }
        }
        .drawer-footer{
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
}

</style>
