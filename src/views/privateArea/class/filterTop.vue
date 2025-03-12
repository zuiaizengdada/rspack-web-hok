<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" label-position="left" class="filter-module" :model="search" size="small" :inline="true">
        <el-form-item label="选择老师:">
          <el-select v-model="search.teacher" clearable filterable @clear="sureSearch">
            <el-option
              v-for="item in teacherList"
              :key="item.lecturerId"
              :label="item.lecturerName"
              :value="item.lecturerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="直播专栏:">
          <el-tag v-if="search.goods.contentName" class="m-r-10" closable @close="clearLive()">{{
            search.goods.contentName
          }}</el-tag>
          <el-button v-if="!search.goods.contentName" size="mini" @click="selectLiveColumn">选择</el-button>
        </el-form-item>
        <el-form-item v-if="search.goods.contentName" label="专栏期数:">
          <el-tag
            v-if="search.period.periodNum"
            class="m-r-10"
            closable
            @close="clearPeriod()"
          >{{ search.period.periodNum }}期</el-tag>
          <el-button v-if="!search.period.periodNum" @click="changePeriod">选择期数</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="sureSearch">筛选</el-button>
          <el-button size="mini" @click="clear()">清空</el-button>
          <el-button
            v-permission="['web:class:export', permsList]"
            class="exportBtn"
            size="mini"
            @click="exportOrderLive"
          >导出</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getTeachList, exportOrderLive } from '@/api/privateArea/class'
export default {
  name: 'FilterTop',
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          teacher: '',
          goods: { contentName: '' },
          period: { id: '', periodNum: '' }
        }
      }
    },
    type: {
      type: Number,
      default: 1 // 1: 全部, 2: 部门, 3: 我的
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  data() {
    return {
      loading: false,
      searchOpen: false,
      query: {},
      teacherList: [],
      typeList: {
        1: {
          teacherApi: '/lecturer/list',
          liveColumnApi: '/material/goods/live/page'
        },
        2: {
          teacherApi: '/lecturer/list/dept',
          liveColumnApi: '/material/goods/live/dept/list'
        },
        3: {
          teacherApi: '/lecturer/list/my',
          liveColumnApi: '/material/goods/live/my/list'
        }
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.getTeacherList()
  },
  methods: {
    sureSearch() {
      if (this.search.teacher && !this.search.goods.contentName) {
        return this.$message.error('请选择直播专栏和期数')
      }
      if (this.search.goods.contentName && !this.search.period.id) {
        return this.$message.error('请选择直播专栏和期数')
      }
      this.$emit('search', this.search)
    },
    getTeacherList() {
      this.loading = true
      getTeachList(this.typeList[this.type].teacherApi)
        .then((res) => {
          console.log(res, 'res')
          this.teacherList = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 清空
    clear() {
      console.log('点击清空')
      const search = {
        teacher: '',
        goods: { contentName: '' },
        period: { id: '', periodNum: '' }
      }
      this.$emit('search', search)
    },
    // 点击选择直播专栏
    selectLiveColumn() {
      let api = this.typeList[this.type].liveColumnApi
      if (this.search.teacher) {
        api = `/material/goods/live/list/by/teacher?teacherId=${this.search.teacher}`
      }
      this.$SelectGoods({
        visible: true,
        check: [],
        multiple: false,
        tabList: [{ id: '6', name: '直播专栏', api }],
        currentId: '6',
        success: (res) => {
          if (res.length > 0) {
            this.search.goods = res[0]
          }
          console.log(res, 'res')
        }
      })
    },
    // 清空选择的 直播专栏
    clearLive() {
      this.search.goods = { contentName: '' }
      this.search.period = { id: '', periodNum: '' }
    },
    changePeriod() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.search.goods.goodsId },
        success: (res) => {
          this.search.period = res
        }
      })
    },
    // 清空选择的期数
    clearPeriod() {
      this.search.period = { id: '', periodNum: '' }
    },
    // 点击导出
    exportOrderLive() {
      console.log(this.search)
      if (!this.search.period.id) {
        return this.$message.error('请选择直播专栏和期数')
      }
      if (this.search.teacher && !this.search.goods.contentName) {
        return this.$message.error('请选择直播专栏和期数')
      }
      if (this.search.goods.contentName && !this.search.period.id) {
        return this.$message.error('请选择直播专栏和期数')
      }
      this.loading = true
      const params = {
        goodsId: this.search.goods.goodsId,
        periodNum: this.search.period.periodNum,
        teacherId: this.search.teacher,
        queryType: this.type
      }
      exportOrderLive(params)
        .then((res) => {
          this.loading = false
          window.location = res.data
        })
        .catch(() => {
          this.loading = false
        })
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
    border-left: 1px solid #e7e7e7;
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

.el-input.filter-input .el-select {
  width: 100px;
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
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
.exportBtn {
  border-color: #3a8ee6;
  color: #3a8ee6;
}
</style>
