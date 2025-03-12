<template>
  <div class="page_wrap">
    <!-- 班主任管理 -->
    <div class="header_search">
      <div>
        <el-button @click="add()">新增</el-button>
      </div>
      <div>
        <el-select v-model="search.period" class="w-100">
          <el-option label="全部" value="" />
          <el-option label="1期" :value="1" />
          <el-option label="2期" :value="2" />
          <el-option label="3期" :value="3" />
          <el-option label="4期" :value="4" />
        </el-select>
        <el-input v-model="search.text.value" placeholder="请输入" class="w-350 m-l-20">
          <el-select slot="prepend" v-model="search.text.label" placeholder="请选择" class="w-100">
            <el-option label="姓名" :value="1" />
            <el-option label="手机号" :value="2" />
          </el-select>
          <el-button slot="append" type="primary">查询</el-button>
        </el-input>
      </div>
    </div>
    <el-table class="m-t-20" :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="期数" />
      <el-table-column prop="dept" label="部门" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="status" label="在职状态" />
    </el-table>
    <appDialog v-model="dialog.visible" title="新增" width="500px" height="300px">
      <div class="Dialog overflowOuto">
        <el-form ref="form" :model="dialog.form" label-width="50px">
          <el-form-item label="期数">
            <el-select v-model="dialog.form.period">
              <el-option label="1期" :value="1" />
              <el-option label="2期" :value="2" />
              <el-option label="3期" :value="3" />
              <el-option label="4期" :value="4" />
            </el-select>
            <!-- <el-input v-model="dialog.form.period" /> -->
          </el-form-item>
          <el-form-item label="人员">
            <el-tag v-for="(tag, index) in dialog.form.user" :key="index">
              {{ tag.nickName }}
            </el-tag>
            <el-button size="small" @click="selectUser">选择人员</el-button>
          </el-form-item>
        </el-form>
      </div>
    </appDialog>
  </div>
</template>

<script>
import appDialog from '@/components/AppDialog'
export default {
  components: {
    appDialog
  },
  data() {
    return {
      search: {
        period: '', // 期数
        text: { label: 1, value: '' }
      },
      tableData: [],
      multipleSelection: [],
      dialog: {
        visible: false,
        form: {
          period: '',
          user: []
        }
      }
    }
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    add() {
      this.dialog = {
        visible: true,
        form: {
          period: '',
          user: []
        }
      }
    },
    // 选择人员
    selectUser() {
      this.dialog.form.user
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkDept: [],
        checkUserIds: this.dialog.form.user,
        success: (res) => {
          console.log(res, 'res')
          this.dialog.form.user = res.user
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  .header_search {
    display: flex;
    justify-content: space-between;
  }
}
.Dialog {
  width: 500px;
  height: 300px;
  padding: 10px;
}
</style>
