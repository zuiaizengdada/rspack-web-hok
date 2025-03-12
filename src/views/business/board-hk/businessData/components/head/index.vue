<template>
  <div class="top-cls">
    <div class="data-search">
      <span class="left-title"> <i class="gun" /> <i v-if="form.deptId" class="el-icon-arrow-left" @click="backDeptData" /> {{ title }}</span>
      <span v-if="newTime" class="updata-time">更新时间：{{ newTime }}</span>
      <div v-if="form.deptId && !isQuanyu" class="switch-type" @click="changeIsRevenue">
        <div
          :class="{
            'switch-type-item': true,
            'switch-type-item-active': form.isRevenue
          }"
        >
          营收
        </div>
        <div
          :class="{
            'switch-type-item': true,
            'switch-type-item-active': !form.isRevenue
          }"
        >
          业绩
        </div>
      </div>
      <div class="right-search">
        <headDatePicker
          ref="HeadDatePickerRef"
          style="width: 636px"
          :show="[1, 2, 3, 4]"
          :search="form.time"
          :picker-options="pickerOptions"
          @change="timeChange"
          @blur="currentTime = ''"
        />
      </div>
    </div>
    <el-form ref="form" :inline="true" :model="form" size="small">
      <el-form-item label="部门">
        <el-cascader
          v-if="locked"
          ref="cascader1"
          v-model="deptIdArray"
          :options="getdeptList"
          :props="cascaderProps"
          :show-all-levels="false"
          :clearable="form.corpMangerFlag"
          @change="update"
        />
        <!-- <el-select
          v-model="form.deptId"
          placeholder="请选择"
          clearable
          @change="update"
        >
          <el-option
            v-for="item in deptList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select> -->
      </el-form-item>
      <!-- <el-form-item label="渠道">
        <el-select v-model="form.channelId" clearable @change="update">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in thirdShopDataType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="员工姓名" label-width="5em">
        <AppUserSelect class="w-200" @change="changeUser" />
      </el-form-item>
      <el-form-item label="商品类型">
        <el-select
          v-model="form.productCategory"
          clearable
          @change="productCategoryChange"
        >
          <el-option label="视频课" value="0" />
          <el-option label="直播课" value="1" />
          <el-option label="线下课" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="商品">
        <el-select
          v-model="form.goodsId"
          clearable
          multiple
          filterable
          :filter-method="getGoodsList"
          @change="goodsChange"
        >
          <el-option
            v-for="item in goodsList"
            :key="item.goodsId"
            :label="item.contentName"
            :value="item.goodsId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="IP老师">
        <TeacherSelect
          ref="teacherSelect"
          :default-tearch-id="form.teacherId"
          :value="form.lecturerName"
          @selected="teacherSelect"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="col-submit-btn"
          size="small"
          :loading="showLoading"
          @click="onSubmit"
        >
          查询
        </el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import headDatePicker from './headDatePicker/index.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
