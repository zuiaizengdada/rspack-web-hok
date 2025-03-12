<template>
  <div class="teacher-list-container">
    <el-scrollbar ref="scrollContainer" style="height: 100%">
      <div class="teacher-list-content">
        <el-card v-for="item in items" :key="item.id" shadow="hover" :body-style="{ padding: '0px' }" class="teacher-list-item" @click.native="getDetails(item)">
          <img :src="item.teacherUrl" class="image" />
          <div>{{ item.teacherName }}</div>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { teacherIndexList } from '@/api/tearchCenter/index'
export default {
  data() {
    return {
      items: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { data, code } = await teacherIndexList()
      if (code === 1) {
        this.items = data
      }
    },
    getDetails(item) {
      console.log(111)
      this.$emit('select',
        { teacherId: item.teacherId, teacherName: item.teacherName })
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-list-container{
    height: calc(100vh - 230px);
    .teacher-list-content{
        display: flex;
        flex-wrap: wrap;
        .teacher-list-item{
            display: flex;
            flex-direction: column;
            width: 208px;
            padding: 8px;
            margin: 20px 20px 0 0;
            color: #333333;
            font-size: 16px;
            text-align: center;
            border-radius: 6px;
            cursor: pointer;
            div{
                margin-top:8px ;
            }
            .image{
                height: 219px;
                width: 192px;
                border-radius: 6px;
            }
        }
    }

}
</style>
