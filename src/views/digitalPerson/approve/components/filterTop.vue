<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      label-width="auto"
      size="small"
      :inline="true"
    >
      <el-form-item label="IP">
        <el-select
          v-model="search.teacherId"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          clearable
          @change="onSearch"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="item in teacherList"
            :key="item.teacherId"
            :label="item.teacherName"
            :value="item.teacherId"
          >
            {{ item.teacherName }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频名称">
        <el-input
          v-model.trim="search.videoName"
          class="w-200"
          placeholder="请输入视频名称"
          clearable
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="申请者">
        <el-select
          v-model="search.userId"
          class="w-200"
          placeholder="搜索申请者"
          filterable
          :filter-method="getUserByName"
          clearable
          @change="userChange"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          >
            <span style="float: left">{{ item.userName }}</span>
            <span
              v-if="item.userStatus === 1"
              style="float: right; color: #f53f3f; font-size: 13px"
            >
              已离职
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="status !== 4" label="审批者">
        <el-select
          v-model="search.approverId"
          class="w-200"
          placeholder="搜索审批者"
          filterable
          clearable
          @change="userChange"
        >
          <el-option
            v-for="item in userList2"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
            <span style="float: left">{{ item.nickName }}</span>
            <span
              v-if="item.status === 1"
              style="float: right; color: #f53f3f; font-size: 13px"
            >
              已离职
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker
          v-model="search.time.value"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 225px"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onSearch"
        />
      </el-form-item>
      <el-form-item label="素材类型">
        <el-select
          v-model="search.materialType"
          placeholder="请选择"
          class="w-200"
          clearable
          @change="onSearch"
        >
          <el-option
            v-for="(item, index) in materialTypes"
            :key="index"
            :label="item"
            :value="index"
          >
            {{ item }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文案关键词">
        <el-input
          v-model.trim="search.plainText"
          class="w-200"
          placeholder="请输入文案关键词"
          clearable
          maxlength="20"
        />
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" size="small" @click="onSearch">
            查询
          </el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
        <el-button
          v-if="isShowTabPane('aigc:approve:seting')"
          size="small"
          type="primary"
          @click="handleSeting"
        >
          数字人审批设置
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getVideoTeacherList, getApplicantList } from '@/api/aiVideoManage'
import { userNoPage } from '@/api/addressBookApi'
import { status as statusList, materialTypes } from './columns'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          teacherId: '',
          videoName: '',
          plainText: '',
          time: {
            value: null
          }
        }
      }
    },
    status: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      statusList,
      permsList: this.$route?.meta?.permsList || [],
      materialTypes,
      teacherList: [],
      deptList: [],
      userList: [],
      userList2: [],
      ignoreId: undefined
    }
  },
  created() {
    this.getTeacherList()
    this.loadUserNoPage()
    this.getUserByName()
  },
  methods: {
    isShowTabPane(value) {
      return this.permsList.includes(value)
    },
    loadUserNoPage(val) {
      const params = {
        deptId: '',
        nickName: val
      }
      userNoPage(params)
        .then(res => {
          this.userList2 = res.data
        })
        .catch(() => {})
    },
    handleSeting() {
      this.$router.push({
        path: '/digitalPerson/examineSeting'
      })
    },
    userChange() {
      this.onSearch()
    },
    async getUserByName(val) {
      const params = {
        videoStatus: this.status,
        userName: val
      }
      const res = await getApplicantList(params)
      if (res.code === 1) {
        this.userList = res.data
      }
    },
    async getTeacherList() {
      const res = await getVideoTeacherList({})
      this.teacherList = res.data
    },
    // 点击查询按钮
    onSearch() {
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.$emit('onAdd')
    },
    goBgImg() {
      this.$emit('goBgImg')
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  padding-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 20px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
