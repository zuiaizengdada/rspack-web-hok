<template>
  <div>
    <filterTop @onSearch="handleSearch" />
    <div class="content">
      <list :isData="isData" :list="list" :total="total" @onSearch="getInit" @refresh="refresh"/>
      <listContent :isData="isData" :list="list" @onSearch="getInit" />
    </div>
  </div>
</template>
<script>
import filterTop from './components/filterTop.vue'
import list from './components/list.vue'
import listContent from './components/listContent.vue'
import { getPunchRecordPage } from '@/api/deliver/punch'
export default {
  components: {
    filterTop,
    list,
    listContent
  },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      total: 0,
      search: {
        user: { label: 'userPhone', value: '' }
      },
      page: {
        current: 1,
        size: 10
      },
      list: [],
      isData: true
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    handleSearch(val) {
      this.search = val
      this.refresh(1)
    },
    refresh(num) {
      if(num===1){
        this.isData=true;
      }
      this.page.current = num
      this.getInit()
    },
    async getInit() {
      console.log(32344323432,this.isData)
      if(!this.isData) return;
      const { code, data } = await getPunchRecordPage({
        ...this.page,
        punchId: this.$route.query.id,
        ...this.search,
        [this.search.user?.label]: this.search.user?.value,
        startTime: this.search.time?.length ? this.search.time[0] : '',
        endTime: this.search.time?.length ? this.search.time[1] : ''
      })
      if (code === 1) {
        this.total = data.total
        if (this.page.current === 1) {
          this.list = data.records
        } else {
          this.list = [...this.list, ...data.records]
        }
        console.log(3333, this.list)
        if (+data.total <= this.list.length) {
          this.isData = false
        } else {
          this.page.current++
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  display: flex;
  //   align-items: stretch;
}
</style>