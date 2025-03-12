<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-row>
        <el-form-item label="线索ID" label-width="55px">
          <el-input
            v-model.trim="search.clueId"
            class="w-200"
            placeholder="请输入线索编号"
            clearable
            maxlength="20"
            @input="e => delNoNumber1(e, 'clueId')"
          />
        </el-form-item>
        <el-form-item label="投放平台">
          <el-select
            v-model="search.launchPlatform"
            class="w-200"
            placeholder="请选择"
            clearable
            @change="launchPlatformChange"
            @clear="$emit('onSearch')"
          >
            <el-option
              v-for="item in launchPlatformOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <svg-icon :icon-class="item.icon" />
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放类型">
          <el-select
            v-model="search.launchPlatType"
            :disabled="!search.launchPlatform"
            class="w-200"
            placeholder="请选择"
            clearable
            @clear="$emit('onSearch')"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in launchPlatList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间查询">
          <el-select
            v-model="search.time.label"
            placeholder="请选择"
            style="width: 140px; margin-right: 8px"
          >
            <el-option
              v-for="item in searTimeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="search.time.value"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 225px"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="分配团队">
          <el-cascader
            v-model="search.assignTeam"
            class="w-200"
            placeholder="请选择"
            :options="assignTeamOption"
            :props="{
              checkStrictly: true,
              label: 'deptName',
              value: 'deptId',
              emitPath: false
            }"
            clearable
            :show-all-levels="false"
            @clear="$emit('onSearch')"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="投放员工">
          <el-select
            v-model="search.adProductUserId"
            filterable
            placeholder="请选择投放员工"
            clearable
            @change="searchFn"
          >
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="广告主ID">
          <el-input
            v-model="search.advertiserID"
            class="w-200"
            placeholder="请输入广告主ID"
            clearable
            maxlength="30"
            @clear="$emit('onSearch')"
            @input="e => delNoNumber2(e, 'advertiserID')"
          />
        </el-form-item>
        <el-form-item label="成交意向">
          <el-select
            v-model="search.dealIntention"
            class="w-200"
            placeholder="请选择"
            clearable
            @clear="$emit('onSearch')"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in dealIntentionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成交课程价格">
          <el-select
            v-model="search.coursePrice"
            multiple
            class="w-200"
            placeholder="请选择"
            clearable
            @clear="$emit('onSearch')"
          >
            <el-option
              v-for="item in coursePriceOption"
              :key="item.value"
              :label="item.code"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="意向上课地点">
          <el-select
            v-model="search.transactionCoursePrice"
            class="w-200"
            placeholder="请选择"
            clearable
            @clear="$emit('onSearch')"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="(item, index) in transactionCoursePriceOption"
              :key="index"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label="下单商品名称">
            <el-autocomplete
              v-model="search.orderingCommodityName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入商品内容"
              clearable
              @select="$emit('onSearch')"
              @clear="$emit('onSearch')"
            />
          </el-form-item>
          <el-form-item label="线索信息">
            <el-select
              v-model="search.clueInfo.label"
              placeholder="请选择"
              style="width: 140px; margin-right: 8px"
              @change="clueInfoChange"
            >
              <el-option
                v-for="item in clueInfoOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-input
              v-if="search.clueInfo.label === 2"
              v-model.trim="search.clueInfo.value"
              style="width: 225px"
              clearable
              maxlength="11"
              @input="e => delNoNumber3(e)"
            />
            <el-autocomplete
              v-else
              v-model="search.clueInfo.value"
              style="width: 225px"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              clearable
              @select="handleSelect"
            />
          </el-form-item>
          <el-form-item label="线索状态">
            <el-select
              v-model="search.clueType.label"
              placeholder="请选择"
              style="width: 140px; margin-right: 8px"
            >
              <el-option
                v-for="item in clueTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="search.clueType.value"
              placeholder="请选择"
              style="width: 140px; margin-right: 8px"
              clearable
              @clear="$emit('onSearch')"
            >
              <el-option
                v-for="item in clueTypeStatus[search.clueType.label]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="账号ID">
            <el-input
              v-model="search.advertiserAccount"
              class="w-200"
              placeholder="请输入账号ID"
              clearable
              maxlength="30"
              @clear="$emit('onSearch')"
              @input="e => delNoNumber2(e, 'advertiserAccount')"
            />
          </el-form-item>
          <el-form-item label="是否撞单">
            <el-select
              v-model="search.isSameContact"
              class="w-200"
              placeholder="请选择"
              clearable
              @clear="$emit('onSearch')"
            >
              <el-option
                v-for="item in isSameContactArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="分配销售人员">
            <el-input
              v-model.trim="search.erpDistributeUserName"
              class="w-200"
              placeholder="请输入分配销售人员名称"
              clearable
              maxlength="20"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchFn">查询</el-button>
            <el-button @click="onhandleClear">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col class="footerExport">
          <div>
            <el-button
              v-loading="exportLoading"
              size="small"
              class="btn_primary"
              @click="onhandleExport"
            >导出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  clueTypeStatus,
  clueInfoOption,
  clueTypeOption,
  dealIntentionOption,
  launchPlatformOption,
  launchPlatOption,
  searTimeOption
} from './columns'
import {
  clueListTaskToExport,
  getLxUrl,
  getLikelyAddress,
  getClueNameBlur,
  getTransactionPrice,
  getClueGoodsNameBlur,
  getDeptTree
} from '@/api/business/clue'
import { filtersMoneyByZero } from '@/filters/index'
import { userNoPage } from '@/api/addressBookApi'
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          isSameContact: '',
          adProductUserId: '',
          clueId: '', // 线索ID
          launchPlatform: '', // 投放平台
          launchPlatType: '', // 投放类型
          advertiserAccount: '', // 账号ID
          time: { label: 'time1', value: '' }, // 时间查询
          advertiserID: '', // 广告主ID
          orderingCommodityName: '', // 下单商品名称
          assignTeam: '', // 分配团队
          dealIntention: '', // 成交意向
          coursePrice: '', // 成交课程价格
          transactionCoursePrice: '', // 意向上课地点
          clueInfo: { label: 'name', value: '' }, // 线索信息
          clueType: { label: 'assignmentStatus', value: '' }, // 线索状态
          erpDistributeUserName: '' // 分配销售人员
        }
      }
    }
  },
  data() {
    return {
      userArray: [],
      clueInfoOption,
      launchPlatOption,
      launchPlatformOption,
      searTimeOption,
      assignTeamOption: [],
      dealIntentionOption,
      coursePriceOption: [],
      transactionCoursePriceOption: [],
      clueTypeOption,
      clueTypeStatus,
      exportLoading: false,
      restaurants: [],
      goodsNameList: [],
      isSameContactArray: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  },
  computed: {
    launchPlatList() {
      if (this.search.launchPlatform === 1) {
        return this.launchPlatOption[0]
      } else if (this.search.launchPlatform === 3) {
        return this.launchPlatOption[1]
      } else if (this.search.launchPlatform === 6 || this.search.launchPlatform === 7) {
        return this.launchPlatOption[3]
      } else {
        return this.launchPlatOption[2]
      }
    }
  },
  mounted() {
    this.getSearOption()
    this.loadUserNoPage()
  },
  methods: {
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    launchPlatformChange() {
      this.search.launchPlatType = ''
    },
    // 限制输入英文数字和汉字
    delNoNumber(e, key) {
      this.search[key] = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    delNoNumber3(e) {
      this.search.clueInfo.value = e.replace(/[^0-9]/g, '')
    },
    // 限制输入数字
    delNoNumber1(e, key) {
      this.search[key] = e.replace(/[^0-9]/g, '')
    },
    // 限制输入英文数字
    delNoNumber2(e, key) {
      this.search[key] = e.replace(/[^\a-\z\A-\Z0-9]/g, '')
    },
    // 点击查询按钮
    searchFn() {
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onhandleClear() {
      this.$emit('onClear')
    },
    // 点击导出按钮
    onhandleExport() {
      this.exportLoading = true
      const params = {
        // pageIndex: this.config.currentPage,
        // pageSize: this.config.pageSize,
        isSameContact: this.search.isSameContact,
        adProductUserId: this.search.adProductUserId
          ? this.search.adProductUserId
          : null,
        adPlatform: this.search.launchPlatform, // 投放平台
        advertiserId: this.search.advertiserID, // 广告主ID
        beginTime: this.search.time.value ? this.search.time.value[0] : '', // 起始时间
        endTime: this.search.time.value ? this.search.time.value[1] : '', // 截止时间
        advertiserAccount: this.search.advertiserAccount, // 账号ID
        timeType: this.search.time.label, // 时间查询类型 1线索入库时间 2分配时间3首次跟订单时间 4首次出单时间
        clueId: this.search.clueId, // 线索ID
        clueInfo: this.search.clueInfo.label,
        clueInfoContent: this.search.clueInfo.value, // 线索信息
        clueStatus: this.search.clueType.label, // 线索状态1分配 2转化 3到场
        clueStatusContent: this.search.clueType.value, // 线索状态
        clueType: this.search.launchPlatType, // 投放类型
        goodsName: this.search.orderingCommodityName, // 下单商品名称
        groupId: this.search.assignTeam, // 分配团队ID
        intentionLocation: this.search.transactionCoursePrice, // 意向上课地点
        transactionIntention: this.search.dealIntention, // 成交意向
        transactionPrice: this.search.coursePrice.join(',') // 成交课程价格
      }
      clueListTaskToExport(params)
        .then(res => {
          /* this.exportLoading = false
          var newWin = window.open('loading page', '_self')
          newWin.location.href = res.data // 成功 重定向到目标页面 */
          if (res.code === 1) {
            this.downloadExecl(res.data.taskId)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    downloadExecl(taskId) {
      const param = {
        taskId: taskId
      }
      getLxUrl(param).then(res => {
        console.log('sssssss: ', res)
        if (res.code === 1 && res.data.status === 2) {
          this.exportLoading = false
          window.open(res.data.path, 'blank')
        } else {
          const that = this
          setTimeout(function () {
            that.downloadExecl(res.data.taskId)
          }, 1500)
        }
      })
    },
    // 获取查询栏数据
    getSearOption() {
      getLikelyAddress().then(res => {
        console.log(res, '意向上课地点查询')
        this.transactionCoursePriceOption = res.data
      })
      getClueNameBlur({ name: '' }).then(res => {
        console.log(res, '线索姓名查询')
        this.restaurants = res.data
      })
      getTransactionPrice().then(res => {
        console.log(res, '成交课程价格')
        res.data.map(v => {
          v.code = filtersMoneyByZero(v.value)
        })
        this.coursePriceOption = res.data
      })
      getDeptTree().then(res => {
        console.log(res, '部门数据结构')
        this.assignTeamOption = this._T(res.data)
      })
    },
    querySearchAsync(queryString, cb) {
      getClueGoodsNameBlur({ goodsName: queryString }).then(res => {
        console.log(res)
        cb(res.data)
      })
    },
    _T(dataArr) {
      const result = dataArr.reduce((prev, next) => {
        prev[next.fatherDeptId]
          ? prev[next.fatherDeptId].push(next)
          : (prev[next.fatherDeptId] = [next])
        return prev
      }, {})
      Object.keys(result).map(key => {
        result[key].map((item, i) => {
          result[item.deptId] ? (item.children = result[item.deptId]) : ''
        })
      })
      console.log(result, 'result')
      return result['']
    },
    changeDept() {
      const checkUser = []
      if (this.search.operateName) {
        checkUser.push({
          nickName: this.search.clueInfo.userName,
          userId: this.search.clueInfo.value
        })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        ifAll: true,
        checkUser,
        success: res => {
          if (res.user.length > 0) {
            this.search.clueInfo.userName = res.user[0].nickName
            this.search.clueInfo.value = res.user[0].userId
            this.$emit('onSearch')
          }
        }
      })
    },
    onhanldeDeptClear() {
      this.search.clueInfo.userName = ''
      this.search.clueInfo.value = ''
    },
    clueInfoChange() {
      this.search.clueInfo.userName = ''
      this.search.clueInfo.value = ''
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect() {
      this.$emit('onSearch')
    },
    onhandleAdvertiserIDSelect(res) {
      console.log(res)
      this.search.advertiserID = res.advertiserId
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.footerExport {
  width: 200px;
  display: flex;
  justify-content: flex-end;
}
</style>
