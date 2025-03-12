<template>
  <div class="filterTop">
    <div class="filterTopTitle">云桌面数据概览</div>
    <el-row class="statisticsList" :gutter="20">
      <template v-for="(item) in statisticsList">
        <el-col :key="item.key" :span="6">
          <div class="statisticsView" :style="{background: item.bgColor}">
            <svg-icon :icon-class="item.icon" class="statisticsIcon" />
            <div class="statisticsTitle">{{ item.title }}</div>
            <i v-if="statisticsLoading" class="el-icon-loading statisticsLoading" />
            <div v-else class="statisticsNumber" :style="{color: item.numberColor}">{{ item.number }}</div>
            <div class="statisticsUnit">{{ item.unit }}</div>
          </div>
        </el-col>
      </template>
    </el-row>

    <div class="search">
      <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true" class="searchForm">
        <div class="searchFormLeft">
          <el-form-item label="人员搜索">
            <el-input
              v-model.trim="search.user.value"
              class="w-300"
              placeholder="请输入"
              clearable
              @clear="clearUserFn"
              @keyup.enter.native="$emit('searchFn')"
            >
              <el-select slot="prepend" v-model="search.user.label" style="width:100px" placeholder="请选择">
                <el-option label="手机号码" value="userPhone" />
                <el-option label="员工姓名" value="userName" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="当前状态">
            <el-select v-model="search.ecsStatus" placeholder="请选择" clearable @change="$emit('searchFn')">
              <el-option v-for="(value, key) in deskTopReadyStauts" :key="key" :label="value" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态">
            <el-select v-model="search.staffStatus" placeholder="请选择" clearable @change="$emit('searchFn')">
              <el-option label="全部" value="" />
              <el-option label="在职" :value="0" />
              <el-option label="离职" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" size="small" @click="handleClickSearch">查询</el-button>
            <el-button :loading="loading" size="small" @click="clear">重置</el-button>
          </el-form-item>
        </div>
        <div class="searchFormRight">
          <CustomTabelHeader class="m-b-20" :columns="columns" v-bind="$attrs" v-on="$listeners" />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import CustomTabelHeader from './CustomTabelHeader'
import { deskTopReadyStauts } from '@/components/cloudDesktop/columns'
import { userNoPage } from '@/api/addressBookApi'
export default {
  components: {
    CustomTabelHeader
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          user: { label: 'userPhone', value: '' },
          ecsStatus: '',
          userIds: [],
          staffStatus: '',
          numSort: '', // 次数排序
          timeSort: '' // 时长排序
        }
      }
    },
    columns: {
      type: Array,
      default: () => []
    },
    statisticsLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      deskTopReadyStauts,
      statisticsList: [
        { title: '总数', number: 0, unit: '台', numberColor: '#0C6FFF', bgColor: 'linear-gradient(225deg, #F9FBFF 0%, #F0F6FF 100%)', icon: 'zongshu', key: 'totalCount' },
        { title: '关机数', number: 0, unit: '台', numberColor: '#FF7D00', bgColor: 'linear-gradient(225deg, #FFFCF9 0%, #FFF7F0 100%)', icon: 'guanjishu', key: 'stopCount' },
        { title: '开机数', number: 0, unit: '台', numberColor: '#00B42A', bgColor: 'linear-gradient(225deg, #F4FBF6 0%, #E6F5EA 100%)', icon: 'kaijishu', key: 'startCount' },
        { title: '释放数', number: 0, unit: '台', numberColor: '#F53F3F', bgColor: 'linear-gradient(225deg, #FBF5F5 0%, #F5E6E6 100%)', icon: 'shifangshu', key: 'releaseCount' }
      ]
    }
  },
  mounted() {},
  methods: {
    clear() {
      console.log('点击重置')
      this.$emit('clear')
    },
    handleClickSearch() {
      this.$emit('searchFn')
    },
    userChange(e) {
      if (!e) {
        this.$emit('searchChange', [])
      } else {
        this.loading = true
        const params = {
          nickName: this.search.user.value,
          phone: this.search.user.value
        }
        if (this.search.user.label === 'userName') {
          delete params.phone
        } else {
          delete params.nickName
        }
        userNoPage(params).then((res) => {
          console.log(res)
          const userIds = res.data.reduce((pre, next) => {
            pre.push(next.userId)
            return pre
          }, [])
          this.$emit('searchChange', userIds)
          this.loading = false
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      }
    },
    setStatistics(key, value) {
      const index = this.statisticsList.findIndex(v => v.key === key)
      index > -1 && (this.statisticsList[index].number = value)
    },
    clearUserFn() {
      this.$emit('searchChange', [])
      this.$emit('searchFn')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  padding: 0 20px;
  overflow: hidden;
  .filterTopTitle {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
  }
  .statisticsList {
    padding-top: 16px;
    padding-bottom: 20px;
    .statisticsView {
      display: flex;
      align-items: center;
      border-radius: 8px;
      .statisticsIcon {
        width: 80px;
        height: 92px;
      }
      .statisticsTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 92px;
        flex: 1 0 0;
      }
      .statisticsNumber {
        font-size: 26px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        line-height: 92px;
        padding-right: 4px;
      }
      .statisticsUnit {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 92px;
        padding-right: 16px;
      }
      .statisticsLoading {
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
    }
  }
  .search {
    // border-top: 1px solid #E7E7E7;
    padding-top: 20px;
    .searchForm {
      display: flex;
      .searchFormLeft {
        flex: 1 0 0;
      }
      .searchFormRight {
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
::v-deep {
  .el-form-item__label {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    font-weight: 400;
  }
  .el-input-group__append, .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
