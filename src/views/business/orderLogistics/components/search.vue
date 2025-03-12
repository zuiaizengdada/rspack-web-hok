<template>
  <div>
    <div class="search-box">
      <div class="search-main">
        <el-form ref="form" v-model="search" size="small" :inline="true">
          <el-form-item>
            <el-input
              v-model.trim="search.queryParam"
              clearable
              placeholder="请输入"
              @change="userChange"
            >
              <el-select
                slot="prepend"
                v-model="search.queryType"
                style="width: 125px"
                placeholder="请选择"
              >
                <el-option label="订单号" :value="1" />
                <el-option label="运单号" :value="2" />
                <el-option label="实物商品名称" :value="6" />
                <el-option label="订单商品名称" :value="3" />
                <el-option label="商品编码" :value="4" />
                <el-option label="买家手机号" :value="5" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select
              v-model="search.orderStatus"
              placeholder="请选择订单状态"
              filterable
              clearable
              @change="userChange"
            >
              <el-option
                v-for="item in orderStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道平台">
            <el-select
              v-model="search.channelSource"
              placeholder="请选择渠道平台"
              filterable
              clearable
              @change="userChange"
            >
              <el-option
                v-for="item in channelSourceType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="search.timeType"
              style="width: 130px"
              placeholder="请选择"
            >
              <el-option label="下单时间" :value="1" />
              <el-option label="物流更新时间" :value="2" />
            </el-select>
            <el-date-picker
              v-model="search.times"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="userChange"
            />
          </el-form-item>
          <el-button class="mb18" type="primary" size="small" @click="onSearch">
            查询
          </el-button>
          <el-button class="mb18" size="small" @click="onClear">重置</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCharactersTeacherList } from '@/api/aiVideoManage'
import { userNoPage } from '@/api/addressBookApi'
import { orderStatusList, channelSourceList } from '../util'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      channelSourceList,
      orderStatusList,
      userList: [],
      teacherList: [],
      search: {
        queryType: 1,
        queryParam: '',
        orderStatus: '',
        channelSource: '',
        timeType: 1,
        times: []
      }
    }
  },
  created() {
    this.getTeacherList()
    this.getUserByName()
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  methods: {
    onSearch() {
      const params = {
        ...this.search,
        startTime:
          this.search.times && this.search.times.length
            ? moment(this.search.times[0]).utc(true)
            : undefined,
        endTime: this.search.times && this.search.times.length
          ? moment(this.search.times[1]).utc(true)
          : undefined
      }
      delete params.times
      this.$emit('onSearch', params)
    },
    onClear() {
      this.search = {
        queryType: 1,
        queryParam: '',
        orderStatus: '',
        channelSource: '',
        timeType: 1,
        times: []
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
