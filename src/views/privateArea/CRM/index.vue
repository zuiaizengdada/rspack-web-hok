<template>
  <!-- 智能销售 -->
  <MCard class="page_wrap">
    <div class="navHeader">
      <div
        v-for="(item, index) in pathList"
        :key="index"
        class="navItem"
        :class="{ active: getActive(item) }"
        @click="handlePath(item)"
      >
        {{ item.meta.title }}
      </div>
      <div
        v-for="item in tablsList"
        :key="item.value"
        class="navItem"
        :class="{ active: item.value === active }"
        @click="handleTab(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <template v-if="active === 'myTask'">
      <myTask />
    </template>
    <template v-if="active === 'allTask'">
      <allTask />
    </template>
    <template v-else-if="active === 'deptTask'">
      <deptTask />
    </template>
  </MCard>
</template>

<script>
// 当前路由地址
let layoutBox = {}
import allTask from './allTask/index'
import deptTask from './deptTask/index'
import { mapGetters } from 'vuex'
const tablsList = [
  {
    label: '部门任务',
    value: 'deptTask'
  },
  {
    label: '全部任务',
    value: 'allTask'
  }
]
export default {
  components: { allTask, deptTask },
  data() {
    return {
      revealTaskVisible: false,
      tablsList: tablsList,
      active: '',
      permsList: this.$route.meta.permsList || [],
      pathList: []
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'initPage'])
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    handleTab(item) {
      this.active = item.value
      this.$router.replace(`/privateArea/CRM?isDepTask=${item.value}`)
    },
    handlePath(item) {
      const bol = layoutBox?.meta?.noCache
      if (!bol) {
        this.$store.dispatch('table/setInitPage', {
          [layoutBox.path]: item?.path
        })
      }
      this.$router.push({ name: item.name })
    },
    getActive(item) {
      // 兼容4级路由
      const children =
        item?.children?.filter(
          i => i.name === this.$route.name || i.path === this.$route.path
        ) ?? []
      return this.$route.name === item.name || children.length
    },
    init() {
      this.tabList()
      this.pageInit()
      this.$uweb && this.$uweb.setAction('Event_salseTask_page')
    },
    getStorePath(j) {
      layoutBox = j
      const bol = layoutBox?.meta?.noCache
      if (bol) return j?.children[0]
      return (
        j.children?.find(item => item?.path === this.initPage[j?.path]) ||
        j.children[0]
      )
    },
    pageInit() {
      const path = this.$route.path
      const name = this.$route.name
      // 一级路由
      this.permission_routes?.forEach(i => {
        i.children &&
          i.children?.forEach(j => {
            if (j.path === path || j.name === name) {
              console.log(j.children)
              this.pathList = i.children
              if (j.children.length) {
                const isPath = this.getStorePath(j)
                this.$router.replace({ name: isPath.name })
              }
            }
          })
      })
    },
    tabList() {
      const isDepartment = this.permsList.includes('web:crm:departmentList')
      const isAll = this.permsList.includes('web:crm:allList')
      const { name } = this.$route
      if (name !== 'privateAreaCRM') return
      if (isDepartment && isAll) {
        this.tablsList = tablsList
      }
      if (isDepartment && !isAll) {
        this.tablsList = [tablsList[0]]
        this.active = this.tablsList[0].value
      }
      if (!isDepartment && isAll) {
        this.tablsList = [tablsList[1]]
        this.active = this.tablsList[0].value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  padding: 0 20px;
  min-width: 1300px;
  position: relative;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 20px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.navHeader {
  display: flex;
  border-bottom: 1px solid #eff2f6;
  padding-top: 20px;
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
.content {
  height: calc(100% - 36px);
}
</style>
