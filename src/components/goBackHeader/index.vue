<template>
  <div class="goBack">
    <div class="back_icon" @click="goback" />
    <div class="back_content" @click="goback">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    content: {
      type: String,
      default: ''
    },
    deptId: {
      type: [Number || String],
      default: undefined
    },
    from: {
      type: String,
      default: ''
    }
  },
  methods: {
    goback() {
      if (this.from === 'department') {
        this.$router.push({
          path: `/business/transactionData`
        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goBack {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eff2f6;
  margin-bottom: 12px;
}
.back_content,
.back_icon {
  cursor: pointer;
}
.back_icon {
  margin-right: 12px;
  width: 8px;
  height: 8px;
  border-top: 1px solid #333333;
  border-left: 1px solid #333333;
  transform: rotate(-45deg);
}
.back_content {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
}
</style>
