<template>
  <el-form v-loading="loading">
    <el-form-item label="自嗨消息可见">
      <el-checkbox-group v-model="checkboxGroup" size="small" :disabled="loading">
        <el-checkbox label="teacherVisible" @click.native.stop="onChange('teacherVisible')">主讲</el-checkbox>
        <el-checkbox label="assistantVisible" @click.native.stop="onChange('assistantVisible')">助教</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { getLiveRoomAmuse, saveLiveRoomAmuse } from '@/api/liveRoom/index.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      checkboxGroup: []
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    onChange(res) {
      if (this.loading) { return this.$message.warn('正在提交中，请稍后') }
      this.$delModal({
        tips: `确定设置${res === 'teacherVisible' ? '主讲' : '助教'}${this.checkboxGroup.includes(res) ? '不可见' : '可见'}？`,
        success: () => {
          this.loading = true
          const data = {
            'assistantVisible': this.checkboxGroup.includes('assistantVisible'),
            'liveRoomId': this.$route.params.id,
            'teacherVisible': this.checkboxGroup.includes('teacherVisible')
          }
          saveLiveRoomAmuse(data).then(res => {
            this.getDetail()
          }).catch((err) => {
            console.log(err, 'err222')
            this.checkboxGroup.includes(res) ? this.checkboxGroup = this.checkboxGroup.filter(item => item !== res) : this.checkboxGroup.push(res)
            // this.checkboxGroup.includes(res) ? (this.checkboxGroup = this.checkboxGroup.filter(item => item !== res)) : this.checkboxGroup.push(res)
            this.loading = false
          })
        },
        fail: () => {
          this.checkboxGroup.includes(res) ? (this.checkboxGroup = this.checkboxGroup.filter(item => item !== res)) : this.checkboxGroup.push(res)
        }
      })
    },
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      getLiveRoomAmuse(data).then(res => {
        console.log(res, '获取自嗨设置')
        const checkboxGroup = []
        if (res && res.data) {
          res.data.assistantVisible && checkboxGroup.push('assistantVisible')
          res.data.teacherVisible && checkboxGroup.push('teacherVisible')
        }
        this.checkboxGroup = checkboxGroup
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    save() {}
  }
}
</script>

<style lang='scss' scoped>
</style>