import AppUserSelect from '@/components/AppUserSelect'
import { getShowGoodsList } from '@/api/course'
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import { getItem } from '@/utils/localStorage'
export default {
  components: {
    headDatePicker,
    AppUserSelect,
    TeacherSelect
  },
  props: {
    newTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isQuanyu: false,
      locked: true,
      isContinue: true,
      deptIdArray: [],
      cascaderProps: {
        checkStrictly: true,
        value: 'id'
      },
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime)
              .subtract(1, 'years')
              .valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      form: {
        isRevenue: true,
        deptId: undefined,
        goodsId: [],
        channelId: '',
        contentName: '',
        searchName: '',
        productIdList: [],
        productPriceList: [],
        productCategory: '',
        itemIdList: '',
        time: {
          active: 1,
          time: []
        },
        corpMangerFlag: true
      },
      showLoading: false,
      goodsList: [],
      timeType: new Map([
        ['', ''],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4]
      ])
    }
  },
  computed: {
    ...mapGetters(['thirdShopDataType', 'deptList', 'orderType_options']),
    title() {
      return !this.form.deptId ? '企业经营数据' : '部门经营数据'
    },
    getdeptList() {
      return this.deptList?.length
        ? this.deptList?.map(item => {
          return {
            ...item,
            children: item.children?.map(childrenItem => ({
              ...childrenItem,
              children: null
            }))
          }
        })
        : []
    }
  },
  mounted() {
    const orgItem = getItem('orgInfo')
    if (orgItem.organizationId === 1006) {
      this.isQuanyu = true
    }
    if (sessionStorage.getItem('setBusinessDataSessionObject')) {
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      console.log('##################:', setBuObj)
      this.deptIdArray = setBuObj.deptIdArray || []
      // eslint-disable-next-line no-undef
      // this.$set(this, 'deptIdArray', setBuObj.deptIdArray)
      if (this.deptIdArray?.length > 0) {
        this.$emit('setDepartmentDeptArray', this.deptIdArray)
      }
      if (setBuObj.productCategory) {
        this.form.productCategory = setBuObj.productCategory
      }
      this.form.teacherId = setBuObj.teacherId || ''
      if (this.form.teacherId) {
        this.form.teacherIdList = [this.form.teacherId]
      } else {
        this.form.teacherIdList = []
      }
      this.form.lecturerName = setBuObj.lecturerName || ''
      this.goodsList = setBuObj.goodsList ? setBuObj.goodsList : []
      this.form.goodsId = setBuObj?.goodsId
      if (setBuObj.time) {
        this.form.time = setBuObj?.time
        this.form.startTime = this.form.time.time[0]
        this.form.endTime = this.form.time.time[1]
      } else {
        // this.from.time.active = 0
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()
        const string = year + '-' + (month < 10 ? '0' + month : month + '') + '-' + (day < 10 ? '0' + day : day + '')
        // this.from.time.time = [string, string]
        this.form.startTime = string
        this.form.endTime = string
      }
      if (this.isQuanyu) {
        setBuObj.isRevenue = false
      }
      this.update()
      this.$emit('moniAction', setBuObj)
    } else {
      this.update()
    }
  },
  created() {
    this.$watch('form.deptId', (newVal, oldVal) => {
      this.$nextTick(() => {
        this.$refs.HeadDatePickerRef.deptId = this.form.deptId
      })
    })
    console.log('this.form.time:::::::', this.form.time)
    this.$store.dispatch('option/getConfigChannelsource')
    this.$store.dispatch('option/getDeptList', { deptId: 0 })
    this.$store.dispatch('option/goodsPrices')
  },
  destroyed() {
  },
  methods: {
    backDeptData() {
      this.locked = false
      this.deptIdArray = this.deptIdArray.slice(0, (this.deptIdArray.length - 1))
      this.$nextTick(() => {
        this.locked = true
        this.update()
      })
    },
    fillCascaderData(ids) {
      this.locked = false
      this.deptIdArray = ids // ids
      this.$nextTick(() => {
        this.locked = true
      })
    },
    productCategoryChange() {
      this.$emit('change', {
        ...this.form,
        time: {
          active: this.timeType.get(this.form?.time?.active),
          time: this.form?.time?.time
            ? [this.form?.time?.time[0], this.form?.time?.time[1]]
            : []
        }
      })
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.productCategory = this.form.productCategory
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
    },
    changeIsRevenue() {
      this.form.changeIsRevenue = true
      this.form.isRevenue = !this.form.isRevenue
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.changeIsRevenue = this.form.changeIsRevenue
      setBuObj.isRevenue = this.form.isRevenue
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      // this.form.bizType = this.form.isRevenue ? 3 : 1
      this.onSubmit()
    },
    teacherSelect(val) {
      this.form.teacherId = val.lecturerId
      this.form.lecturerName = val.lecturerName
      this.form.teacherIdList = val.lecturerId ? [val.lecturerId] : undefined
      this.onSubmit()
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.teacherId = this.form.teacherId
      setBuObj.lecturerName = this.form.lecturerName
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
    },
    goodsChange(val) {
      console.log('::::::::::::::::::::::::::::', val)
      const oldDataList = []
      if (val) {
        val.some(obj => {
          this.goodsList.some(item => {
            if (item.goodsId === obj) {
              oldDataList.push(item)
            }
          })
        })
      }
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.goodsId = val
      setBuObj.goodsList = oldDataList
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.$emit('change', {
        ...this.form,
        time: {
          active: this.timeType.get(this.form?.time?.active),
          time: this.form?.time?.time
            ? [this.form?.time?.time[0], this.form?.time?.time[1]]
            : []
        }
      })
    },
    getGoodsList(val) {
      if (val) {
        this.form.searchName = val
      }
      getShowGoodsList({ contentName: val, current: 1, size: 500 }).then(
        res => {
          // this.goodsList = res.data.records
          var arr = [...res.data.records, ...this.goodsList].reduce((o, item) => {
            o[item.goodsId] = item
            return o
          }, {})
          arr = Object.keys(arr).map(n => arr[n])
          this.goodsList = arr
        }
      )
    },
    // 点击员工
    changeUser(res, info) {
      localStorage.setItem(
        'tmpFormPersonBoardHK',
        JSON.stringify({ ...this.form })
      )
      this.$router.push({
        path: '/business/personData',
        query: {
          uId: info.userId,
          deptId:
            info.deptId === Number(localStorage.getItem('userDeptId'))
              ? undefined
              : info.deptId,
          uName: info.nickName
        }
      })
    },
    onSubmit() {
      if (!this.isContinue) return
      this.showLoading = true
      const that = this
      setTimeout(() => {
        that.showLoading = false
      }, 2000)
      this.form.deptId = this.deptIdArray
        ? this.deptIdArray[this.deptIdArray.length - 1]
        : ''
      this.form.isRevenue = this.isQuanyu ? false : this.form.isRevenue
      this.$emit(
        'change',
        {
          ...this.form,
          time: {
            active: this.timeType.get(this.form?.time?.active),
            time: this.form?.time?.time
              ? [this.form?.time?.time[0], this.form?.time?.time[1]]
              : []
          }
        },
        {}
      )
    },
    resetForm() {
      if (!this.isContinue) return
      this.form = {
        isRevenue: !this.isQuanyu,
        deptId: this.form.corpMangerFlag ? '' : this.form.deptId,
        channelId: '',
        contentName: '',
        productIdList: [],
        productPriceList: [],
        corpMangerFlag: this.form.corpMangerFlag,
        time: {
          active: 1,
          time: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
        }
      }
      if (this.form.corpMangerFlag) {
        this.deptIdArray = []
      } else {
        this.deptIdArray =
          this.deptIdArray.length > 1 ? [this.deptIdArray[0]] : this.deptIdArray
        this.form.deptId =
          this.deptIdArray.length > 1 ? this.deptIdArray[0] : this.form.deptId
      }
      this.$emit('setDepartmentDeptArray', this.deptIdArray)
      const setBuObj = {}
      setBuObj.isRevenue = this.form.isRevenue
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.$emit('resetForm', { ...this.form })
    },
    // 更新form数据
    update() {
      this.form.deptId = this.deptIdArray
        ? this.deptIdArray[this.deptIdArray.length - 1]
        : undefined
      if (!this.form.deptId) {
        this.form.isRevenue = !this.isQuanyu
      }
      this.$nextTick(() => {
        this.$refs.HeadDatePickerRef.deptId = this.form.deptId
      })
      this.$emit('change', {
        ...this.form,
        time: {
          active: this.timeType.get(this.form?.time?.active),
          time: this.form?.time?.time
            ? [this.form?.time?.time[0], this.form?.time?.time[1]]
            : []
        }
      })
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.deptIdArray = this.deptIdArray
      setBuObj.isRevenue = this.form.isRevenue
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
    },
    timeChange(val) {
      console.log('dddddddd:', val)
      this.form.time = val
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.time = this.form.time
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.loadOverviewData()
    },
    loadOverviewData() {
      this.$emit('change', {
        ...this.form,
        time: {
          active: this.timeType.get(this.form?.time?.active),
          time: this.form?.time?.time
            ? [this.form?.time?.time[0], this.form?.time?.time[1]]
            : []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.data-search {
  width: 100%;
  margin-bottom: 20px;
  .switch-type {
    width: 146px;
    height: 28px;
    background: #e8ebee;
    border-radius: 4px;
    padding: 1px;
    display: inline-block;
    margin-left: 24px;
    .switch-type-item {
      display: inline-block;
      padding: 4px 24px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #424242;
      cursor: pointer;
      user-select: none;
    }
    .switch-type-item-active {
      background: #ffffff;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2474ff;
    }
  }
  .updata-time {
    margin-left: 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }
  .left-title {
    width: 100px;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    font-family: '微软雅黑';
    .gun {
      width: 4px;
      height: 24px;
      margin-top: 3px;
      float: left;
      background: #0c6fff;
      border-radius: 8px;
    }
  }
  .right-search {
    float: right;
    height: 30px;
    .date-choose {
      margin-left: 10px;
      position: relative;
      .data_icon {
        position: absolute;
        top: 11px;
        right: 10px;
        z-index: 9;
        color: #c0c4cc;
        font-size: 14px;
        transform: translateY(-50%);
      }
      ::v-deep .el-range__close-icon {
        position: absolute;
        right: 10px;
        top: 11px;
        transform: translateY(-50%);
      }
    }
  }
}
.input-box {
  display: flex;
  align-items: center;
  padding: 0 15px;
}
.input-box,
.input-box1 {
  width: 196px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #dcdfe6;
}
.input-box1 {
  overflow: hidden;
  text-align: center;
}

.el-icon-arrow-left {
  cursor: pointer;
}
</style>
