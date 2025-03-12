<template>
  <el-drawer
    v-if="visible"
    title="任务详情"
    :visible.sync="visible"
    direction="rtl"
    :size="948"
    class="view-container"
  >
    <div class="drawer-container">
      <el-form
        ref="ruleForm"
        :model="form"
        label-width="120px"
      >
        <el-form-item label="任务名称：" prop="name">
          {{ form.name }}
        </el-form-item>
        <el-form-item label="公众号消息：" prop="secret">
          <div>
            <div>{{ form.title }}</div>
            <div v-for="item in items" :key="item.text">
              {{ item.text }} {{ item.value }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="跳转方式：" prop="isSkip">
          {{ isSkip[form.isSkip] }}
        </el-form-item>
        <el-form-item v-if="form.isSkip === 1" label="跳转链接：" prop="skipUrl">
          {{ form.skipUrl }}
        </el-form-item>
        <el-form-item label="接收对象：" prop="taskObject">
          全量粉丝
        </el-form-item>
        <el-form-item label="计划开始时间：" prop="planStartTime">
          {{ form.planStartTime }}
        </el-form-item>
        <el-form-item label="发送频次：" prop="frequency">
          {{ frequency[form.frequency] }}
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button
          type="primary"
          size="mini"
          @click="handleClose"
        >确定</el-button>
        <el-button
          size="mini"
          @click="handleClose"
        >取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { groupDetail } from '@/api/privateArea/toolbox'
export default {
  data() {
    return {
      frequency: {
        1: '5秒1条',
        2: '10秒1条',
        3: '15秒1条',
        4: '20秒1条',
        5: '30秒1条',
        6: '1分钟1条',
        7: '5分钟1条'
      },
      visible: false,
      form: {
        name: '',
        isSkip: 0,
        taskObject: 1,
        planStartTime: '',
        frequency: '',
        isStart: 0,
        templateId: '',
        id: '',
        title: '',
        skipUrl: ''
      },
      items: [],
      isSkip: {
        0: '不跳转',
        1: '链接地址'
      }
    }
  },
  methods: {
    open(row) {
      this.visible = true
      this.getGroupDetail(row)
    },
    async getGroupDetail({ id }) {
      const { data } = await groupDetail({ id })
      this.form = data
      if (data.isStart === 1) {
        this.form.planStartTime = '立即开始'
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
    getTemplate(current = {}) {
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
    },
    handleSelect() {
      this.$refs.selectTemplateDialog.open()
    },
    handleClose() {
      this.visible = false
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
        .drawer-footer{
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
}

</style>
