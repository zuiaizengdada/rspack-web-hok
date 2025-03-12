<template>
  <!-- 跟进详情 -->
  <div v-loading="loading" class="followDetail">
    <followDetailItem v-for="(detail, index) in arr" :key="index" :detail="detail" />
  </div>
</template>

<script>
import followDetailItem from './followDetailItem.vue'
import { followDetail } from '@/api/tearchCenter/tearchSharing'
export default {
  components: {
    followDetailItem
  },
  filters: {
  },
  props: {
    teacherId: {
      type: [String, null],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      arr: []
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 获取详情
    getDetail() {
      this.loading = true
      const data = {
        sharingTeacherId: this.teacherId
      }
      followDetail(data).then(res => {
        this.arr = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.followDetail {
  padding-bottom: 20px;
}
.m-b-8 {
  margin-bottom: 8px;
}
.tagStype{
  margin-bottom: 5px;
  margin-right: 5px;
}
</style>
