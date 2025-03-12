<template>
  <div class="live-content">
    <div class="filter_top">
      <courseSearch :search="search" @search="searchFn" @insertOrEdit="insertOrEditFn" />
      <!-- <search /> -->
      <courseTable ref="courseTableData" :search="search" />
    </div>
  </div>
</template>

<script>
import courseTable from './components/courseTable.vue'
import courseSearch from './components/courseSearch.vue'
export default {
  components: {
    courseSearch,
    courseTable
  },
  data() {
    return {
      search: {
        pageIndex: 1,
        pageSize: 10,
        applySceneId: '',
        coursewareKeyword: '',
        coursewareName: '',
        coursewareVersion: '',
        teacherId: ''
      },
      goodsList: [],
      tableList: [],
      dataObject: {}
    }
  },
  mounted() {
    const teacherId = this.$route.query.teacherId
    this.search.teacherId = teacherId
  },

  methods: {
    searchFn(res) {
      this.search = {
        pageIndex: 1,
        pageSize: 10,
        applySceneId: '',
        coursewareKeyword: '',
        coursewareName: '',
        coursewareVersion: '',
        teacherId: ''
      }
      this.search = res
      // this.getList()
      console.log('this.search@@@@@@@@@@@@@@@@:', this.search)
      this.$refs.courseTableData.getCourseListData(this.search)
    },
    insertOrEditFn() {
      this.$router.push(`/pmanager/courseInsert`)
    }
  }
}
</script>

<style lang="scss" scoped>
.live-content {
  min-width: 1200px;
  padding: 16px;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 10px;
}
</style>
