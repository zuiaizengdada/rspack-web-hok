
<template>
  <el-dialog width="1000px" title="选择选题" :visible.sync="visible" :append-to-body="appendToBody">
    <div class="dialog-body-container">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="所属计划">
          <el-select v-model="form.planId" style="width: 188px" placeholder="请选择所属计划">
            <el-option v-for="item in planArray" :key="item.planId" :label="item.planName" :value="item.planId" />
          </el-select>
        </el-form-item>
        <el-form-item label="选题关键词">
          <el-input v-model="form.keyword" placeholder="选题关键词" />
          <el-input v-model="form.teacherId" style="display: none" placeholder="选题关键词" />
        </el-form-item>
        <el-form-item label="选题标题">
          <el-input v-model="form.caseName" placeholder="选题标题" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="form.value"
            style="width: 288px"
            type="daterange"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleChangeTime"
          />
        </el-form-item>
        <span>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </span>
      </el-form>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card v-loading="checkboxLoading" shadow="hover" class="dialog-body-checkbox">
            <div class="title">选题标题</div>
            <el-checkbox-group v-model="checkList" @change="handleChangeCheck">
              <SrcrollPane style="height: 380px" @load="addPage">
                <el-checkbox
                  v-for="item in items"
                  :key="item.planCaseId"
                  :label="JSON.stringify({ label: item.caseName, value: item.planCaseId, size: item.size })"
                  :disabled="item.disabled"
                >
                  <p class="p-scrollpane" @mouseenter="hoverClick(item)">{{ item.caseName }}</p>
                </el-checkbox>
              </SrcrollPane>
            </el-checkbox-group>
          </el-card>
          <div class="dialog-body-checkbox__tips">共{{ total }}条,已选{{ checkCaseList.length }}条</div>
        </el-col>
        <el-col :span="10">
          <el-card shadow="hover" class="dialog-body-content">
            <div class="title">内容详情</div>
            <el-scrollbar style="height: 392px">
              <div class="content">
                <el-image
                  v-for="item in current.contents"
                  :key="item"
                  style="width: 320px; height: 180px"
                  :src="item+'?x-oss-process=image/resize,w_320,h_180'"
                  :preview-src-list="[item]"
                />
              </div>
            </el-scrollbar>
          </el-card>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-card shadow="hover" class="dialog-body-checkbox">
            <div class="title">已选择的选题标题</div>
            <el-scrollbar style="height: 392px">
              <div class="checkbox-list">
                <div v-for="item in checkCaseList" :key="item.value" class="checkbox-item">
                  <span class="checkbox-label">{{ item.label }}</span>
                  <i class="el-icon-close" @click="closeCheck(item)" />
                </div>
              </div>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-body-footer">
      <el-button type="primary" @click="onSubmit">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { type, size } from '@/utils/enum'
