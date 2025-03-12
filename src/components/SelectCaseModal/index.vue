
<template>
  <el-dialog class="choose-ht" width="1000px" title="选择选题" :visible.sync="visible" top="100px" :append-to-body="appendToBody">
    <div class="dialog-body-container">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="适用IP">
          <teacherSelect
            ref="teacherSelect"
            v-model="form.suitableTeacherId"
            style="width:200px"
            @select="onSearch"
            @clear="onSearch"
            @keyup.enter.native="onSearch"
          />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-cascader v-model="form.deptIdListArray" style="width:200px" :options="deptTreeArray" :props="{ checkStrictly: true }" clearable @change="handleTreeData" />
        </el-form-item>
        <el-form-item label="选题关键词">
          <el-input v-model="form.keyword" style="width:200px" clearable placeholder="选题关键词" />
        </el-form-item>

        <el-form-item label="选题类别">
          <el-select v-model="form.type" style="width:200px" clearable placeholder="请选择选题类别">
            <el-option v-for="(item, index) in type" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="选题大小">
          <el-select v-model="form.size" style="width:200px" clearable placeholder="请选择选题大小">
            <el-option v-for="(item, index) in size" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属领域" prop="fieldId">
          <el-select v-model="form.fieldId" style="width:200px" clearable @change="onSearch">
            <el-option
              v-for="item in domainList"
              :key="item.domainId"
              :label="item.domainName"
              :value="item.domainId"
            />
          </el-select>
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
      <div class="content-block el-row">
        <div class="content-block-left">
          <el-card v-loading="checkboxLoading" shadow="hover" class="dialog-body-checkbox">
            <div class="title">
              <span class="f-span">选题标题</span>
              <span class="s-span">所属组织</span>
              <span class="t-span">创建人</span>
              <span class="four-span">创建时间</span>
            </div>
            <el-checkbox-group v-model="checkList" @change="handleChangeCheck">
              <SrcrollPane style="height: 380px" @load="addPage">
                <el-checkbox
                  v-for="item in items"
                  :key="item.id"
                  :label="JSON.stringify({ label: item.caseName, value: item.id, size: item.size })"
                  :disabled="item.disabled"
                >
                  <p class="p-scrollpane" @mouseenter.stop="handleClick(item)">{{ item.caseName }}</p>
                  <p class="s-p">{{ item.deptName?item.deptName:'---' }}</p>
                  <p class="t-p">{{ item.createBy?item.createBy:'---' }}</p>
                  <p class="f-p">{{ item.createTime?item.createTime:'---' }}</p>
                </el-checkbox>
              </SrcrollPane>
            </el-checkbox-group>
          </el-card>
          <div class="dialog-body-checkbox__tips">共{{ total }}条,已选{{ checkCaseList.length }}条</div>
        </div>
        <div class="content-block-right">
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
        </div>
      </div>
      <!-- <el-row :gutter="12">
        <el-col :span="16">
          <el-card v-loading="checkboxLoading" shadow="hover" class="dialog-body-checkbox">
            <div class="title">选题标题</div>
            <el-checkbox-group v-model="checkList" @change="handleChangeCheck">
              <SrcrollPane style="height: 380px" @load="addPage">
                <el-checkbox
                  v-for="item in items"
                  :key="item.id"
                  :label="JSON.stringify({ label: item.caseName, value: item.id, size: item.size })"
                  :disabled="item.disabled"
                >
                  <p class="p-scrollpane" @mouseenter.stop="handleClick(item)">{{ item.caseName }}</p>
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
        <el-col :span="7" :offset="1">
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
      </el-row>-->
      <div style="color:red;margin-top:25px; text-align: right; margin-top: 3px;">
        注意：即可以选择大选题也可以选择小选题，小选题最多可选200个，大选题最多可以选择50个，总数不超过250个。
      </div>
    </div>
    <div slot="footer" class="dialog-body-footer" style="margin-top: 20px;">
      <el-button type="primary" size="mini" @click="onSubmit">确 定</el-button>
      <el-button size="mini" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { caseList } from '@/api/product/case'
