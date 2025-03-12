<template>
  <div class="filterHeader">
    <div class="fl">
      <span>
        <span class="formLabel">月份</span>
        <el-date-picker
          v-model="search.month"
          size="small"
          type="month"
          placeholder="选择月"
          class="m-r-20 m-l-10"
          filterable
          clearable
          style="width: 120px"
          format="yyyy-MM"
          value-format="yyyyMM"
          :picker-options="pickerOptions"
          @change="searchFn"
          @focus="focus"
        />
      </span>
      <span>
        <span class="formLabel">部门查询</span>
        <el-cascader
          v-model="search.deptIds"
          class="w-200 m-r-20"
          size="small"
          filterable
          :options="deptTreeArray"
          :props="{ checkStrictly: true }"
          clearable
        />
      </span>
      <span class="formLabel">员工</span>
      <el-select v-model="search.userIds" multiple size="small" class="m-r-20 m-l-10" filterable placeholder="请选择" clearable @change="searchFn">
        <el-option
          v-for="item in userArray"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        />
      </el-select>
      <div style="display: flex;align-items: center;">
        <el-button size="small" type="primary" @click="searchFn">查询</el-button>
        <el-button size="small" class="btn_primary" @click="gotoTargetSetting">月目标设置</el-button>
        <el-checkbox-group v-model="search.checkList" class="m-l-20" @change="$emit('checkListChange')">
          <el-checkbox :label="1">数字直播</el-checkbox>
          <el-checkbox :label="2">真人直播</el-checkbox>
          <el-checkbox :label="3">录单</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import { userNoPage, deptTree } from '@/api/addressBookApi'
import moment from 'moment'
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          month: '',
          deptIds: [],
          userIds: [],
          checkList: [1, 2, 3]
        }
      }
    }
  },
  data() {
    return {
      userArray: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      deptTreeArray: []
    }
  },
  created() {
    this.loadUserNoPage()
    this.loadTreeData()
  },
  mounted() {},
  methods: {
    focus() {
      if (!this.search.month) {
        this.search.month = moment().format('YYYYMM')
        setTimeout(() => {
          this.search.month = moment().format('YYYYMM')
        }, 200)
      }
    },
    searchFn() {
      if (!this.search.month) {
        this.search.month = moment().format('YYYYMM')
        setTimeout(() => {
          this.search.month = moment().format('YYYYMM')
        }, 200)
      }
      this.$emit('onSearch', this.search)
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
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    // 点击前往月目标设置
    gotoTargetSetting() {
      this.$router.push({
        name: 'liveTargetSettingEdit',
        params: { month: this.search.month }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.filterHeader {
    margin-top: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
      margin-right: 8px;
    }
  }
</style>