import SrcrollPane from './ScrollPane'
import { getTeacherData } from '@/utils/getApiData'
import { planCaseScreen, planTeacherDropdown } from '@/api/product/plan'
import { DateFormat } from '@/utils/index'
export default {
  name: 'SelectCaseModal',
  components: {
    SrcrollPane
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type,
      size,
      visible: false,
      checkList: [],
      checkCaseList: [],
      items: [],
      teacherList: [],
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      isRefreshBool: true,
      checkboxLoading: false,
      current: {},
      form: {
        teacherId: '',
        planId: '',
        beginTime: '',
        endTime: '',
        keyword: '',
        value: [],
        caseName: '',
        type: '',
        size: 2
      },
      tearcherIdFromInsert: '',
      planArray: []
    }
  },
  methods: {
    open(checkCaseList = [], teacherId) {
      this.visible = true
      this.checkCaseList = checkCaseList
      this.items = []
      this.pageIndex = 1
      this.pageSize = 15
      this.checkList = checkCaseList.map((i) => {
        return JSON.stringify({ label: i.label, value: i.value, size: 2 })
      })
      console.log('$$$$$$$$$$$$: ', this.checkList)
      this.loadManagePlan(teacherId)
      this.form.teacherId = teacherId
      this.tearcherIdFromInsert = teacherId
      this.getList()
      this.getOptions()
    },
    async getOptions() {
      this.teacherList = await getTeacherData()
    },
    getDisabled(item) {
      if (!(this.checkCaseList && this.checkCaseList.length)) {
        return false
      }
      if (this.checkCaseList.length < 10) {
        return false
      }
      return true
    },
    close() {
      this.visible = false
    },
    async getList() {
      if (this.form.beginTime) {
        this.form.beginTime = DateFormat(new Date(this.form.beginTime), 'yyyy-MM-dd')
        this.form.endTime = DateFormat(new Date(this.form.endTime), 'yyyy-MM-dd')
      }

      const { data } = await planCaseScreen({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.form
      })
      this.current = {}
      this.total = data.total
      this.items = this.items.concat(data.items)
      this.checkboxLoading = false
      this.isRefreshBool = true
      this.items.forEach((i) => {
        this.$set(i, 'disabled', this.getDisabled(i))
      })
    },
    loadManagePlan(teacherId) {
      const param = {
        teacherId: teacherId
      }
      planTeacherDropdown(param).then((res) => {
        if (res.success) {
          this.planArray = res.data.items
        }
      })
    },
    addPage() {
      this.checkboxLoading = true
      if (this.items.length < this.total && this.isRefreshBool) {
        this.isRefreshBool = false
        this.pageIndex += 1
        this.getList()
      } else {
        this.checkboxLoading = false
      }
    },
    hoverClick(item) {
      this.current = item
    },
    handleChangeTime(value) {
      if (!value.length) {
        this.form.beginTime = undefined
        this.form.endTime = undefined
        return
      }
      this.form.beginTime = value[0]
      this.form.endTime = value[1]
    },
    handleClick(item) {
      this.current = item
    },
    onSubmit() {
      this.$emit('submit', this.checkCaseList)
      this.visible = false
    },
    resetForm() {
      this.form = {
        teacherId: this.tearcherIdFromInser,
        planId: '',
        beginTime: '',
        endTime: '',
        keyword: '',
        value: [],
        caseName: '',
        type: '',
        size: 2
      }
    },
    closeCheck(item) {
      this.checkCaseList = this.checkCaseList.filter((i) => i.value !== item.value)
      this.checkList = this.checkCaseList.map((i) => {
        return JSON.stringify({
          label: i.label,
          value: i.value,
          size: i.size
        })
      })
      this.items.forEach((i) => {
        this.$set(i, 'disabled', this.getDisabled(i))
      })
    },
    onSearch() {
      this.pageIndex = 1
      this.items = []
      this.form.teacherId = this.tearcherIdFromInsert
      this.getList()
    },
    handleChangeCheck(val) {
      this.checkCaseList = val.map((i) => {
        return JSON.parse(i)
      })
      this.items.forEach((i) => {
        this.$set(i, 'disabled', this.getDisabled(i))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-body-container ::v-deep {
  height: 600px;
  display: flex;
  flex-direction: column;
  .el-form-item {
    margin-right: 20px;
  }
  .el-card__body {
    padding: 0;
  }
  .el-row {
    flex: 1;
    .dialog-body-checkbox {
      height: 100%;
      ::v-deep .el-checkbox__label {
        position: relative;
      }
      .el-checkbox-group {
        margin: 0;
        padding: 6px 0;
        list-style: none;
        box-sizing: border-box;
        .el-checkbox {
          height: 30px;
          line-height: 30px;
          padding-left: 15px;
          display: block !important;
        }
      }
      .checkbox-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 6px 0;
        list-style: none;
        box-sizing: border-box;
        i {
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
        .checkbox-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .checkbox-item {
          height: 30px;
          line-height: 30px;
          padding-left: 15px;
          padding-right: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .dialog-body-checkbox__tips {
      margin-top: 15px;
      color: #777777;
      font-size: 14px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
      padding: 6px;
      text-align: center;
      background: #f3f3f3;
    }
    .dialog-body-content {
      height: 100%;
      .content {
        box-sizing: border-box;
        margin: 0;
        padding: 5px 8px 5px 0;
        text-align: center;
        color: #333;
        font-size: 14px;
      }
    }
  }
}
.dialog-body-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-scrollpane {
  height: 30px;
  line-height: 30px;
  width: 190px;
  padding-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
  top: 0px;
}
</style>
