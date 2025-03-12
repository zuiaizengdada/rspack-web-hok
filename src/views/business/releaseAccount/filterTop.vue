<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-row>
        <el-form-item label="投放平台" label-width="5em">
          <el-select v-model="search.adPlatform" class="w-200" placeholder="请选择" clearable @change="$emit('onSearch')">
            <el-option v-for="item in launchPlatformOption" :key="item.value" :label="item.label" :value="item.value">
              <svg-icon :icon-class="item.icon" />
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告主ID" label-width="6em">
          <el-input v-model.trim="search.advertiserId" class="w-200" placeholder="请输入广告主ID" clearable maxlength="30" @input="(e) => delNoNumber2(e, 'advertiserId')" />
        </el-form-item>
        <el-form-item label="账号ID" label-width="6em">
          <el-input v-model.trim="search.fyId" class="w-200" placeholder="请输入飞鱼账号ID" clearable maxlength="30" @input="(e) => delNoNumber2(e, 'fyId')" />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label="员工姓名" label-width="5em">
            <searchSelect :value="search.userName" class="w-200" @onClick="changeUser" @onClear="onhanldeUserClear" />
          </el-form-item>
          <el-form-item label="投放部门" label-width="5em">
            <searchSelect :value="search.deptName" class="w-200" @onClick="changeDept" @onClear="onhanldeDeptClear" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleClear">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col class="fonter_btn">
          <div>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="onhandleAdd">新增账号</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { launchPlatformOption } from './columns'
import searchSelect from '@/components/AppSearchSelect'
export default {
  components: {
    searchSelect
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          adPlatform: '', // 投放平台
          advertiserId: '', // 广告主Id
          deptId: '', // 投放部门
          deptName: '', // 投放部门名称
          fyId: '', // 飞鱼账号id
          userId: '', // 运营人员姓名
          userName: '' // 部门id
        }
      }
    }
  },
  data() {
    return {
      launchPlatformOption
    }
  },
  mounted() {},
  methods: {
    // 限制输入英文数字和汉字
    delNoNumber(e, key) {
      this.search[key] = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 限制输入英文数字和汉字
    delNoNumber2(e, key) {
      this.search[key] = e.replace(/[^\a-\z\A-\Z0-9]/g, '')
    },
    // 点击部门
    changeDept() {
      const checkDept = []
      if (this.search.departmentName) {
        checkDept.push({ name: this.search.deptName, deptId: this.search.deptId })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [0],
        checkDept,
        success: (res) => {
          if (res.dept.length > 0) {
            this.search.deptName = res.dept[0].name
            this.search.deptId = res.dept[0].deptId
            this.$emit('onSearch')
          }
        }
      })
    },
    // 点击清空部门
    onhanldeDeptClear() {
      this.search.deptName = ''
      this.search.deptId = ''
      this.$emit('onSearch')
    },
    // 点击员工
    changeUser() {
      const checkUser = []
      if (this.search.operateName) {
        checkUser.push({ nickName: this.search.userName, userId: this.search.userId })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        ifAll: true,
        checkUser,
        success: (res) => {
          if (res.user.length > 0) {
            this.search.userName = res.user[0].nickName
            this.search.userId = res.user[0].userId
            this.$emit('onSearch')
          }
        }
      })
    },
    // 点击清空员工
    onhanldeUserClear() {
      this.search.userName = ''
      this.search.userId = ''
      this.$emit('onSearch')
    },
    // 点击查询
    handleSearch() {
      this.$emit('onSearch')
    },
    // 点击重置
    handleClear() {
      this.$emit('onClear')
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    }
  }
}
</script>

<style lang='scss' scoped>
.fonter_btn {
  width: 200px;
  display: flex;
  justify-content: flex-end;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
