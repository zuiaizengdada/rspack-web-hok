<template>
  <div>
    <el-table v-loading="loading" :data="data" border>
      <el-table-column prop="contentName" label="购买商品" />
      <el-table-column prop="goodsType" label="课程类型">
        <template slot-scope="{ row }">
          {{ {0:'图片',1:'音频', 2: '视频',3: '专栏',4:'大专栏',5:'公开课',6:'一对一',7:'落地班'}[row.goodsType] }}
        </template>
      </el-table-column>
      <el-table-column prop="learningType" label="学习状态">
        <template slot-scope="{ row }">
          {{ {1:'未学习',2:'学习中', 3: '已完成'}[row.learningType] }}
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="学习时长">
        <template slot-scope="{ row }">
          {{ row.duration | filterTime }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="learningRate" label="学习进度">
        <template slot-scope="{ row }">
          {{ row.learningRate }}%
        </template>
      </el-table-column> -->
      <el-table-column prop="createTime" label="首次学习时间" />
      <el-table-column prop="updateTime" label="最近学习时间" />
    </el-table>
  </div>
</template>

<script>
import { getUserProgress } from '@/api/user/member'
export default {
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      const params = {
        platformUserId: this.userId
      }
      getUserProgress(params).then(res => {
        this.data = res.data
        console.log(res, 'res')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
