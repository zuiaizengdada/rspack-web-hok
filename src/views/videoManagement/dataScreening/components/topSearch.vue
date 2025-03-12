<template>
  <div class="top_search">
    <div class="search_title">
      <span class="title_span">
        <em />
        <p>数据概览</p>
        <el-tooltip
          class="item"
          effect="dark"
          placement="bottom"
        >
          <div slot="content" class="content-cls">
            <p>1、当你选择指定日期范围，数据为指定日期内的增量数据作品：指定日期内所有账号发布的总作品数，包含已删除作品</p>
            <span>净增粉丝数：指定日期内所有账号的净增粉丝数，等于关注粉丝数-取消关注粉丝数</span>
            <span>播放：指定日期内所有账号发布的所有视频的播放次数</span>
            <span>点赞：指定日期内所有账号发布的所有视频的点赞次数，包含已取消的点赞</span>
            <span>评论：指定日期内所有账号发布的所有视频的评论次数，包含已删除的评论</span>
            <span>分享：指定日期内所有账号发布的所有视频成功分享的次数。小红书无分享数据。</span>
            <p>2、当时间范围选择累计，作品、净增粉丝数、播放、点赞、评论、分享为账号所有作品历史累计数据</p>
            <p>3、数据按天更新，官方平台预计每日12点(各平台可能略有差异)完成截止到昨日的数据更新，数据统计时间为自然日0点到24点。伏羲云系统在每日12点后，登录系统可同步官方平台数据到伏羲云系统。</p>
          </div>
          <img :src="wenhaoImg" style="float: left; margin-left: 5px; margin-top: 4px; cursor: pointer;" />
        </el-tooltip>
      </span>
      <span class="count_nums">
        <em />
        <p>账号总数</p>
        <i>{{ totalAccountNums }}</i>
      </span>
      <div class="right_time_choose">
        <AppDatepicker
          :show="[1, 7,14,30]"
          :default="defaultTime"
          :size="search.size"
          :search="search"
          :picker-options="pickerOptions"
          @change="timeChange"
        />
      </div>
    </div>
    <div class="form_search">
      <el-form :inline="true" size="mini" :model="form" class="demo-form-inline flex flex-between flex-middle">
        <div>
          <el-form-item label="部门">
            <el-cascader v-model="deptArray" :options="deptTreeArray" :props="{ checkStrictly: true }" clearable @change="visibleChangeD($event)" @visible-change="visibleChangeD($event)" />
          </el-form-item>
          <el-form-item label="运营者">
            <el-select v-model="form.operatorId" filterable placeholder="请选择" clearable @change="loadData">
              <el-option
                v-for="item in userArray"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              >
                <span style="float: left">{{ item.nickName }}</span>
                <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台">
            <el-select v-model="form.platformId" filterable placeholder="请选择" clearable @change="loadData">
              <el-option
                v-for="item in platformArray"
                :key="item.platformId"
                :label="item.platformName"
                :value="item.platformId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="IP">
            <el-select v-model="form.teacherId" remote :remote-method="tearchFilter" clearable filterable placeholder="请选择IP" @blur="()=>tearchFilter('')" @change="handleChangeTeacher">
              <el-option-group
                v-for="group in filteredGroups(tearchArray)"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadData">查询</el-button>
            <el-button @click="clear">重置</el-button>
          </el-form-item>
        </div>
        <!-- <div>
          <el-popover
            placement="bottom-start"
            trigger="hover"
            popper-class="my-popover"
          >
            <div class="flex flex-column">
              <div class="flex flex-middle record_title">
                <span class="title_name">账号变更记录</span>
                <span class="title_time">2023-10-12～2023-11-10</span>
              </div>
              <div class="record_details">
                <div class="user_info flex flex-middle">
                  <span class="user_info_platformImg">头像</span>
                  <span class="user_info_platformName">张琦新商业咨询</span>
                  <span class="user_info_channel">渠道</span>
                </div>
                <div>
                  <el-timeline>
                    <el-timeline-item
                      v-for="(activity, index) in activities"
                      :key="index"
                      color="#0C6FFF"
                      :timestamp="activity.timestamp"
                      placement="top"
                    >
                      <div class="timeLine_content flex flex-middle">
                        <span class="timeLine_content_title1 m-r-20">变更运营</span>
                        <span class="timeLine_content_title2 m-r-20">IP：张琦</span>
                        <span class="flex flex-middle">
                          <span class="timeLine_content_title2 m-r-8">运营者：</span>
                          <span class="timeLine_content_old">彭杰</span>
                          <span>
                            <img src="@/assets/image/video/timeLine_next.png" alt="">
                          </span>
                          <span class="timeLine_content_title2">李燕灵</span>
                        </span>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
            </div>
            <el-form-item slot="reference">
              <svg-icon icon-class="change_record" class="m-r-8" />
              <span class="changeRecord">账号变更记录</span>
            </el-form-item>
          </el-popover>

        </div> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import AppDatepicker from './datePicker/datepick.vue'
