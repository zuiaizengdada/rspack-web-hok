<template>
  <div>
    <div class="search-box">
      <div class="search-main">
        <el-form ref="form" v-model="search" size="small" :inline="true">
          <el-form-item label="IP老师">
            <el-select
              v-model="search.teacherId"
              :filterable="true"
              placeholder="请选择"
              clearable
              @change="userChange"
            >
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
          <el-form-item v-if="!isBeCommon" label="员工">
            <el-select
              v-model="search.userId"
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
          <el-button class="mb18" type="primary" size="small" @click="onSearch">
            查询
          </el-button>
          <el-button class="mb18" size="small" @click="onClear">重置</el-button>
        </el-form>
        <el-row type="flex" justify="end" style="margin-top: 10px">
          <el-button
            class="mb18"
            type="primary"
            size="small"
            @click="onAdd"
          >新增</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getCharactersTeacherList } from '@/api/aiVideoManage'
import { userNoPage } from '@/api/addressBookApi'
export default {
  props: {
    isBeCommon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userList: [],
      teacherList: [],
      search: {
        teacherId: undefined,
        userId: undefined
      }
    }
  },
  created() {
    this.getTeacherList()
    this.getUserByName()
  },
  methods: {
    onAdd() {
      this.$emit('onAdd')
    },
    onSearch() {
      this.$emit('onSearch', { ...this.search })
    },
    onClear() {
      this.search = {
        teacherId: undefined,
        userId: undefined
      }
      this.$emit('onClear')
    },
    userChange(val) {
      this.onSearch()
    },
    getUserByName(val) {
      return new Promise((resolve, reject) => {
        const params = {
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
    async getTeacherList() {
      const res = await getCharactersTeacherList({ type: 1, status: 1 })
      this.teacherList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  padding: 20px 0px;
  .search-main {
    width: 100%;
  }
}
</style>
