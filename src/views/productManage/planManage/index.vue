<template>
  <div class="plan-container">
    <dynamicTable ref="table" v-model="tableData" immediate-check :columns="columns" :get-list-api="getList">
      <template #headerBtn>
        <el-button
          v-permission="['web:planManage:add', permsList]"
          type="primary"
          size="small"
          plain
          @click="openModel({ type: 'add' })"
        >新增计划</el-button>
      </template>
      <template #finalized="{ row }">
        <span :class="row.finalized ? 'success' : 'fail'">{{ row.finalized ? '已定版' : '未定版' }}</span>
      </template>
      <template #action="{ row }">
        <el-button
          v-permission="['web:planManage:edit', permsList]"
          type="text"
          :disabled="row.finalized"
          @click="openModel({ row, type: 'edit' })"
        >编辑</el-button>
        <el-button
          v-permission="['web:planManage:check', permsList]"
          type="text"
          @click="checkTeacherCase(row)"
        >查看选题</el-button>
        <el-dropdown
          v-if="permsList.includes('web:planManage:createLink') || permsList.includes('web:planManage:review') || permsList.includes('web:planManage:demonstration') || permsList.includes('web:planManage:download')"
          @command="(command) => handleCommand(command, row)"
        >
          <el-button type="text" style="margin-left: 10px">
            更多<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item v-permission="['web:planManage:createLink', permsList]" :disabled="row.finalized" command="a">生成链接</el-dropdown-item> -->
            <el-dropdown-item v-permission="['web:planManage:review', permsList]" :disabled="row.finalized" command="b">评审</el-dropdown-item>
            <el-dropdown-item v-permission="['web:planManage:demonstration', permsList]" command="c">演示</el-dropdown-item>
            <el-dropdown-item v-permission="['web:planManage:download', permsList]" command="d">下载</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </dynamicTable>
    <modal ref="modal" @close="handleClose" />
    <link-modal ref="linkModal" />
    <ppt-modal ref="pptModal" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { planQuery, planDetails, planProductCase } from '@/api/product/plan'
import modal from './components/modal'
import linkModal from './components/linkModal'
import pptModal from '@/views/productManage/caseManage/components/iframePPTModal'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'PlanManage',
  components: {
    dynamicTable,
    modal,
    linkModal,
    pptModal
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      domain: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.$refs.table.onRefresh()
  },
  methods: {
    getList(params) {
      return planQuery(params)
    },
    init() {
      const teacherName = this.$route.query?.teacherName
      if (teacherName) {
        this.columns.forEach((i) => {
          if (i.prop === 'teacherName') {
            i.formProps.defaultValue = teacherName
          }
        })
        this.$refs.table.onRefresh({
          pageIndex: 1,
          pageSize: 10,
          teacherName
        })
      } else {
        this.$refs.table.onRefresh()
      }
    },
    async openModel({ type, row }) {
      if (type === 'add') {
        this.$refs.modal?.open({ type })
      } else {
        const { data, code } = await planDetails({ planId: row.planId })
        if (code === 1) {
          this.$refs.modal?.open({ type, row: data })
        } else {
          this.$notify.warning('请求错误，请重试')
        }
      }
    },
    openLinkModel(row) {
      this.$refs.linkModal?.open(row)
    },
    handleClose() {
      this.$refs.table.onRefresh()
    },
    checkTeacherCase(row) {
      this.$router.push(`/caseManage/teacherList/${row.teacherId}?planId=${row.planId}&finalized=${row.finalized}`)
    },
    async getCaseList(row, type) {
      if (type === 'download') {
        const url = process.env.VUE_APP_BASE_API_NEW + '/cloud/product/plan/management/product/downloadWord?planId=' + row.planId
        axios({
          method: 'get',
          url: url,
          responseType: 'blob',
          headers: {
            Authorization: getToken()
          }

        })
          .then((res) => {
            console.log('sssssss:', res)
            if (res.data.size <= 0) {
              return
            }
            // 将lob对象转换为域名结合式的url
            const blobUrl = window.URL.createObjectURL(res.data)
            const link = document.createElement('a')
            document.body.appendChild(link)
            link.style.display = 'none'
            link.href = blobUrl
            // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
            link.download = row.planName + '.doc'
            // 自触发click事件
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
          })
          .catch((err) => {
            console.log(err, '下载失败')
          })
      }

      const pptList = []
      const items = await this.getPPTList({ row, pageIndex: 1, items: [] })
      const data = items.flat()
      data
        .filter((i) => i.productReviewStatus === 'RETAIN')
        .forEach((i) => {
          if (i.pptString) {
            let pptString = []
            try {
              pptString = JSON.parse(i.pptString)
            } catch (e) {
              pptString = []
            }
            pptString.forEach((j) => {
              pptList.push(j)
            })
          }
        })
      if (pptList.length === 0) {
        this.$message.error('无选题PPT可演示或下载！')
        return false
      }
      this.$refs.pptModal.open({ data: JSON.stringify(pptList), type: type })
    },
    async getPPTList({ row, pageIndex, items }) {
      const { data } = await planProductCase({
        planId: row.planId,
        pageSize: 100,
        pageIndex
      })
      items.push(data.items)
      if (row.totalCase > pageIndex * 100) {
        const index = pageIndex + 1
        await this.getPPTList({ row, pageIndex: index, items })
      }
      return items
    },

    handleCommand(command, row) {
      if (command === 'a') {
        this.openLinkModel(row)
        return
      }
      if (command === 'b') {
        if (row.totalCase === 0) {
          this.$notify.warning('该计划无选题，请添加相关选题，再进行评审！')
          return
        }
        const id = row.planId
        this.$router.push({
          name: 'caseManageReview',
          query: { id, isReview: true }
        })
        return
      }
      if (command === 'c') {
        if (row.totalCase === 0) {
          this.$notify.warning('该计划无选题，请添加相关选题，再进行演示！')
          return
        }
        this.getCaseList(row, 'review')
      }
      if (command === 'd') {
        this.getCaseList(row, 'download')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.plan-container {
  height: calc(100vh - 90px);
  .success {
    background: #e6f7ea;
    border-radius: 12px;
    color: #00b42a;
    padding: 3px 10px;
  }
  .fail {
    background: #feecec;
    border-radius: 12px;
    color: #f53f3f;
    padding: 3px 10px;
  }
}
</style>
