<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-form-item v-if="isHead" label="部门">
        <el-cascader
          ref="cascader1"
          v-model="search.deptId"
          class="select"
          clearable
          :options="deptList"
          :props="{ checkStrictly: true, multiple: false, emitPath: false }"
          :show-all-levels="false"
          @change="deptChange"
        />
      </el-form-item>
      <el-form-item v-if="isHead" label="成员">
        <el-select
          v-model="search.userId"
          class="w-200"
          placeholder="请选择成员"
          filterable
          :filter-method="getUserByName"
          clearable
          @change="userChange"
        >
          <el-option
            v-for="item in userList"
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
      <el-form-item label="IP">
        <el-select
          v-model="search.teacherId"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          clearable
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
      <el-form-item label="文案内容">
        <el-input
          v-model.trim="search.plainText"
          class="w-200"
          placeholder="请输入文案内容"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.status"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          clearable
          @change="onSearch"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item"
            :value="index"
          >
            {{ item }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建日期">
        <el-date-picker
          v-model="search.time.value"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
      <el-button
        class="mb18"
        :loading="loading"
        type="primary"
        size="small"
        @click="onSearch"
      >
        查询
      </el-button>
      <el-button class="mb18" size="small" @click="onClear">重置</el-button>
      <el-row type="flex ">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="onhandleAdd"
        >
          创建视频
        </el-button>
        <el-button size="small" type="primary" @click="goBgImg">
          背景图管理
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getVideoTeacherList } from '@/api/aiVideoManage'
import { userNoPage, deptTree } from '@/api/addressBookApi'
import { status as statusList, materialTypes } from './columns'
import { getLoginInfo } from '@/api/videoManagement/accountManage'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          teacherId: '',
          videoName: '',
          time: {
            value: null
          }
        }
      }
    }
  },
  data() {
    return {
      statusList,
      materialTypes,
      teacherList: [],
      deptList: [],
      userList: [],
      loading: false,
      isHead: false
    }
  },
  created() {
    this.getDept()
    this.getTeacherList()
    this.getUserByName().then(async () => {
      const res = await getLoginInfo()
      this.isHead = res.data.role === 1
      if (this.isHead) {
        this.search.userId = this.$store.getters.userInfo.userId
      }
      this.$emit('onSearch')
    })
  },
  methods: {
    userChange() {
      this.onSearch()
    },
    deptChange(val) {
      this.$nextTick(() => {
        this.$refs.cascader1.dropDownVisible = false
      })
      this.search.userId = ''
      this.onSearch()
      this.getUserByName()
    },
    getUserByName(val) {
      return new Promise((resolve, reject) => {
        const params = {
          deptId: this.search.deptId,
          nickName: val
        }
        userNoPage(params)
          .then(res => {
            resolve()
            if (res.code === 1) {
              this.userList = res.data
            }
          })
          .catch(() => {
            reject()
          })
      })
    },
    async getDept() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptList = res.data[0].children
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
    async getTeacherList() {
      const res = await getVideoTeacherList({})
      this.teacherList = res.data
    },
    // 点击查询按钮
    onSearch() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
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
.mb18 {
  margin-bottom: 18px;
}
</style>
