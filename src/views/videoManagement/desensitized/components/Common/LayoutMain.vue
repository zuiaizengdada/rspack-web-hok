<template>
  <div class="layout-main page-content">
    <div v-if="visibleBread" class="nav-bread flex justify-between">
      <div class="flex items-center">
        <span style="cursor: pointer" @click="toListPage">{{ list[1] }}</span>
        <i class="el-icon-arrow-right" />
        <p>{{ list[2] }}</p>
      </div>
    </div>
    <slot name="layout-wrapper" />
    <div class="buttons flex justify-center items-center py-6">
      <el-button
        v-if="visibleSave"
        type="primary"
        size="small"
        @click="handleClickSave"
        >保存</el-button
      >
      <slot name="button-extend" />
      <el-button
        v-if="visibleCancelBtn"
        size="small"
        @click="handleClickBack"
        >{{ cancelBtnTxt }}</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    visibleBread: {
      type: Boolean,
      default: false
    },
    visibleSave: {
      type: Boolean,
      default: true
    },
    isBackCallback: {
      type: Boolean,
      default: false
    },
    cancelBtnTxt: {
      type: String,
      default: '取消'
    },
    visibleCancel: {
      type: Boolean,
      default: true
    },
    visibleBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    visibleCancelBtn() {
      return this.visibleCancel
    }
  },
  mounted() {
    const { matched } = this.$route
    console.log('maaaaaaddddddddd: ', matched)
    matched.forEach(item => {
      this.list.push(item.meta.title)
    })
  },
  methods: {
    handleClickBack() {
      if (this.isBackCallback) {
        this.$emit('back')
      } else {
        this.$router.go(-1)
      }
    },
    handleClickSave() {
      this.$emit('save')
    },
    toListPage() {
      this.$router.push(`/videoDesensitiManage`)
    }
  }
}
</script>
<style lang="scss" scoped>
.layout-main {
  background: #fff;
  min-height: calc(100vh - 92px);
  border-radius: 10px;
  padding: 0 20px;
  overflow: hidden;
  .nav-bread {
    font-size: 16px;
    padding: 14px 0;
    border-bottom: 1px solid #eff2f6;
    span {
      color: #777;
    }
    i {
      font-size: 10px;
      font-weight: normal;
      margin: 0 5px;
    }
    p {
      color: #333;
    }
  }
}
</style>
