<template>
  <div class="viewingRecord">
    <div class="filterTop">
      <el-form ref="form" :hide-required-asterisk="true" :model="search" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="" prop="userInfo">
          <!-- <el-input v-model="search.phone" type="tel" maxlength="11" class="w-200 m-r-10" clearable @input="delNumber" @clear="clearFn" @keyup.enter.native="searchFn" /> -->
          <selectTelEmail v-model="search.userInfo" :source-list="sourceList" class="m-r-10" size="small" @onChange="searchFn" @clearValidate="clearValidate" />
          <el-button size="small" type="primary" @click="searchFn">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="m_title">
      <MTitle>用户观看记录</MTitle>
    </div>
    <div v-loading="loading" class="classAttendanceRecord overflowOuto">
      <div v-for="(value ,key) in list" :key="key" class="attList">
        <div class="attListTitle" @click.stop="onhandleOpen(value)">
          <div>
            <span>{{ value.dateStr }}</span>
          </div>
          <div class="wrapper-left">
            <div class="btn-left">
              {{ value.childrenOpen ? '收起' : '展开' }}
              <i :class="value.childrenOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" />
            </div>
          </div>
        </div>
        <CollapseTransition>
          <div v-if="value.childrenOpen">
            <div v-for="(info, i) in value.dataList" :key="i" class="goodsList">
              <el-descriptions :column="3">
                <el-descriptions-item label="直播间名称">{{ info.liveRoomName }}</el-descriptions-item>
                <el-descriptions-item label="邀请人" :span="2">{{ info.inviteUserName }}</el-descriptions-item>
                <el-descriptions-item label="首次进入时间" :span="3">{{ info.firstEntryTime | renderTime('MM-DD HH:mm:ss') }}</el-descriptions-item>
                <el-descriptions-item label="直播观看时长">{{ info.liveWatchTime | filtersListen }}</el-descriptions-item>
                <el-descriptions-item label="回放观看时长">{{ info.playbackWatchTime | filtersListen }}</el-descriptions-item>
                <el-descriptions-item label="总观看时长">{{ info.totalWatchTime | filtersListen }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </CollapseTransition>
      </div>
      <div v-show="ifError || total === 0" class="noData">
        <template v-if="ifError">
          <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
          <div class="noDataText">{{ `请输入用户准确的${{tel: '手机号', Email: '邮箱'}[search.userInfo.label]}进行查询！` }}</div>
        </template>
        <template v-else-if="!ifError && ifSearch">
          <img src="~@/assets/image/adNoData.png" alt="" />
          <div class="noDataText">{{ `该${{tel: '手机号', Email: '邮箱'}[search.userInfo.label]}暂无直播观看记录！` }}</div>
        </template>
        <template v-else>
          <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
          <div class="noDataText">{{ `请输入用户准确的${{tel: '手机号', Email: '邮箱'}[search.userInfo.label]}进行查询！` }}</div>
        </template>
      </div>
    </div>
    <div v-show="ifSearch && total !== 0" class="pagination_bottom">
      <div class="pagination">
        <div>共{{ total }}条</div>
        <pagination :total="total" :current="current" :size="size" @currentChange="currentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import pagination from '@/views/live/liveRoom/components/p3/liveRoomSeeting/pagination.vue'
import { getWatchHistoryByPhone } from '@/api/liveRoom/setting.js'
import selectTelEmail from '@/views/live/component/selectTelEmail'
export default {
  filters: {
    renderTime(val, str) {
      if (!val) {
        return ''
      }
      return moment(val).format(str)
    },
    filtersListen(val) {
      if (!val) { return 0 + '分钟' }
      if (val < 60000) {
        return Math.floor(val / 1000) + '秒'
      }
      return Math.floor(val / 1000 / 60) + '分钟'
    }
  },
  components: {
    CollapseTransition,
    pagination,
    selectTelEmail
  },
  data() {
    var checkUserInfo = (rule, value, callback) => {
      var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (this.search.userInfo.label === 'tel') {
        if (!this.search.userInfo.value.tel) {
          return callback(new Error('您的手机号输入错误，请重新输入。'))
        }
        callback()
      } else if (this.search.userInfo.label === 'Email') {
        if (!this.search.userInfo.value.Email || !regex.test(this.search.userInfo.value.Email)) {
          return callback(new Error('您的邮箱输入错误，请重新输入。'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      search: {
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        }
      },
      list: [],
      loading: false,
      total: 0,
      current: 1,
      size: 10,
      rules: {
        userInfo: [
          { validator: checkUserInfo, trigger: 'blur' }
        ]
      },
      sourceList: [
        { label: '手机号码', value: 'tel', placeholder: '请输入用户手机号码', origin: '' },
        { label: '邮箱', value: 'Email', placeholder: '请输入用户邮箱', origin: '' }
      ],
      ifError: false,
      ifSearch: false
    }
  },
  mounted() {},
  methods: {
    // 限制只能输入数字
    delNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
    },
    currentChange(res) {
      this.current = res
      this.getList()
    },
    searchFn() {
      this.list = []
      console.log('点击搜索')
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(valid, 'valid')
          // alert('submit!');
          this.getList()
        } else {
          this.ifError = true
          console.log('error submit!!')
          return false
        }
      })
    },
    // 判断是否今日
    ifToday(val) {
      if (!val) { return false }
      return moment(val).isSame(moment().format('yyyy-MM-DD'))
    },
    ifYesterday(val) {
      if (!val) { return false }
      return val === moment().subtract(1, 'days').format('YYYY-MM-DD')
    },
    getObj(arr) {
      const obj = {}
      const list = []
      arr.map(v => {
        obj[v.time] ? obj[v.time].push(v) : (obj[v.time] = [v])
      })
      for (const key in obj) {
        obj[key].sort((a, b) => {
          return moment(b.liveStartTime).valueOf() - moment(a.liveStartTime).valueOf()
        })
        list.push({ key: key, arr: obj[key], childrenOpen: true })
      }
      console.log(list)
      list.sort((a, b) => {
        return moment(b.key).valueOf() - moment(a.key).valueOf()
      })
      return list
    },
    getList() {
      console.log('1111')
      this.ifError = false
      this.ifSearch = true
      this.loading = true
      const params = {
        pageIndex: this.current,
        pageSize: this.size,
        phoneNumber: this.search.userInfo.label === 'tel' ? this.search.userInfo.value.tel : '',
        email: this.search.userInfo.label === 'Email' ? this.search.userInfo.value.Email : ''
      }
      console.log(params)
      getWatchHistoryByPhone(params).then(res => {
        console.log(res, 'res')
        res.data.items.map((v) => {
          v.childrenOpen = true
        })
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onhandleOpen(value) {
      value.childrenOpen = !value.childrenOpen
    },
    clearFn() {
      this.search = {
        phone: ''
      }
      this.ifError = false
      this.ifSearch = false
      this.list = []
      this.total = 0
      this.current = 1
      this.size = 10
      this.$refs.form.clearValidate()
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang='scss' scoped>
.viewingRecord {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .filterTop {
        padding: 20px;
        font-weight: 400;
        font-size: 14px;
        color: #606266;
    }
    .m_title {
        margin: 0 20px;
    }
    .classAttendanceRecord {
        flex: 1 0 0;
        // height: calc(100% - 110px);
        overflow: auto;
        padding: 0 20px 82px;
        .attList {
          width: 100%;
          margin-top: 20px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #D8DCE6;
          .attListTitle {
            cursor: pointer;
            background: #E7F0FF;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 22px;
            padding: 7px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .goodsList {
              padding: 10px 0;
              margin: 0 20px;
              .goodsname {
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: bold;
                  color: #333333;
                  line-height: 22px;
                  margin-bottom: 10px;
              }
              .goodsListform {
                  margin-bottom: 10px;
                  display: flex;
                  flex-wrap: wrap;
                  .formLabel {
                      font-size: 16px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #777777;
                      line-height: 22px;
                  }
                  .formValue {
                      font-size: 16px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #333333;
                      line-height: 22px;
                  }
              }
          }
          .goodsList + .goodsList {
              border-top: 1px solid #F5F5F5;
          }
          .wrapper-left {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-left: 10px;
            width: 68px;
            height: 32px;
            flex-shrink: 0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .btn-left {
              color: #0c6fff;
              font-family: "Microsoft YaHei";
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 14px;
            }
          }
        }
    }
    .noData {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 100px;
      > img {
        width: 250px;
      }
      .noDataText {
        margin-top: 16px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
      }
    }
    .pagination_bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 62px;
      background: #FFFFFF;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
      .pagination {
        // width: 368px;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        padding-left: 18px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #999999;
        line-height: 22px;
        user-select:none;
      }
    }
}
</style>
