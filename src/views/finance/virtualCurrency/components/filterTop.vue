<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="query" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item>
            <el-input
              v-model="query.value"
              clearable
              size="small"
              style="width: 300px"
              placeholder="请输入"
              class="filter-input"
              @keyup.enter.native="sureSearch"
              @clear="sureSearch"
            >
              <el-select slot="prepend" v-model="userOptions.active" size="small" @change="handleSelectChange">
                <el-option v-for="(item, index) in userOptions.userType" :key="index" :label="item" :value="index" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-select v-model="query.timeType" style="width: 100px" size="small" @change="handleSelectTime">
              <el-option v-for="(item, index) in timeType" :key="index" :label="item" :value="index" />
            </el-select>
            <el-date-picker
              v-model="time"
              class="filter-item"
              type="daterange"
              size="small"
              placeholder="请选择申请时间"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleChangeDate"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-select
              v-model="query.operateType"
              placeholder="请选择操作类型"
              size="small"
              clearable
              style="width: 200px"
              class="filter-item"
              @clear="sureSearch"
              @change="sureSearch"
            >
              <el-option v-for="(item, index) in operateTypes" :key="item" :label="item" :value="+index" />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="filterTopRight">
      <el-button type="primary" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" @click="clear()">清空</el-button>
    </div>
  </div>
</template>

<script>
const userType = {
  nickName: '用户昵称',
  phoneNumber: '用户手机'
}
const timeType = {
  1: '操作时间',
  2: '审核时间'
}
import { operateTypes } from '@/utils/enum'
export default {
  name: 'FilterTop',
  // eslint-disable-next-line vue/require-prop-types
  data() {
    return {
      userOptions: {
        userType,
        active: 'nickName'
      },
      timeType,
      operateTypes,
      time: null,
      searchOpen: true,
      query: {
        beginTime: '',
        endTime: '',
        operateType: '',
        nickName: '',
        timeType: '1',
        value: undefined,
        phoneNumber: ''
      }
    }
  },
  methods: {
    sureSearch() {
      const params = this.query
      params[this.userOptions.active] = this.query.value
      for (const i in params) {
        if (!params[i]) {
          params[i] = undefined
        }
      }
      this.$emit('search', {
        ...params,
        value: undefined
      })
    },
    handleSelectChange() {
      this.query.value = ''
      for (const key in userType) {
        this.query[key] = ''
      }
    },
    clear() {
      this.query = {
        beginTime: '',
        endTime: '',
        operateType: '',
        nickName: '',
        timeType: '1',
        value: undefined,
        phoneNumber: ''
      }
      this.time = null
      this.$emit('search')
    },
    handleChangeDate() {
      if (!this.time) {
        this.query.beginTime = undefined
        this.query.endTime = undefined
        return
      }
      this.query.beginTime = this.time[0] + ' 00:00:00'
      this.query.endTime = this.time[1] + ' 23:59:59'
    },
    handleSelectTime() {
      this.time = null
      for (const key in timeType) {
        this.query[key] = ''
      }
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
    border-left: 1px solid #e7e7e7;
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
}

.el-input.filter-input .el-select {
  width: 100px;
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