import { userNoPage } from '@/api/addressBookApi'
import { loadUserData, changeTeacher, tearchFilter, filteredGroups } from '@/utils/videoMange'
import { getPlatform } from '@/api/videoManagement/accountManage'
import { getTotalAccountCount } from '@/api/videoManagement/dataApi'
import { deptTree } from '@/api/addressBookApi'
import wenhaoImg from '@/assets/image/account/icn_wenhao.svg'
export default {
  name: 'TopSearch',
  components: {
    AppDatepicker
  },
  data() {
    return {
      wenhaoImg,
      filteredGroups,
      search: {
        size: 'mini',
        active: 7,
        time: ['', '']
      },
      defaultTime: 7,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      roleObject: {},
      deptTreeArray: [],
      userArray: [],
      platformArray: [],
      tearchArray: [],
      teacherList: [],
      deptArray: [],
      form: {
        deptIdChain: '',
        operatorId: '',
        platformId: '',
        teacherId: '',
        startTime: '',
        endTime: ''
      },
      totalAccountNums: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created() {
    console.log('触发了创建子组件')
    this.initSearch()
    this.loadUserLoginInfo()
    this.loadPlatformData()
    this.loadTeacherData()
    this.loadAccountData()
    // this.search.time[1] = moment().subtract(1, 'day').format('YYYY-MM-DD')
    // this.search.time[0] = moment().subtract(7, 'day').format('YYYY-MM-DD')
    // this.loadData()
  },
  methods: {
    loadAccountData() {
      console.log(this.form, '搜索表单')
      getTotalAccountCount(this.form).then(res => {
        if (res.success) {
          this.totalAccountNums = res.data
        }
      })
    },
    initSearch() {
      let searchForm = localStorage.getItem('dataScreeningForm')
      if (searchForm) {
        searchForm = JSON.parse(searchForm)
        console.log(searchForm, '历史搜索条件')
        this.$set(this.search, 'active', searchForm.active)
        this.$set(this.search, 'time', [searchForm.startTime, searchForm.endTime])
        this.defaultTime = searchForm.active
        this.deptArray = []
        let str = searchForm.deptIdChain + ''
        str = str.substring(2, str.length)
        str = str.substring(0, str.length - 1)
        str = str.substring(str.indexOf('-') + 1, str.length)
        const strSting = str.split('-')
        strSting?.some(item => {
          this.deptArray.push(Number(item))
        })
        this.form.deptIdChain = searchForm.deptIdChain
        this.form.operatorId = searchForm.operatorId
        this.form.platformId = searchForm.platformId
        this.form.teacherId = searchForm.teacherId
        this.loadData()
      }
    },
    reLoadDataForZq(search) {
      // this.search = search
      let str = search.deptIdChain + ''
      str = str.substring(2, str.length)
      str = str.substring(0, str.length - 1)
      str = str.substring(str.indexOf('-') + 1, str.length)
      const strSting = str.split('-')
      this.deptArray = []
      strSting?.some(item => {
        this.deptArray.push(Number(item))
      })
      this.form.startTime = search.startTime
      this.form.endTime = search.endTime
      this.search.time[0] = search.startTime
      this.search.time[1] = search.endTime
      this.search.size = 'mini'
      this.search.active = search.active
      delete this.form.paramType
      this.$emit('search', this.form)
    },
    loadData() {
      this.form.startTime = this.search.time[0]
      this.form.endTime = this.search.time[1]
      this.form.active = this.search.active
      delete this.form.paramType
      this.loadAccountData()
      this.$emit('search', this.form)
    },
    clear() {
      this.deptArray = []
      this.search = {
        size: 'mini',
        active: 7,
        time: [moment().subtract(6, 'day').format('YYYY-MM-DD'), moment().subtract(0, 'day').format('YYYY-MM-DD')]
      }
      this.form = {
        deptIdChain: '',
        operatorId: '',
        platformId: '',
        teacherId: '',
        startTime: this.search.time[0],
        endTime: this.search.time[1]
      }

      this.loadData()
    },
    async loadUserLoginInfo() {
      const res = await deptTree()
      this.roleObject = res.data[0].children
      this.encapsulateData(res.data)
      this.deptTreeArray = this.roleObject
      this.loadUserNoPage()
    },
    loadPlatformData() {
      getPlatform().then(res => {
        if (res.success) {
          this.platformArray = res.data
        }
      })
    },
    visibleChangeD(events) {
      console.log('events: ', events)
      if (!events) {
        this.loadUserNoPage()
        let deptString = ''
        if (this.deptArray.length > 0) {
          deptString = deptString + '0-100-'
        }
        this.deptArray.some(item => {
          deptString += item + '-'
        })
        this.form.deptIdChain = deptString
        this.loadData()
      } else {
        let deptString = ''
        if (this.deptArray.length > 0) {
          deptString = deptString + '0-100-'
        }
        this.deptArray.some(item => {
          deptString += item + '-'
        })
        this.form.deptIdChain = deptString
        this.loadData()
      }
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
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('dataCommonUse', 1)
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async tearchFilter(query = '') {
      setTimeout(async() => {
        const res = await tearchFilter(query, this.tearchList)
        this.tearchArray[0].isHidden = query.length > 0
        this.tearchArray[1].options = res
      }, 300)
    },
    // 检测是否有常用
    async handleChangeTeacher() {
      if (this.form.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'dataCommonUse', this.form.teacherId)
        this.tearchArray = res
      }
      this.loadData()
    },
    loadUserNoPage() {
      const params = {
        deptId: this.deptArray[this.deptArray.length - 1] ? this.deptArray[this.deptArray.length - 1] : '',
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    timeChange(val) {
      this.search = val
      this.loadData()
    }
  }
}
</script>
<style>
.my-popover {
  padding: 0px !important; /* replace with your desired padding */
  box-sizing: border-box;
  width: 624px;
}
</style>
<style scoped lang="scss">
::v-deep {
  .el-timeline-item__tail{
    border-left: 2px solid #0C6FFF !important;
  }
}
.record_title{
  border-bottom: 1px solid #E7E7E7;
  padding: 24px;
  box-sizing: border-box;
  .title_name{
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
  .title_time{
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    margin-left: 8px;
  }
}
.record_details{
  padding: 16px 24px;
  box-sizing: border-box;
  .timeLine_content{
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
    background: #F4F8FF;
    .timeLine_content_title1{
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
    .timeLine_content_title2{
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
    .timeLine_content_old{
      font-size: 14px;
      font-weight: 400;
      color: #777777;
    }
    // .timeLine_content_new{
    //   font-size: 14px;
    //   font-weight: 400;
    //   color: #777777;
    // }
  }
  .user_info{
    margin-bottom: 16px;
    .user_info_platformImg{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #F5F5F5;
      margin-right: 8px;
    }
    .user_info_platformName{
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      margin-right: 8px;
    }
    .user_info_channel{
      background: #F2F9FF;
      border-radius: 4px;
      border: 1px solid #0C6FFF;
      font-size: 14px;
      font-weight: 400;
      color: #0C6FFF;
      padding: 4px 18px;
      box-sizing: border-box;
    }
  }
}
.top_search {
  width: 100%;
  // height: 75px;
  background: #fff;
  padding: 15px 20px;
  .changeRecord{
    font-size: 14px;
    font-weight: 500;
    color: #0C6FFF;
    cursor: pointer;
  }
  .search_title {
    width: 100%;
    height: 32px;
    .title_span {
        color: #333;
        height: 24px;
        font-size: 16px;
        line-height: 24px;
        margin-right: 10px;
        p {
            float: left;
            line-height: 24px;
            font-weight: bold;
        }
        em {
            float: left;
            width: 4px;
            height: 24px;
            border-radius: 6px;
            background: #0c6fff;
            margin-right: 8px;
        }
    }
    .count_nums {
        display: inline-block;
        width: 280px;
        line-height: 24px;
        em {
            float: left;
            width: 18px;
            height: 18px;
            margin-top: 3px;
            background-image: url(../../../../assets/image/video/icn_user.png);
            background-size: 100%;
            margin-right: 4px;
        }
        p {
            float: left;
            color: #777;
            font-size: 14px;
        }
        i {
            font-style: normal;
            margin-left: 4px;
            font-size: 16px;
            color: #333;
        }
    }
    .right_time_choose {
        float: right;
        height: 32px;
    }
  }

  .form_search {
    width: 100%;
    height: 45px;
    padding-top: 12px;
  }
}

.content-cls {
  width: 350px;
  padding-bottom: 5px;
  padding-left: 10px;
  p {
    width: 335px;
    font-size: 12px;
    line-height: 20px;
    margin-top: 2px;
  }
  span {
    width: 100%;
    display: block;
    line-height: 18px;
  }
}

</style>