import { type, size } from '@/utils/enum'
import SrcrollPane from './ScrollPane'
import { deptTree } from '@/api/addressBookApi'
import { getDomainList } from '@/api/tearchCenter/index'
import teacherSelect from '@/views/teacherCenter/components/teacherSelect/index'
export default {
  name: 'SelectCaseModal',
  components: {
    SrcrollPane,
    teacherSelect
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      domainList: [],
      deptTreeArray: [],
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
        suitableTeacherId: '',
        beginTime: '',
        endTime: '',
        keyword: '',
        value: [],
        type: '',
        deptIdListArray: [],
        fieldId: ''
      },
      deptIdList: []
    }
  },
  created() {
    this.loadTreeData()
    this.initDomainList()
  },
  methods: {
    handleTreeData(val) {
      console.log('ssssssss:', val)
      const arr = this.getChildById(val[val.length - 1])
      console.log(',,,,,', arr)
      this.deptIdList = arr
      // this.form.deptIdList = this.getChildById(val)
      // this.form.deptIdList = arr
      console.log('88888888：', this.form.deptIdList)
      this.onSearch()
    },
    getChildById(val) {
      const ids = []
      const getIds = (arr) => {
        arr.forEach((i) => {
          ids.push({ label: i.label, value: i.value })
          if (i.children && i.children.length) {
            getIds(i.children)
          }
        })
      }
      const getDataIds = (id, arr) => {
        arr.forEach((i) => {
          if (id === i.value) {
            ids.push({ label: i.label, value: i.value })
            if (i.children && i.children.length) {
              getIds(i.children)
            }
          }
          if (i.children && i.children.length) {
            getDataIds(id, i.children)
          }
        })
      }
      getDataIds(val, this.deptTreeArray)
      return ids.map((i) => i.value)
    },
    async initDomainList() {
      const { code, data } = await getDomainList()
      if (code) {
        this.domainList = data
      }
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    open(checkCaseList = [], row = {}) {
      this.visible = true
      this.checkCaseList = checkCaseList
      this.items = []
      this.pageIndex = 1
      this.pageSize = 15
      this.checkList = checkCaseList.map((i) => {
        return JSON.stringify({ label: i.label, value: i.value, size: i.size })
      })
      if (row.teacherName) {
        this.$nextTick(() => {
          this.$refs.teacherSelect.setDefaultValue(row.teacherName)
          const that = this
          setTimeout(function() {
            that.getList()
          }, 500)
        })
      } else {
        this.getList()
      }
    },
    getDisabled(item) {
      if (!(this.checkCaseList && this.checkCaseList.length)) {
        return false
      }
      const littleList = this.checkCaseList.filter(i => +i.size === 1)
      const bigList = this.checkCaseList.filter(i => +i.size === 2)
      // 大案例不能超过10个 ，并小案例不能超过300个
      if (+item.size === 1) {
        if (littleList.length < 200) {
          return false
        }
      } else {
        if (bigList.length < 50) {
          return false
        }
      }
      return true
    },
    close() {
      this.visible = false
    },
    async getList() {
      const { data } = await caseList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.form,
        deptIdList: this.deptIdList

      })
      this.total = data.total
      this.items = this.items.concat(data.items)
      this.checkboxLoading = false
      this.isRefreshBool = true
      this.items.forEach((i) => {
        this.$set(i, 'disabled', this.getDisabled(i))
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
    handleChangeTime(value) {
      if (value === null) {
        this.form.beginTime = ''
        this.form.endTime = ''
        this.onSearch()
        return
      }
      this.form.beginTime = value[0]
      this.form.endTime = value[1]
      this.onSearch()
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
        suitableTeacherId: '',
        beginTime: '',
        endTime: '',
        keyword: '',
        value: [],
        type: '',
        fieldId: ''
      }
      this.deptIdList = []
      this.onSearch()
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
      this.current = {}
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
  height: 620px;
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
          height: 35px;
          line-height: 35px;
          padding-left: 15px;
          padding-right: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e7e7e7;
        }
      }
    }
    .dialog-body-checkbox__tips {
      margin-top: 5px;
      color: #777777;
      font-size: 14px;
    }
    .title {
      font-size: 16px;
      margin-bottom: 5px;
      padding: 6px;
      height: 36px;
      text-align: center;
      background: #f3f3f3;
      .f-span {
        float: left;
        width: 230px;
      }
      .s-span {
        float: left;
        width: 120px;
      }
      .t-span {
        float: left;
        width: 100px;
      }
      .four-span {
        float: left;
        width: 160px;
      }
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
  align-items: right;
  justify-content: right;
}
.p-scrollpane {
  height: 30px;
  line-height: 30px;
  width: 210px;
  padding-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
::v-deep .el-dialog__footer {
  padding-bottom: 18px;
}

.content-block {
  width: 100%;
  height: 440px;
  .content-block-left {
    float: left;
    width: 68%;
    height: 100%;
    ::v-deep .el-checkbox__input {
      float: left;
      margin-top: 8px;
    }
    ::v-deep .el-checkbox__label {
      float: left;
      width: 97%;
      font-weight: normal;
      p {
        float: left;
        line-height: 30px;
        color: #777;
      }
      .s-p {
        width: 100px;
        text-align: center;
      }
      .t-p {
        width: 100px;
        text-align: center;
      }
      .f-p {
        width: 160px;
        text-align: center;
      }
    }
  }
  .content-block-right {
    float: left;
    margin-left: 2%;
    width: 30%;
    height: 100%;
  }
}

.choose-ht {
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
  ::v-deep .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #E7E7E7;
  }
  ::v-deep .el-dialog__body {
    padding-bottom: 0px;
  }
}
</style>
