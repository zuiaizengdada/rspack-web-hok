<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <el-form
      ref="form"
      class="filter-module"
      :model="search"
      label-width="80px"
      size="small"
      :inline="true"
    >
      <el-form-item label="人员搜索">
        <div class="flex">
          <el-select
            v-model="search.text.label"
            class="input-with-select input-with-select-chang"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model.trim="search.text.value"
            class="input-with-input"
            style="width: 160px"
            clearable
            @clear="sureSearch"
            @keyup.enter.native="sureSearch"
          />
        </div>
      </el-form-item>
      <el-form-item v-if="type!==2" label="员工状态">
        <el-select
          v-model="search.status.value"
          placeholder="请选择"
          @change="sureSearch"
        >
          <el-option
            v-for="item in employeeArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间搜索">
        <el-select
          v-model="search.time.label"
          style="width: 100px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="search.time.value"
          style="width: 250px"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="sureSearch"
        >查询</el-button>
        <el-button size="small" @click="clear()">重置</el-button>
      </el-form-item>

      <el-row v-if="type!==2" type="flex" justify="end" style="padding: 0 22px">
        <el-checkbox
          v-model="search.deptTypeF"
          @change="sureSearch"
        >只看当前部门</el-checkbox>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['search', 'type'],
  data() {
    return {
      options: [
        { label: '手机号码', value: 'phone' },
        { label: '员工姓名', value: 'nickName' }
      ],
      employeeArray: [
        { label: '全部', value: -1 },
        { label: '在职', value: 0 },
        { label: '离职', value: 1 }
      ],
      timeOptions: [
        { label: '创建时间', value: 1 },
        { label: '更新时间', value: 2 }
      ],
      searchOpen: false,
      permsList: this.$route.meta.permsList || [],
    }
  },
  created() {},
  mounted() {
    //仅获客机构
    this.permsList.includes('system:user:hokOrgAuth') && (
    this.employeeArray = [
        { label: '全部', value: -1 },
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ])
  },
  methods: {
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        deptName: '',
        text: { label: 'phone', value: '' },
        time: { label: 1, value: ['', ''] },
        status: { label: 1, value: 0 },
        loading: false
      }
      this.$emit('search', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 100px;
  height: 32px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  border-radius: 3px 0px 0px 3px;
}
.input-with-select-chang {
  ::v-deep .el-input__inner {
    border: none;
    border-radius: 3px 0px 0px 3px;
    border: 1px solid #d8dce6 !important;
    border-right: none !important;
  }
}
.input-with-input {
  ::v-deep .el-input__inner {
    border-radius: 0px 3px 3px 0px;
  }
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
</style>
