<template>
  <MCard class="page_wrap">
    <div class="navHeader">
      <span class="hover" @click="handleGoPath">{{ pathName }}</span>
      <img src="@/assets/image/left_icon.png" alt="" @click="handleGoPath" />
      <span>兜底任务线索</span>
    </div>
    <div class="navHeaderTab">
      <div
        v-for="(item, index) in tablsList"
        :key="index"
        class="navItem"
        :class="{ active: item.value === active }"
        @click="handleTab(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <succeed v-show="active === '1'" />
    <fail v-show="active === '2'" />
  </MCard>
</template>

<script>
import succeed from './succeed'
import fail from './fail'
const tablsList = [
  {
    value: '1',
    label: '执行成功'
  },
  {
    value: '2',
    label: '执行失败'
  }
]
export default {
  name: 'RevealTaskClue',
  components: { succeed, fail },
  data: () => ({
    pathName: '智能销售',
    tablsList,
    active: tablsList[0]
  }),
  watch: {
    $route: {
      handler(to) {
        this.setActive(to?.query?.success || '1')
      },
      immediate: true
    }
  },
  created() {
    const pathName = this.$route.query.path
    if (pathName === 'clue') this.pathName = '线索管理'
  },
  methods: {
    handleGoPath() {
      this.$router.go(-1)
    },
    handleTab(item) {
      this.$router.replace({
        path: `/privateArea/CRM/revealTaskClue?success=${item.value}`
      })
    },
    setActive(value) {
      this.active = value
    }
  }
}
</script>
<style lang="scss" scoped>
.page_wrap::v-deep {
  height: calc(100vh - 200px);
  min-width: 1300px;
  padding: 0;
  position: relative;
  .iconBox {
    display: flex;
    align-items: center;
    width: 65px;
    height: 24px;
    background: #e6f7ea;
    border-radius: 12px;
    font-size: 12px;
    justify-content: center;
    > img {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
  }
  .hover {
    cursor: pointer;
  }

  .hoverNum {
    cursor: pointer;
  }
  .tableBox {
    height: calc(100vh - 270px);
  }
  .navHeaderTab {
    display: flex;
    border-bottom: 1px solid #eff2f6;
    padding-top: 20px;
    padding-left: 20px;
    .navItem {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      border-bottom: 2px solid #fff;
      padding-bottom: 9px;
      margin-right: 20px;
      cursor: pointer;
    }
    .active {
      color: #0c6fff;
      border-color: #0c6fff;
    }
  }

  .navHeader {
    border-bottom: 1px solid #eff2f6;
    padding: 20px 0;
    padding-left: 20px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    > img {
      width: 20px;
      height: 20px;
      margin: 0 5px;
    }
    > span:nth-last-of-type(1) {
      font-weight: 400;
      color: #777777;
    }
  }
}
</style>
