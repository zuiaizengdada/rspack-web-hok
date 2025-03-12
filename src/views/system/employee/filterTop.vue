<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item label="人员搜索">
            <el-select v-model="search.text.label" placeholder="请选择" class="w-120">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model.trim="search.text.value" class="w-250 m-l-20" clearable @clear="sureSearch" @keyup.enter.native="sureSearch" />
          </el-form-item>
          <el-form-item label="员工状态">
            <el-select v-model="search.status.value" placeholder="请选择" class="w-250" @change="sureSearch">
              <el-option
                v-for="item in employeeArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-row>
        <el-row>
          <el-form-item label="时间搜索">
            <el-select v-model="search.time.label" placeholder="请选择" class="w-120">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-model="search.time.value"
              class="w-250 m-l-20"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="search.deptTypeF" style="margin-right: 50px;" @change="sureSearch">只看当前部门</el-checkbox>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="filterTopRight">
      <el-button type="primary" size="small" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" size="small" @click="clear()">清空</el-button>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      options: [
        { label: '手机号码', value: 'phone' },
        { label: '员工姓名', value: 'nickName' }
        // { label: '英文名称', value: 'userName' }
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
      searchOpen: false
    }
  },
  created() {
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
.filterTop {
  width: 100%;
  display: flex;
  position: relative;
  .filterTopLeft {
    flex: 1 0 0;
  }
  .filterTopRight {
    border-left: 1px solid  #E7E7E7;
    padding: 20px;
    width: 107px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .fiterTopTagger {
    position: absolute;
    bottom: 0;
    left: 50%;
  }
}
.filter-module {
  padding: 16px;
  width: 100%;
  // min-width: 1122px;
  // background-color: #f5f7fa;
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
    border-color: #2A75ED;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
</style>
