<template>
  <div class="top-cls">
    <div class="data-search">
      <span class="left-title"> <i class="gun" />{{ title }}</span>
      <span v-if="newTime" class="updata-time">更新时间：{{ newTime }}</span>
      <div class="right-search">
        <headDatePicker
          ref="HeadDatePicker"
          style="width: 558px"
          :show="[0, 7, 'month', 'year']"
          :search="form.time"
          :picker-options="pickerOptions"
          @change="timeChange"
          @blur="currentTime = ''"
        />
      </div>
    </div>
    <el-form ref="form" :inline="true" :model="form" size="small">
      <el-form-item label="部门">
        <el-cascader ref="cascader1" v-model="deptIdArray" :options="deptList" :props="cascaderProps" :show-all-levels="false" @change="update" />
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
      <el-form-item label="渠道">
        <el-select v-model="form.channelId" clearable @change="update">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in thirdShopType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="老师">
        <TeacherSelect
          ref="teacherSelect"
          :default-tearch-id="form.teacherId"
          :value="form.lecturerName"
          @selected="teacherSelect"
        />
      </el-form-item>
      <el-form-item label="员工姓名" label-width="5em">
        <AppUserSelect class="w-200" @change="changeUser" />
      </el-form-item>
      <el-form-item label="商品">
        <el-select
          v-model="form.goodsId"
          clearable
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
      <el-form-item label="价格">
        <el-select
          v-model="form.productPriceList"
          clearable
          multiple
          @change="update"
        >
          <el-option
            v-for="item in goodsPrices_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
import AppUserSelect from '@/components/AppUserSelect'
import { getShowGoodsList } from '@/api/course'

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
        deptId: undefined,
        teacherId: '',
        lecturerName: '',
        channelId: '',
        contentName: '',
        productIdList: [],
        productPriceList: [],
        goodsId: undefined,
        time: {
          active: 0,
          time: []
        }
      },
      showLoading: false,
      goodsInfo: [],
      goodsList: [],
      timeType: new Map([
        ['', ''],
        [0, 0],
        [1, 1],
        [7, 2],
        ['month', 3],
        ['year', 4]
      ])
    }
  },
  computed: {
    ...mapGetters([
      'thirdShopType',
      'deptList',
      'orderType_options',
      'goodsPrices_options'
    ]),
    title() {
      return !this.form.deptId ? '企业经营数据' : '部门经营数据'
    }
  },
  created() {
    this.$store.dispatch('option/getConfigChannelsource')
    this.$store.dispatch('option/getDeptList', { deptId: 0 })
    this.$store.dispatch('option/goodsPrices')
    this.$store.dispatch('option/getThridShopType')
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.deptId) {
        this.form.deptId = Number(this.$route.query.deptId)
      }
    })
  },
  methods: {
    teacherSelect(val) {
      this.form.teacherId = val.lecturerId
      this.form.lecturerName = val.lecturerName
      this.update()
      this.$emit('updataForm', this.form)
    },
    goodsChange(val) {
      if (val) {
        const info = this.goodsList.find(item => item.goodsId === val)
        this.goodsInfo = [info]
        this.form.contentName = info.contentName
        this.form.productIdList = [val]
      } else {
        this.form.contentName = ''
        this.form.productIdList = []
        this.goodsInfo = []
      }
      this.$emit('change', {
        ...this.form,
        time: {
          active: this.timeType.get(this.form.time.active),
          time: this.form.time.time
            ? [this.form.time.time[0], this.form.time.time[1]]
            : []
        }
      })
    },
    getGoodsList(val) {
      getShowGoodsList({ contentName: val, current: 1, size: 500 }).then(
        res => {
          this.goodsList = res.data.records
        }
      )
    },
    // 点击员工
    changeUser(res, info) {
      sessionStorage.setItem(
        'personalDataQuery',
        JSON.stringify({
          ...this.form,
          time: {
            active: this.form.time.active,
            time: this.form.time.time
              ? [this.form.time.time[0], this.form.time.time[1]]
              : []
          },
          ...{ goodsInfo: this.goodsInfo }
        })
      )
      this.$router.push({
        path: `/business/personalData?type=${info.userId}&name=${info.nickName}`
      })
    },
    onSubmit() {
      this.showLoading = true
      const that = this
      setTimeout(() => {
        that.showLoading = false
      }, 2000)
      this.form.deptId = this.deptIdArray ? this.deptIdArray[this.deptIdArray.length - 1] : ''
      this.$emit(
        'change',
        {
          ...this.form,
          time: {
            active: this.timeType.get(this.form.time.active),
            time: this.form.time.time
              ? [this.form.time.time[0], this.form.time.time[1]]
              : []
          }
        },
        { ...this.goodsInfo }
      )
    },
    resetForm() {
      this.form = {
        deptId: '',
        channelId: '',
        contentName: '',
        productIdList: [],
        productPriceList: [],
        time: {
          active: 0,
          time: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
        }
      }
      this.goodsInfo = []
      this.$emit('resetForm', { ...this.form })
    },
    // 更新form数据
    update() {
      this.form.deptId = this.deptIdArray ? this.deptIdArray[this.deptIdArray.length - 1] : ''
      this.$emit('change', {
        ...this.form,
        time: {
          active: this.timeType.get(this.form.time.active),
          time: this.form.time.time
            ? [this.form.time.time[0], this.form.time.time[1]]
            : []
        }
      })
    },
    timeChange(val) {
      this.form.time = val
      this.loadOverviewData()
    },
    loadOverviewData() {
      this.$emit('change', {
        ...this.form,
        time: {
          active: this.timeType.get(this.form.time.active),
          time: this.form.time.time
            ? [this.form.time.time[0], this.form.time.time[1]]
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
</style>
