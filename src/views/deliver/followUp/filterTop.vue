<template>
  <div class="filter-module">
    <!-- 顶部筛选栏 -->
    <el-form ref="form" :model="form" label-width="auto" size="small" :inline="true">
      <el-form-item label="课程">
        <courseSelect
          ref="CourseSelect"
          :multiple="true"
          style="width: 200px"
          :tab-list="tabList"
          :default-id="form.goodsId"
          :current-id="tabList[0].id"
          :value="form.goodsName"
          @selected="courseSelect"
        />
      </el-form-item>
      <el-form-item label="助教姓名">
        <el-input v-model="form.assistantName" placeholder="请输入内容" clearable />
      </el-form-item>
      <el-form-item label="渠道来源">
        <m-select v-model="form.channelSourceList" multiple :all="true" :dict-list="channelSourceType" />
      </el-form-item>
      <el-form-item label="分配日期">
        <el-date-picker
          v-model="form.allocateTime"
          style="max-width: 240px"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @blur="currentTime = ''"
        />
      </el-form-item>
      <el-form-item label="订单创建日期">
        <el-date-picker
          v-model="form.orderCreateTime"
          style="max-width: 240px"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @blur="currentTime = ''"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleClickSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form></div>
</template>

<script>
import courseSelect from '../components/courseSelect.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'FilterTop',
  components: {
    courseSelect
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    search: {
      type: Object,
      default: () => {
        return {
          goodsName: [],
          goodsId: [],
          goods: [],
          goodsIdList: [], // 课程
          assistantName: '', // 助教姓名
          channelSourceList: [], // 渠道来源
          allocateTime: [], // 分配日期
          orderCreateTime: [] // 订单截至日期
        }
      }
    }
  },
  data() {
    return {
      tabList: [
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' },
        { id: '5', name: '线下课', api: '' }
      ],
      form: {},
      pickerOptions: {
        disabledDate: (time) => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime).subtract(1, 'years').valueOf()
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'channelSourceType',
      'pageSearchData'
    ])
  },
  watch: {
    search: {
      handler: function() {
        // 回调函数
        this.form = this.search
      },
      deep: true, // 深度监听
      immediate: true // 创建立即执行
    }
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    this.initSearch()
  },
  methods: {
    initForm() {
      this.form = {
        tearch: {
          lecturerId: '',
          lecturerName: ''
        },
        goodsName: [],
        goodsId: [],
        goods: [],
        deliveryTime: '',
        scheduleNum: '',
        scheduleStatus: '',
        costCheckStatus: ''
      }
      this.$setPageSearch({ ...this.form })
    },
    clear() {
      this.initForm()
      this.handleClickSearch()
    },
    courseSelect(val, keyList) {
      console.log(keyList)
      if (!keyList?.length) {
        this.form.goodsId = []
        this.form.goodsName = []
        this.form.goods = []
        return
      }

      // 存在选中状态
      // 合并过滤
      const newVal = [...val, ...this.form.goods]
      const copyVal = newVal.reduce((prev, cur) => {
        const bol = prev.some(item => item.goodsId === cur.goodsId)
        if (bol) return [...prev]
        return [...prev, cur]
      }, [])
      const list = copyVal.filter(item => keyList.includes(item.goodsId))
      this.form.goodsId = list.map(item => item.goodsId)
      this.form.goodsName = list.map(item => item.contentName || item.goodsName)
      this.form.goods = list.map(item => ({ goodsId: item.goodsId, goodsName: item.contentName || item.goodsName }))
    },
    handleClickSearch() {
      // 全局存储缓存数据
      if (!this.form?.goodsId?.length) {
        this.$message('必须选择课程才能搜索')
        return
      }
      this.$setPageSearch({ ...this.form })
      this.$emit('searchFn', this.form)
    },
    initSearch() {
      // 获取search缓存 数据
      const initSearchData = this.$getPageSearch()
      if (initSearchData.goods) {
        this.form.goodsId = initSearchData.goodsId
        this.form.goodsName = initSearchData.goodsName
        this.form.goods = initSearchData.goods
      }
      this.$emit('searchFn', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-module {
  // padding: 16px 20px 0 20px;
  padding-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  display: flex;
  .addView {
    display: flex;
    align-items: flex-end;
    padding-bottom: 18px;
  }
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
