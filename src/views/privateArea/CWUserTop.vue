<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="100px" size="small" :inline="true">
        <el-row>
          <el-form-item label="类型">
            <el-input v-model="search.searchTxt" placeholder="请输入" class="input-w" size="small" style="width:280px" maxlength="100">
              <el-select slot="prepend" v-model="search.searchType" class="w-120" size="small" placeholder="请选择">
                <el-option label="corpid" value="corpId" />
                <el-option label="部门名称" value="deptName" />
                <el-option label="成员名称" value="userName" />
                <el-option label="open_userid" value="openUserId" />
                <el-option label="获课账户" value="hokUserId" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="关联获课">
            <el-select v-model="search.linkHokUserFlag" class="m-l20" placeholder="关联获课" style="width:180px">
              <el-option label="全部" value="" />
              <el-option label="是" :value="2" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="班主任">
            <el-select v-model="search.headTeacherFlag" class="m-l20" placeholder="班主任" style="width:180px">
              <el-option label="全部" value="" />
              <el-option label="是" :value="2" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="企微客服">
            <el-select v-model="search.customServiceFlag" class="m-l20" placeholder="企微客服">
              <el-option label="全部" value="" />
              <el-option label="是" :value="2" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
        </el-row>
        <template v-if="searchOpen">
          <el-row>
            <el-form-item label="企微机器人">
              <el-select v-model="search.wxRobotStatus" class="m-l20" placeholder="企微机器人">
                <el-option label="全部" value="" />
                <el-option label="在线" :value="3" />
                <el-option label="离线" :value="2" />
                <el-option label="否" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="企微在职">
              <el-select v-model="search.wxInServiceFlag" class="m-l20" placeholder="企微在职">
                <el-option label="全部" value="" />
                <el-option label="在职" :value="2" />
                <el-option label="离职" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="获课在职">
              <el-select v-model="search.hokInServiceFlag" class="m-l20" placeholder="获课在职">
                <el-option label="全部" value="" />
                <el-option label="在职" :value="2" />
                <el-option label="离职" :value="1" />
              </el-select>
            </el-form-item>
          </el-row>
        </template>
      </el-form>
    </div>
    <div class="filterTopRight">
      <el-button type="primary" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" @click="clear()">清空</el-button>
    </div>

    <div class="fiterTopTagger">
      <el-button type="text" @click="searchOpen = !searchOpen">
        {{ searchOpen ? '收起' : '更多' }}
        <i class="el-icon-arrow-up btn_more" :class="{'btn_close': searchOpen}" />
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FilterTop',
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      searchOpen: true
    }
  },
  computed: {
    ...mapGetters([
      'channelSourceType'
    ])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  methods: {
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        searchType: 'corpId', // 搜索类型
        searchTxt: '', // 搜索内容
        linkHokUserFlag: '', // 关联获课
        headTeacherFlag: '', // 班主任
        customServiceFlag: '', // 企微客服
        wxRobotStatus: '', // 企微机器人
        wxInServiceFlag: '', // 企微在职
        hokInServiceFlag: '' // 获课在职
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
